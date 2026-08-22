const fs=require('fs');
const html=fs.readFileSync('pomodoro-timer.html','utf8');
const src=html.match(/<script>([\s\S]*?)<\/script>/g).slice(-1)[0].replace(/<\/?script>/g,'');
const fn=new Function(src.slice(0, src.indexOf('// ---------- state ----------'))+'; return {formatTime,nextMode};');
const {formatTime,nextMode}=fn();
const res=[];
function eq(n,a,e){const ok=a===e;res.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' got='+a+' exp='+e));}
eq('fmt 1500', formatTime(1500), '25:00');
eq('fmt 0', formatTime(0), '00:00');
eq('fmt 61', formatTime(61), '01:01');
eq('fmt 150', formatTime(150), '02:30');
// after focus: cycle1 -> short; cycle4 -> long; after break -> focus
eq('cycle1 short', nextMode('focus',1), 'short');
eq('cycle4 long', nextMode('focus',4), 'long');
eq('cycle8 long', nextMode('focus',8), 'long');
eq('cycle2 short', nextMode('focus',2), 'short');
eq('break->focus', nextMode('short',1), 'focus');
eq('long->focus', nextMode('long',4), 'focus');
console.log(res.join('\n'));
console.log('TOTAL '+res.filter(r=>r.startsWith('PASS')).length+'/'+res.length);
