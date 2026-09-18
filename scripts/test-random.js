const fs=require('fs');
const html=fs.readFileSync('random-number-generator.html','utf8');
const src=html.match(/<script>([\s\S]*?)<\/script>/g).slice(-1)[0].replace(/<\/?script>/g,'');
let core=src.slice(src.indexOf('function randInt'), src.indexOf('function roll'));
core+=src.slice(src.indexOf('function fisherYates'), src.indexOf('function show'));

// stub crypto
global.crypto={getRandomValues(a){ for(let i=0;i<a.length;i++) a[i]=Math.floor(Math.random()*0xFFFFFFFF); return a; }};
const fn=new Function('crypto', core+'; return {randInt,fisherYates};');
const {randInt,fisherYates}=fn(global.crypto);
const res=[];
function eq(n,a,e){const ok=a===e;res.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' got='+JSON.stringify(a)+' exp='+JSON.stringify(e)));}
// bounds over many draws
let okB=true, seen=new Set();
for(let i=0;i<20000;i++){ const v=randInt(1,100); if(v<1||v>100){ console.log('OUT OF RANGE',v); okB=false; break; } }
eq('bounds 1-100', okB, true);
// negative ranges
let okN=true;
for(let i=0;i<5000;i++){ const v=randInt(-10,10); if(v<-10||v>10) okN=false; }
eq('bounds -10..10', okN, true);
// swapped args
eq('swapped', (()=>{ let ok=true; for(let i=0;i<3000;i++){ const v=randInt(50,5); if(v<5||v>50) ok=false; } return ok; })(), true);
// uniform smoke: 1-6 dice over 6000 draws, each face appears
const dist={}; for(let i=0;i<6000;i++){ const v=randInt(1,6); dist[v]=(dist[v]||0)+1; }
eq('dice all faces', Object.keys(dist).length===6, true);
eq('dice fair-ish', Math.max(...Object.values(dist))-Math.min(...Object.values(dist))<600, true);
// fisher-yates: unique, count, within range
const fy=fisherYates(1,50,10);
eq('fy count', fy.length, 10);
eq('fy unique', new Set(fy).size===10, true);
eq('fy in range', fy.every(v=>v>=1&&v<=50), true);
// unique with count == span (exact lottery)
const fy2=fisherYates(1,5,5);
eq('fy full set', fy2.slice().sort((a,b)=>a-b).join(','), '1,2,3,4,5');
console.log(res.join('\n'));
console.log('TOTAL '+res.filter(r=>r.startsWith('PASS')).length+'/'+res.length);
