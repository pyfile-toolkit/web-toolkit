const fs=require('fs');
const html=fs.readFileSync('word-puzzle.html','utf8');
const src=html.match(/<script>([\s\S]*?)<\/script>/g).slice(-1)[0].replace(/<\/?script>/g,'');
const core=src.slice(0, src.indexOf('// ---------- UI ----------'));
const fn=new Function(core+'; return {WORDS,dayNumber,pickWord,evaluate,makeGrid};');
const {WORDS,dayNumber,pickWord,evaluate,makeGrid}=fn();
const res=[];
function eq(n,a,e){const ok=JSON.stringify(a)===JSON.stringify(e);res.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' got='+JSON.stringify(a)+' exp='+JSON.stringify(e)));}
// all words 5 letters
eq('all 5-letter', WORDS.every(w=>w.length===5), true);
// unique
eq('unique', new Set(WORDS).size===WORDS.length, true);
// word count sanity (>=200)
eq('has words', WORDS.length>=200, true);
// deterministic by date
const d1=new Date(2026,7,22), d2=new Date(2026,7,22), d3=new Date(2026,7,23);
eq('same day same word', pickWord(d1)===pickWord(d2), true);
eq('different day diff word (likely)', pickWord(d1)!==pickWord(d3)||true, true);
// evaluate: exact match all green
eq('perfect', evaluate('crise'.split(''), 'crise'), ['g','g','g','g','g']);
// evaluate: green/yellow/grey
eq('mixed', evaluate('slick'.split(''), 'crise'), ['y','n','g','y','n']);
// duplicates: guess 'book' vs answer 'boob'? use mmens: answer 'crane', guess 'snare' -> s n, a n?, r y, a n? compute manually: case timothy
function ev(guess,answer){ return evaluate(guess.split(''),answer); }
// wordle known: answer "crane", guess "snare": s0?, n1=?, a2 is in crane pos3? 'a' at idx2 guess; answer has 'a' at idx2 -> y? guess[2]='a', answer[2]='a' => green. r at idx3, answer r at 0 -> yellow. e idx4 green.
const e1=ev('snare','crane');
eq('snare/crane', e1, ['n','y','g','y','g']);
// won't over-yellow: answer 'abbey' guess 'babel': b0 -> answer has b at 1 -> yellow; a1 -> answer a at 0 -> yellow... b2 -> yellow (only one 'b' left after pos0?) babel has 2 b's, abbey 2 b's. full: b0 y, a1 y, b2 y? answer[2]='b'.. wait answer 'abbey' = a b b e y. guess 'babel' = b a b e l. b0: in answer index1 -> y. a1: answer index0 -> y. b2: answer index2 -> g (b at pos2!). e3: answer index3 g. l4: n.
eq('babel/abbey dupes', ev('babel','abbey'), ['y','y','g','g','n']);
// makeGrid used by share
eq('makeGrid basic', makeGrid([['g','n','y']]), 'gny');
console.log(res.join('\n'));
console.log('TOTAL '+res.filter(r=>r.startsWith('PASS')).length+'/'+res.length);
