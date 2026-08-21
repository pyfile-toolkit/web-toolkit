const fs=require('fs');
const html=fs.readFileSync('/tmp/web-toolkit/color-converter.html','utf8');
globalThis.clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
globalThis.toHexByte=(n)=>n.toString(16).padStart(2,'0');
function grabFn(name){
  const st=html.indexOf('function '+name+'(');
  if(st<0)return null;
  const fs_=html.indexOf('{',st);let d=0,i=fs_,inS=null;
  for(;i<html.length;i++){const ch=html[i];
    if(inS){if(ch==='\\'){i++;continue;}if(ch===inS)inS=null;continue;}
    if(ch==='"'||ch==="'"||ch==='`'){inS=ch;continue;}
    if(ch==='/'){if(html[i+1]==='/'){while(i<html.length&&html[i]!=='\n')i++;}else if(html[i+1]==='*'){i+=2;while(i<html.length&&!(html[i]==='*'&&html[i+1]==='/'))i++;i++;}}
    if(ch==='{')d++; else if(ch==='}'){d--; if(d===0){i++;break;}}}
  return new Function('return ('+html.slice(st,i)+');')();
}
const parseColor=grabFn('parseColor');
const rgbToHex=grabFn('rgbToHex');
const rgbToHsl=grabFn('rgbToHsl');
const results=[];
function eq(a,b){return JSON.stringify(a)===JSON.stringify(b);}
function check(n,got,exp){const ok=eq(got,exp);results.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' got='+JSON.stringify(got)+' exp='+JSON.stringify(exp)));}
check('hex6', parseColor('#3b82f6'), {r:59,g:130,b:246,alpha:1});
check('hex-noHash', parseColor('ff0000'), {r:255,g:0,b:0,alpha:1});
check('hex-short', parseColor('#abc'), {r:170,g:187,b:204,alpha:1});
check('hex8-alpha', parseColor('#ff000080'), {r:255,g:0,b:0,alpha:0x80/255});
check('rgb', parseColor('rgb(59,130,246)'), {r:59,g:130,b:246,alpha:1});
check('rgba', parseColor('rgba(255,0,0,0.5)'), {r:255,g:0,b:0,alpha:0.5});
check('rgb-pct', parseColor('rgb(100%, 0%, 0%)'), {r:255,g:0,b:0,alpha:1});
check('hsl', parseColor('hsl(217,91%,60%)'), {r:60,g:131,b:246,alpha:1});
check('hsl-red', parseColor('hsl(0,100%,50%)'), {r:255,g:0,b:0,alpha:1});
check('hsl-teal', parseColor('hsl(174,74%,46%)'), {r:30,g:204,b:187,alpha:1});
check('toHex', rgbToHex(59,130,246), '#3b82f6');
check('toHsl', rgbToHsl(59,130,246), {h:217,s:91,l:60});
check('toHsl-red', rgbToHsl(255,0,0), {h:0,s:100,l:50});
check('toHsl-gray', rgbToHsl(128,128,128), {h:0,s:0,l:50});
console.log(results.join('\n'));
console.log('TOTAL '+results.filter(r=>r.startsWith('PASS')).length+'/'+results.length);
