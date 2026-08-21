const fs=require('fs');
const html=fs.readFileSync('lorem-ipsum-generator.html','utf8');
const src=html.match(/<script>([\s\S]*?)<\/script>/g).slice(-1)[0].replace(/<\/?script>/g,'');
const fn=new Function(src.slice(0, src.indexOf('function gen'))+'; return {WORDS, makeText, STARTER};');
const {makeText,STARTER}=fn();
const res=[];
function eq(n,a,e){const ok=a===e;res.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' got='+JSON.stringify(a)+' exp='+JSON.stringify(e)));}
// paragraphs
const p=makeText(3,'p',true,false);
eq('3 paragraphs', p.split('\n\n').length, 3);
eq('classic start', p.startsWith('Lorem ipsum dolor sit amet,'), true);
// no classic
const p2=makeText(2,'p',false,false);
eq('no classic first para not STARTER', p2.startsWith(STARTER), false);
// sentences count
const s=makeText(4,'s',false,false);
eq('4 sentences (newline-joined)', s.split('\n\n').length, 4);
// words unit: ~count words
const w=makeText(10,'w',false,false);
const wc=w.split(' ').length;
eq('word count close', wc>=8&&wc<=14, true);
// html wrapping
const h=makeText(2,'p',false,true);
eq('html p count', (h.match(/<p>/g)||[]).length, 2);
eq('html closes', (h.match(/<\/p>/g)||[]).length, 2);
// caps
eq('starts uppercase', /^[A-Z]/.test(s), true);
console.log(res.join('\n'));
console.log('TOTAL '+res.filter(r=>r.startsWith('PASS')).length+'/'+res.length);
