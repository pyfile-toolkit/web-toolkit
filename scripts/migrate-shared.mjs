#!/usr/bin/env node
/* migrate-shared.mjs — идемпотентно подключает assets/styles.css и assets/site.js
   ко всем HTML-страницам сайта. Путь корректируется для guides/ (../assets/...).
   Не трогает содержимое <style> и логику. Безопасен для повторного запуска. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MARK_CSS = 'assets/styles.css';
const MARK_JS = 'assets/site.js';

function collectHtml(dir){
  const out=[];
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if(e.name==='node_modules'||e.name.startsWith('.')) continue;
    const p=path.join(dir,e.name);
    if(e.isDirectory()) out.push(...collectHtml(p));
    else if(e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const files = collectHtml(ROOT);
let changed=0, skipped=0;

for(const f of files){
  const rel = path.relative(ROOT, f);
  const depth = rel.split(path.sep).length - 1;      // 0 = корень, 1 = guides/
  const prefix = depth>0 ? '../'.repeat(depth) : '';
  const cssHref = prefix + MARK_CSS;
  const jsSrc   = prefix + MARK_JS;

  let html = fs.readFileSync(f,'utf8');
  const hasCss = html.includes(MARK_CSS);
  const hasJs  = html.includes(MARK_JS);
  if(hasCss && hasJs){ skipped++; continue; }

  let add = '';
  if(!hasCss) add += `<link rel="stylesheet" href="${cssHref}">\n`;
  if(!hasJs)  add += `<script src="${jsSrc}" defer></script>\n`;

  if(/<\/head>/i.test(html)){
    html = html.replace(/<\/head>/i, add + '</head>');
  } else if(/<body[^>]*>/i.test(html)){
    html = html.replace(/<body[^>]*>/i, m => m + '\n' + add);
  } else {
    console.warn('SKIP (no head/body):', rel); continue;
  }
  fs.writeFileSync(f, html);
  changed++;
}

console.log(`migrated: ${changed}, already-ok: ${skipped}, total: ${files.length}`);