const upper='ABCDEFGHIJKLMNOPQRSTUVWXYZ', lower='abcdefghijklmnopqrstuvwxyz', nums='0123456789', sym='!@#$%^&*()_+-=[]{};:,.<>?';
function makeGen(len,qty,useU,useL,useN,useS){
  let pool='';
  if(useU)pool+=upper; if(useL)pool+=lower; if(useN)pool+=nums; if(useS)pool+=sym;
  if(!pool)pool=lower;
  const run=()=>{const a=new Uint32Array(len);(globalThis.crypto||require('crypto').webcrypto).getRandomValues(a);let s='';for(let i=0;i<len;i++)s+=pool[a[i]%pool.length];return s;};
  const pw=[];for(let q=0;q<qty;q++)pw.push(run());
  const bits=pool.length;const entropy=Math.round(len*Math.log2(bits));
  return {pw,pool,entropy};
}
const okSet = (s,pool)=>[...s].every(c=>pool.includes(c));
const results=[]; const check=(n,c)=>results.push((c?'PASS':'FAIL')+' '+n);

// 16 chars, all sets
let r=makeGen(16,4,true,true,true,true);
check('len16', r.pw.every(p=>p.length===16));
check('chars-all', r.pw.every(p=>okSet(p,r.pool)));
check('qty4', r.pw.length===4);
check('unique4', new Set(r.pw).size===4);
check('entropy-all', r.entropy===Math.round(16*Math.log2(r.pool.length)));

// numbers only
r=makeGen(8,1,false,false,true,false);
check('len8', r.pw[0].length===8);
check('digits-only', /^\d+$/.test(r.pw[0]));

// all disabled -> fallback lowercase
r=makeGen(10,1,false,false,false,false);
check('fallback-lower', /^[a-z]+$/.test(r.pw[0]));

// distribution: over 400 samples all 4 sets represented (statistical smoke)
let U=false,L=false,N=false,S=false;
for(let i=0;i<400;i++){const p=makeGen(20,1,true,true,true,true).pw[0];U=U||[...p].some(c=>upper.includes(c));L=L||[...p].some(c=>lower.includes(c));N=N||[...p].some(c=>nums.includes(c));S=S||[...p].some(c=>sym.includes(c));}
check('has-upper', U); check('has-lower', L); check('has-number', N); check('has-symbol', S);

console.log(results.join('\n'));
console.log('TOTAL '+results.filter(r=>r.startsWith('PASS')).length+'/'+results.length);
