function verdict(ms){
  if(ms<=180) return 'Elite';
  if(ms<=220) return 'Fast';
  if(ms<=270) return 'AboveAverage';
  if(ms<=350) return 'Average';
  return 'Slow';
}
const results=[];
function check(n,got,exp){const ok=got===exp;results.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' got='+got+' exp='+exp));}
check('v180',verdict(180),'Elite');
check('v181',verdict(181),'Fast');
check('v220',verdict(220),'Fast');
check('v221',verdict(221),'AboveAverage');
check('v270',verdict(270),'AboveAverage');
check('v271',verdict(271),'Average');
check('v350',verdict(350),'Average');
check('v351',verdict(351),'Slow');
check('v500',verdict(500),'Slow');
// avg calc
const attempts=[200,250,300]; const avg=Math.round(attempts.reduce((a,b)=>a+b,0)/attempts.length);
check('avg',avg,250);
console.log(results.join('\n'));
console.log('TOTAL '+results.filter(r=>r.startsWith('PASS')).length+'/'+results.length);
