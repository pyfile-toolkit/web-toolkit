const res=[];
function eq(n,a,e){const ok=(typeof a==='string')?(a===e):(Math.abs(a-e)<1e-9);res.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' got='+a+' exp='+e));}
// WPM = correct/5/minutes
function wpm(correct,minutes){return Math.round(correct/5/minutes);}
eq('wpm 50c 1min', wpm(50,1), 10);
eq('wpm 250c 1min', wpm(250,1), 50);
eq('wpm 400c 30s', wpm(400,0.5), 160);
eq('wpm 0c', wpm(0,1), 0);
// accuracy = 100*correct/total
function acc(correct,total){return Math.round(total?100*correct/total:100);}
eq('acc 100/100', acc(100,100), 100);
eq('acc 90/100', acc(90,100), 90);
eq('acc 0 total', acc(0,0), 100);
// sim: 30 correct, 5 wrong in 30s -> minutes=0.5
const correct=30, errors=5, total=35;
eq('wpm30c30s', Math.round(correct/5/0.5), 12);
eq('acc30_35', acc(correct,total), 86);
// verdict thresholds
function verdict(w){return w>=100?'Pro':w>=80?'Fast':w>=60?'AboveAvg':w>=40?'Avg':'Practice';}
eq('v100',verdict(100),'Pro'); eq('v99',verdict(99),'Fast'); eq('v80',verdict(80),'Fast');
eq('v79',verdict(79),'AboveAvg'); eq('v60',verdict(60),'AboveAvg'); eq('v59',verdict(59),'Avg');
eq('v40',verdict(40),'Avg'); eq('v39',verdict(39),'Practice');
console.log(res.join('\n'));
console.log('TOTAL '+res.filter(r=>r.startsWith('PASS')).length+'/'+res.length);
