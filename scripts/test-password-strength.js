// inline copy of pure logic from password-strength.html
function poolSize(s){let n=0;if(/[a-z]/.test(s))n+=26;if(/[A-Z]/.test(s))n+=26;if(/[0-9]/.test(s))n+=10;if(/[^a-zA-Z0-9]/.test(s))n+=33;return n;}
const COMMON=/^(password|123456|123456789|qwerty|abc123|111111|letmein|admin|welcome|monkey|dragon|iloveyou|password1|123123|654321|000000|888888|football|princess|superman|trustno1)$/i;
function weaknesses(s){const w=[];
  if(s.length<8) w.push('short');
  if(s.length<12&&s.length>=8) w.push('longer');
  if(!/[a-z]/.test(s)) w.push('lower');
  if(!/[A-Z]/.test(s)) w.push('upper');
  if(!/[0-9]/.test(s)) w.push('digit');
  if(!/[^a-zA-Z0-9]/.test(s)) w.push('symbol');
  if(COMMON.test(s)) w.push('common');
  if(/(.)\1{3,}/.test(s)) w.push('repeat');
  if(/(0123456789|9876543210|abcdefgh|qwerty|asdfgh|zxcvbn)/i.test(s)) w.push('seq');
  if(s.length>0&&/^\d+$/.test(s)) w.push('allnums');
  return w;
}
function labelFor(s){const entropy=Math.round(s.length*Math.log2(poolSize(s)||1));const m=weaknesses(s).length;let scr=Math.max(0,Math.min(100,Math.round((entropy/80)*100))-m*3);if(scr<20)return['Very Weak',scr];if(scr<40)return['Weak',scr];if(scr<60)return['Fair',scr];if(scr<80)return['Strong',scr];return['Very Strong',scr];}
const results=[];
function check(n,got,exp){const ok=JSON.stringify(got)===JSON.stringify(exp);results.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' got='+JSON.stringify(got)+' exp='+JSON.stringify(exp)));}
check('pool lower', poolSize('a'), 26);
check('pool full', poolSize('aA1!'), 26+26+10+33);
check('weak-common', weaknesses('password'), ['longer','upper','digit','symbol','common']);
check('weak-allnums', weaknesses('123456'), ['short','lower','upper','symbol','common','allnums']);
check('weak-short', weaknesses('abc'), ['short','upper','digit','symbol']);
check('weak-nosymbol', weaknesses('Passw0rd123'), ['longer','symbol']);
check('strong-noweak', weaknesses('Tr0ub4dor&3x!'), []);
check('repeat', weaknesses('aaaaaaaaaaaaaa'), ['upper','digit','symbol','repeat']);
check('label-strong', labelFor('Tr0ub4dor&3x!')[0], 'Very Strong');
check('label-weak', labelFor('123456')[0], 'Very Weak');
// entropy bits sanity: 16-char full set
check('entropy16', Math.round(16*Math.log2(poolSize('aA1!'))), Math.round(16*Math.log2(95)));
console.log(results.join('\n'));
console.log('TOTAL '+results.filter(r=>r.startsWith('PASS')).length+'/'+results.length);
