const fs=require('fs');
const html=fs.readFileSync('box-shadow-generator.html','utf8');
const src=html.match(/<script>([\s\S]*?)<\/script>/g).slice(-1)[0].replace(/<\/?script>/g,'');
const fn=new Function(src.slice(0, src.indexOf('function apply'))+'; return {cssShadow,PRESETS};');
const {cssShadow,PRESETS}=fn();
const res=[];
function eq(n,a,e){const ok=a===e;res.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' got='+a+' exp='+e));}
// exact CSS strings
eq('simple', cssShadow({ox:4,oy:6,bl:12,sp:0,col:'#00000066',inset:false}), '4px 6px 12px #00000066');
eq('with spread', cssShadow({ox:0,oy:4,bl:12,sp:2,col:'#00000033',inset:false}), '0px 4px 12px 2px #00000033');
eq('inset first', cssShadow({ox:0,oy:2,bl:8,sp:-2,col:'#00000088',inset:true}), 'inset 0px 2px 8px -2px #00000088');
eq('negative offset', cssShadow({ox:-4,oy:0,bl:10,sp:0,col:'#fff',inset:false}), '-4px 0px 10px #fff');
// zero spread omitted
eq('zero spread omitted', cssShadow({ox:1,oy:1,bl:1,sp:0,col:'#000',inset:false}), '1px 1px 1px #000');
// presets exist and are valid shapes
eq('presets count', Object.keys(PRESETS).length, 6);
eq('neon valid', (()=>{const p=PRESETS.neon; return cssShadow(p).split(' ').length>=4; })(), true);
console.log(res.join('\n'));
console.log('TOTAL '+res.filter(r=>r.startsWith('PASS')).length+'/'+res.length);
