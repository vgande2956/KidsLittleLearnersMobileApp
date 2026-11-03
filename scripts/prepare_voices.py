"""Builds the bundled offline voices (Piper, MIT) into native/tts-assets for the Android app.

Requires: pip install onnx onnxruntime
Output layout (copied into the APK assets by scripts/setup-android.mjs):
  native/tts-assets/en/{model.onnx,tokens.txt}   English  (en_US-hfc_female-medium, int8)
  native/tts-assets/te/{model.onnx,tokens.txt}   Telugu   (te_IN-maya-medium, int8)
  native/tts-assets/espeak-ng-data/              phonemizer data
"""
import io
import json
import shutil
import tarfile
import urllib.request
from pathlib import Path

import onnx
from onnxruntime.quantization import QuantType, quantize_dynamic

SHERPA = "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models"
HF = "https://huggingface.co/rhasspy/piper-voices/resolve/main/te/te_IN/maya/medium/te_IN-maya-medium.onnx"
out = Path(__file__).resolve().parent.parent / "native" / "tts-assets"
work = out.parent / ".tts-work"
shutil.rmtree(out, ignore_errors=True)
work.mkdir(exist_ok=True)


def fetch(url):
    with urllib.request.urlopen(url) as response:
        return response.read()


def extract(url, dest):
    with tarfile.open(fileobj=io.BytesIO(fetch(url)), mode="r:bz2") as archive:
        archive.extractall(dest)


extract(f"{SHERPA}/espeak-ng-data.tar.bz2", out)
extract(f"{SHERPA}/vits-piper-en_US-hfc_female-medium-int8.tar.bz2", work)
en = next(work.glob("vits-piper-en_US-hfc_female-medium-int8"))
(out / "en").mkdir(parents=True)
shutil.copy(next(en.glob("*.onnx")), out / "en" / "model.onnx")
shutil.copy(en / "tokens.txt", out / "en" / "tokens.txt")

# Telugu is not published in sherpa format: add the sherpa metadata, write tokens, quantize to int8.
(work / "te.onnx").write_bytes(fetch(HF))
config = json.loads(fetch(HF + ".json").decode("utf-8"))
model = onnx.load(str(work / "te.onnx"))
for key, value in dict(model_type="vits", comment="piper", language="Telugu", voice="te",
                       has_espeak="1", n_speakers="1", sample_rate="22050").items():
    prop = model.metadata_props.add()
    prop.key, prop.value = key, value
onnx.save(model, str(work / "te_meta.onnx"))
(out / "te").mkdir()
with open(out / "te" / "tokens.txt", "w", encoding="utf-8") as tokens:
    for symbol, ids in config["phoneme_id_map"].items():
        tokens.write(f"{symbol} {ids[0]}\n")
quantize_dynamic(str(work / "te_meta.onnx"), str(out / "te" / "model.onnx"), weight_type=QuantType.QUInt8)
shutil.rmtree(work)
print("Voices ready in", out)
