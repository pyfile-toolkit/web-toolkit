function fmt(x){const r=Math.round(x*1e6)/1e6;return Number.isInteger(r)?String(r):String(r).replace(/\B(?=(\d{3})+(?!\d))/g,',');}
const res=[];
function eq(n,a,e){const ok=Math.abs(a-e)<1e-9;res.push((ok?'PASS':'FAIL')+' '+n+' got='+a+' exp='+e);}
// of: p% of y = (p/100)*y
eq('of15_200',(15/100)*200,30);
eq('of50_80',(50/100)*80,40);
eq('of7.5_600',(7.5/100)*600,45);
// pctof: x is what % of y = x/y*100
eq('pctof30_200',(30/200)*100,15);
eq('pctof5_20',(5/20)*100,25);
// change: (new-old)/old*100 ; display multiplies by 100 again
const old=50,neu=60; const c=((neu-old)/old)*100; const dispC=fmt((c/100)*100)+'%';
eq('change50_60',c,20);
const ok=(dispC==='20%');res.push((ok?'PASS':'FAIL')+' change_disp got='+dispC);
// add/sub
eq('add100_10',100*(1+10/100),110);
eq('sub100_10',100*(1-10/100),90);
// fmt formatting
eq('fmt_200',parseFloat(fmt(200).replace(/,/g,'')),200);
console.log(res.join('\n'));
console.log('TOTAL '+res.filter(r=>r.startsWith('PASS')).length+'/'+res.length);
