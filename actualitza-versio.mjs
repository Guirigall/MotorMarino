// Run after modifying any published app asset, before uploading the complete folder.
import fs from 'node:fs';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
const swPath=path.join(root,'sw.js'),source=fs.readFileSync(swPath,'utf8');
const assets=JSON.parse(source.match(/const ASSETS = (\[[\s\S]*?\]);/)[1].replaceAll("'",'"'));
const indexPath=path.join(root,'index.html');
const dependencies=JSON.parse(fs.readFileSync(path.join(root,'dependency-roots.json'),'utf8'));
const index=fs.readFileSync(indexPath,'utf8');
fs.writeFileSync(indexPath,index.replace(/(<script id="pwa-dependencies" type="application\/json">)[\s\S]*?(<\/script>)/,(_,a,b)=>a+JSON.stringify(dependencies).replaceAll('<','\\u003c')+b));
const hash=crypto.createHash('sha256');
hash.update(source.replace(/const VERSION = '[^']+';/,"const VERSION = '';"));
for(const relative of [...new Set(assets.map(f=>f==='./'?'./index.html':f))].sort()){
 hash.update(relative);hash.update(fs.readFileSync(path.join(root,relative)));
}
const version=hash.digest('hex').slice(0,16);
fs.writeFileSync(swPath,source.replace(/const VERSION = '[^']+';/,`const VERSION = '${version}';`));
fs.writeFileSync(path.join(root,'VERSION.txt'),`Sala de màquines 3YM20 PWA\nBuild ${version}\n`);
console.log('Build '+version);
