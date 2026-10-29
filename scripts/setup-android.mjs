import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

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
const pluginSource = readFileSync(join(root, 'native', 'NativeAuthPlugin.java.template'), 'utf8')
  .replaceAll('__PACKAGE__', packageName);
writeFileSync(join(pluginDirectory, 'NativeAuthPlugin.java'), pluginSource);

let updatedActivity = mainActivity.replace(
  /^\s*registerPlugin\([^;\r\n]*NativeAuthPlugin\.class\);\s*\r?\n/gm,
  '',
);
const registration = `registerPlugin(${packageName}.NativeAuthPlugin.class);`;
const onCreate = /public\s+void\s+onCreate\s*\(\s*Bundle\s+savedInstanceState\s*\)\s*\{/;
if (onCreate.test(updatedActivity)) {
  updatedActivity = updatedActivity.replace(onCreate, (signature) => `${signature}\n        ${registration}`);
} else {
  const classDeclaration = /(class\s+MainActivity\s+extends\s+BridgeActivity\s*\{)/;
  if (!classDeclaration.test(updatedActivity)) {
    throw new Error('Could not register the account plugin in MainActivity.');
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
}
writeFileSync(mainActivityPath, updatedActivity);

console.log('Android project is ready with native account-session support.');

await import('./generate-icons.mjs');
