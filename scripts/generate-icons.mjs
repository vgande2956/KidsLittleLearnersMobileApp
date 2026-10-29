import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const logo = join(root, 'app', 'images', 'little-learners-logo-transparent.png');
const resDir = join(root, 'android', 'app', 'src', 'main', 'res');

if (!existsSync(logo)) throw new Error(`Missing launcher logo: ${logo}`);

const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
const background = { r: 255, g: 255, b: 255, alpha: 1 };

// Fit the logo inside a square canvas, leaving `padding` as a fraction of the edge.
async function render(size, padding, flatten, round) {
  const inner = Math.round(size * (1 - padding * 2));
  const art = await sharp(logo).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  let image = sharp({ create: { width: size, height: size, channels: 4, background: flatten ? background : { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: art, gravity: 'center' }]);
  if (round) {
    const mask = Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`);
    image = sharp(await image.png().toBuffer()).composite([{ input: mask, blend: 'dest-in' }]);
  }
  return image.png().toBuffer();
}

for (const [name, scale] of Object.entries(densities)) {
  const directory = join(resDir, `mipmap-${name}`);
  mkdirSync(directory, { recursive: true });
  const legacy = Math.round(48 * scale);
  const adaptive = Math.round(108 * scale);
  await sharp(await render(legacy, 0.06, true, false)).toFile(join(directory, 'ic_launcher.png'));
  await sharp(await render(legacy, 0.06, true, true)).toFile(join(directory, 'ic_launcher_round.png'));
  await sharp(await render(adaptive, 0.2, false, false)).toFile(join(directory, 'ic_launcher_foreground.png'));
}

console.log('Launcher icons generated from the Little Learners logo.');
