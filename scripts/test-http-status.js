const fs=require('fs');
const html=fs.readFileSync('http-status-codes.html','utf8');
const src=html.match(/<script>([\s\S]*?)<\/script>/g).slice(-1)[0].replace(/<\/?script>/g,'');
const getCodes=new Function(src.slice(0, src.indexOf('const DATA'))+'; return CODES;');
const CODES=getCodes();
const codes=CODES.filter(c=>c[0]===Math.floor(c[0]));
const res=[];
function eq(n,a,e){const ok=a===e;res.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' got='+a+' exp='+e));}
// invariants
eq('unique', new Set(codes.map(c=>c[0])).size===codes.length, true);
eq('range 100..599', codes.every(c=>c[0]>=100&&c[0]<600), true);
eq('all named', codes.every(c=>c[1].length>=2), true);
eq('has 200 OK', codes.some(c=>c[0]===200&&c[1]==='OK'), true);
eq('has 301', codes.some(c=>c[0]===301), true);
eq('has 404', codes.some(c=>c[0]===404), true);
eq('has 500', codes.some(c=>c[0]===500), true);
eq('has teapot 418', codes.some(c=>c[0]===418&&c[2]===1), true);
// actual class inventory
const by={}; codes.forEach(c=>{const k=Math.floor(c[0]/100);by[k]=(by[k]||0)+1;});
console.log('inventory:', ['1xx','2xx','3xx','4xx','5xx'].map((l,i)=>l+'='+by[i+1]).join(' '));
console.log('total codes:', codes.length);
// search logic
const search=(q)=>{q=q.trim().toLowerCase();return codes.filter(c=>String(c[0]).indexOf(q)>=0||c[1].toLowerCase().indexOf(q)>=0).length;};
eq('search 404 -> 1', search('404'), 1);
eq('search redirect -> 2 (307/308)', search('redirect'), 2);
eq('search ok -> 1 (200 OK)', search('ok'), 1);
console.log(res.join('\n'));
console.log('TOTAL '+res.filter(r=>r.startsWith('PASS')).length+'/'+res.length);
