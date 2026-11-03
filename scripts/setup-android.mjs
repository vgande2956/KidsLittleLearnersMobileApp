import { execFileSync } from 'node:child_process';
import { cpSync, createWriteStream, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const root = process.cwd();
const androidDir = join(root, 'android');

if (!existsSync(androidDir)) {
  const capacitorCli = join(root, 'node_modules', '@capacitor', 'cli', 'bin', 'capacitor');
  execFileSync(process.execPath, [capacitorCli, 'add', 'android'], { cwd: root, stdio: 'inherit' });
}

function findMainActivity(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      const found = findMainActivity(path);
      if (found) return found;
    } else if (entry.name === 'MainActivity.java') {
      return path;
    }
  }
  return null;
}

const mainActivityPath = findMainActivity(join(androidDir, 'app', 'src', 'main', 'java'));
if (!mainActivityPath) throw new Error('Could not find the generated Android MainActivity.java.');

const mainActivity = readFileSync(mainActivityPath, 'utf8');
const packageName = mainActivity.match(/^package\s+([\w.]+);/m)?.[1];
if (!packageName) throw new Error('Could not determine the generated Android application package.');

const pluginDirectory = join(androidDir, 'app', 'src', 'main', 'java', ...packageName.split('.'));
mkdirSync(pluginDirectory, { recursive: true });
const plugins = [
  ['NativeAuthPlugin', 'NativeAuthPlugin.java.template'],
  ['NativePiperPlugin', 'NativePiperPlugin.java.template'],
];
for (const [name, template] of plugins) {
  const source = readFileSync(join(root, 'native', template), 'utf8').replaceAll('__PACKAGE__', packageName);
  writeFileSync(join(pluginDirectory, `${name}.java`), source);
}

let updatedActivity = mainActivity.replace(/^\s*registerPlugin\([^;\r\n]*Native\w+Plugin\.class\);\s*\r?\n/gm, '');
const registration = plugins.map(([name]) => `registerPlugin(${packageName}.${name}.class);`).join('\n        ');
const onCreate = /public\s+void\s+onCreate\s*\(\s*Bundle\s+savedInstanceState\s*\)\s*\{/;
if (onCreate.test(updatedActivity)) {
  updatedActivity = updatedActivity.replace(onCreate, (signature) => `${signature}\n        ${registration}`);
} else {
  const classDeclaration = /(class\s+MainActivity\s+extends\s+BridgeActivity\s*\{)/;
  if (!classDeclaration.test(updatedActivity)) {
    throw new Error('Could not register the native plugins in MainActivity.');
  }
  updatedActivity = updatedActivity.replace(
    classDeclaration,
    `$1\n    @Override\n    public void onCreate(Bundle savedInstanceState) {\n        ${registration}\n        super.onCreate(savedInstanceState);\n    }`,
  );
  if (!updatedActivity.includes('import android.os.Bundle;')) {
    updatedActivity = updatedActivity.replace(
      /^package\s+[\w.]+;\s*/m,
      (packageDeclaration) => `${packageDeclaration}\nimport android.os.Bundle;\n`,
    );
  }
}writeFileSync(mainActivityPath, updatedActivity);

// Offline voices: sherpa-onnx runtime (.aar) plus the Piper models from scripts/prepare_voices.py.
const SHERPA_VERSION = '1.13.8';
const libsDir = join(androidDir, 'app', 'libs');
const aarPath = join(libsDir, `sherpa-onnx-${SHERPA_VERSION}.aar`);
if (!existsSync(aarPath)) {
  mkdirSync(libsDir, { recursive: true });
  const url = `https://github.com/k2-fsa/sherpa-onnx/releases/download/v${SHERPA_VERSION}/sherpa-onnx-${SHERPA_VERSION}.aar`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not download ${url}`);
  await pipeline(Readable.fromWeb(response.body), createWriteStream(aarPath));
}

const gradlePath = join(androidDir, 'app', 'build.gradle');
let gradle = readFileSync(gradlePath, 'utf8');
if (!gradle.includes('sherpa-onnx')) {
  gradle = gradle.replace(
    /(defaultConfig\s*\{)/,
    `$1\n        ndk { abiFilters 'arm64-v8a', 'armeabi-v7a' }`,
  ).replace(
    /(dependencies\s*\{)/,
    `$1\n    implementation(name: 'sherpa-onnx-${SHERPA_VERSION}', ext: 'aar')\n    implementation 'org.jetbrains.kotlin:kotlin-stdlib:1.9.24'`,
  );
  writeFileSync(gradlePath, gradle);
}

const voiceSource = join(root, 'native', 'tts-assets');
const voiceTarget = join(androidDir, 'app', 'src', 'main', 'assets', 'tts');
if (existsSync(voiceSource)) {
  rmSync(voiceTarget, { recursive: true, force: true });
  cpSync(voiceSource, voiceTarget, { recursive: true });
} else {
  console.warn('native/tts-assets is missing: run "python scripts/prepare_voices.py" to bundle the offline voices.');
}
console.log('Android project is ready with native account-session and offline voice support.');

await import('./generate-icons.mjs');
