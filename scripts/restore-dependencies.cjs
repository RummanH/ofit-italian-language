const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const cacache = require('C:/Program Files/nodejs/node_modules/npm/node_modules/cacache');
const cmdShim = require('C:/Program Files/nodejs/node_modules/npm/node_modules/cmd-shim');

(async () => {
  const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
  const root = process.cwd();
  let restored = 0;
  for (const [relative, entry] of Object.entries(lock.packages)) {
    if (!relative) continue;
    if (entry.os && !entry.os.includes(process.platform)) continue;
    if (entry.cpu && !entry.cpu.includes(process.arch)) continue;
    const directory = path.resolve(relative);
    if (!directory.startsWith(path.join(root, 'node_modules') + path.sep)) throw new Error('Unexpected dependency path');
    const name = relative.split('node_modules/').pop();
    const resolved = entry.resolved || 'https://registry.npmjs.org/' + name + '/-/' + name.split('/').pop() + '-' + entry.version + '.tgz';
    if (!entry.resolved) {
      const info = await cacache.get.info('.npm-cache/_cacache', 'make-fetch-happen:request-cache:' + resolved);
      if (info) { entry.resolved = resolved; entry.integrity = info.integrity; }
    }
    if (relative !== 'node_modules/next') {
      fs.mkdirSync(directory, { recursive: true });
      const archive = path.resolve('.npm-cache/restore.tgz');
      await cacache.get.copy('.npm-cache/_cacache', 'make-fetch-happen:request-cache:' + resolved, archive);
      execFileSync('tar.exe', ['-xzf', archive, '-C', directory, '--strip-components=1'], { stdio: 'pipe' });
      fs.unlinkSync(archive);
      restored++;
    }
    const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'));
    const bins = typeof manifest.bin === 'string' ? { [manifest.name.split('/').pop()]: manifest.bin } : manifest.bin || {};
    for (const [name, file] of Object.entries(bins)) await cmdShim(path.join(directory, file), path.resolve('node_modules/.bin', name));
  }
  fs.writeFileSync('package-lock.json', JSON.stringify(lock, null, 2) + '\n');
  console.log('Restored', restored, 'packages from verified local cache archives.');
})().catch(error => { console.error(error); process.exitCode = 1; });
