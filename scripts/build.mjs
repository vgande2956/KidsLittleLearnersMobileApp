import { build } from 'esbuild';
import { cpSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const www = join(root, 'www');

rmSync(www, { recursive: true, force: true });
cpSync(join(root, 'app'), www, { recursive: true });

await build({
  entryPoints: [join(root, 'native', 'bridge.js')],
  outfile: join(www, 'native-bridge.js'),
  bundle: true,
  platform: 'browser',
  target: 'es2020',
  minify: true,
});

const indexPath = join(www, 'index.html');
const html = readFileSync(indexPath, 'utf8')
  .replace(/<link rel="manifest"[^>]*>\s*/, '')
  .replace('<script src="app.js" defer></script>', '<script src="native-bridge.js"></script><script src="app.js" defer></script>');
if (!html.includes('native-bridge.js')) throw new Error('Could not inject native-bridge.js into index.html.');
writeFileSync(indexPath, html);

console.log('Built www/ from app/');
