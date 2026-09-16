// Rewrites ?v= on local CSS/JS links in every HTML page to a hash of the file's
// contents, so browsers refetch an asset exactly when it changes.
// Run: npm run stamp (before committing CSS/JS changes)
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const root = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const skip = new Set(['node_modules', '.git', '.github']);

function htmlFiles(dir) {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return skip.has(name) ? [] : htmlFiles(path);
    return name.endsWith('.html') ? [path] : [];
  });
}

const hashes = new Map();
function hashOf(file) {
  if (!hashes.has(file)) hashes.set(file, createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 8));
  return hashes.get(file);
}

let changed = 0;
for (const page of htmlFiles(root)) {
  const html = readFileSync(page, 'utf8');
  const out = html.replace(/((?:href|src)=")([^"?#:]+\.(?:css|js))(?:\?v=[^"]*)?"/g, (match, attr, url) => {
    const file = url.startsWith('/') ? join(root, url) : join(dirname(page), url);
    try { return `${attr}${url}?v=${hashOf(file)}"`; } catch { return match; }
  });
  if (out !== html) { writeFileSync(page, out); changed++; console.log('stamped', page.slice(root.length + 1)); }
}
console.log(`${changed} file(s) updated`);
