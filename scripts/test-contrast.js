const fs=require('fs');
const html=fs.readFileSync('contrast-checker.html','utf8');
const src=html.match(/<script>([\s\S]*?)<\/script>/g).slice(-1)[0].replace(/<\/?script>/g,'');
const fn=new Function(src.slice(0, src.indexOf('function update'))+'; return {contrast, round2, hexToRgb};');
const {contrast,round2,hexToRgb}=fn();
const res=[];
function eq(n,a,e){const ok=(typeof a==='number')?(Math.abs(a-e)<0.05):(JSON.stringify(a)===JSON.stringify(e));res.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' got='+JSON.stringify(a)+' exp='+JSON.stringify(e)));}
// canonical: black on white = 21:1
eq('black/white', contrast('#000000','#ffffff'), 21);
// white on black same
eq('white/black', contrast('#ffffff','#000000'), 21);
// same color = 1
eq('same', contrast('#ff0000','#ff0000'), 1);
// known pair: #767676 on #fff ≈ 4.54:1 (AA pass, AAA fail)
const c1=contrast('#767676','#ffffff');
console.log('  #767676/#fff =', round2(c1));
eq('grey AA pass', c1>=4.5, true);
eq('grey AAA fail', c1<7, true);
// #C0C0C0 on white = ~1.92 (fails)
const c2=contrast('#c0c0c0','#ffffff');
console.log('  #c0c0c0/#fff =', round2(c2));
eq('light grey fails AA', c2<4.5, true);
// blue #00F on white = ~8.59 (AAA pass)
const c3=contrast('#0000ff','#ffffff');
console.log('  #0000ff/#fff =', round2(c3));
eq('blue AAA pass', c3>=7, true);
// hex parsing: 3-digit shorthand + lowercase + with/without hash
eq('3digit', hexToRgb('abc')!==null, true);
eq('6dig', JSON.stringify(hexToRgb('FFFFFF')), '[255,255,255]');
eq('bad hex', hexToRgb('xyz'), null);
console.log(res.join('\n'));
console.log('TOTAL '+res.filter(r=>r.startsWith('PASS')).length+'/'+res.length);
