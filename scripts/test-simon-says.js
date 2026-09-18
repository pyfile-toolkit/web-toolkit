const res=[];
function eq(n,a,e){const ok=a===e;res.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' got='+a+' exp='+e));}
// sequence: random ints 0-3, growing by 1 each level; simulate a game
let seq=[], level=0;
function step(idx){ // returns true if correct replay so far
  if(idx!==seq[inputIdx]) return false;
  inputIdx++;
  return true;
}
// validate correct input advances, wrong fails
seq=[1,2,3]; let inputIdx=0;
eq('ok1', step(1), true);
eq('ok2', step(2), true);
eq('wrong', step(0), false);
// level increments on full replay
inputIdx=0; // simulate 3 correct: time advances level & appends random
for(let k=0;k<3;k++){ if(!step(seq[k])) break; }
eq('completed3', inputIdx===3, true);
// best tracking
let best=0;
function onFail(level){ if(level>best) best=level; }
onFail(5); eq('best5', best, 5);
onFail(3); eq('best stays5', best, 5);
onFail(9); eq('best9', best, 9);
// random 0-3 bounds over 1000 draws
let min=9,max=-1; for(let i=0;i<1000;i++){const r=Math.floor(Math.random()*4); if(r<min)min=r; if(r>max)max=r;}
eq('rand 0..3', min===0&&max===3, true);
console.log(res.join('\n'));
console.log('TOTAL '+res.filter(r=>r.startsWith('PASS')).length+'/'+res.length);
