const res=[];
function eq(n,a,e){const ok=a===e;res.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' got='+a+' exp='+e));}
function toSec(v){ const n=parseFloat(v); if(!isFinite(n))return null; return n<1e11?n:Math.floor(n/1000); }
// known vectors: 0 -> 1970-01-01T00:00:00Z; 1724256000 -> 2024-08-21T16:00:00Z
eq('epoch0→sec',toSec('0'),0);
eq('ms→sec',toSec('1724256000000'),1724256000);
eq('sec stays',toSec('1724256000'),1724256000);
eq('neg',toSec('-100'),-100);
eq('nan',toSec('abc'),null);
eq('float sec',toSec('1724256000.5'),1724256000.5);
const d0=new Date(0*1000); eq('epoch0 is 1970', d0.toISOString(),'1970-01-01T00:00:00.000Z');
const d1=new Date(1724256000*1000); eq('1724256000 is 2024-08-21T16:00Z', d1.toISOString(),'2024-08-21T16:00:00.000Z');
// ms conversion identity: Date.now()-ish round trip
const now=1700000000000; eq('13digit→10digit', toSec(now), 1700000000);
console.log(res.join('\n'));
console.log('TOTAL '+res.filter(r=>r.startsWith('PASS')).length+'/'+res.length);
