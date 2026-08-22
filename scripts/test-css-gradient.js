const fs=require('fs');
const html=fs.readFileSync('css-gradient-generator.html','utf8');
const src=html.match(/<script>([\s\S]*?)<\/script>/g).slice(-1)[0].replace(/<\/?script>/g,'');
const fn=new Function(src.slice(0, src.indexOf('// events'))+'; return {buildCSS};');
const {buildCSS}=fn();
// stub DOM for buildCSS
function sandbox(){
  const vals={h1:'',h2:'',angleN:''};
  const doc={getElementById:id=>{ if(id==='h1'||id==='h2'||id==='angleN') return {value:vals[id],set value(v){vals[id]=v;},get value(){return vals[id];}}; return {value:'',style:{},textContent:''}; }};
  return {doc,vals};
}
const res=[];
function eq(n,a,e){const ok=a===e;res.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' got='+a+' exp='+e));}
// build linear
const {doc:doc1,vals:v1}=sandbox(); v1.h1='#667eea'; v1.h2='#764ba2'; v1.angleN='135';
const f1=new Function('document', src.slice(0, src.indexOf('// events'))+'; return buildCSS;')(doc1);
eq('linear css', f1(), 'background: linear-gradient(135deg, #667eea, #764ba2);');
// angle default
const {doc:doc2,vals:v2}=sandbox(); v2.h1='#ff0000'; v2.h2='#00ff00'; v2.angleN='0';
const f2=new Function('document', src.slice(0, src.indexOf('// events'))+'; return buildCSS;')(doc2);
eq('angle 0', f2(), 'background: linear-gradient(0deg, #ff0000, #00ff00);');
// lowercase hex preserved
const {doc:doc3,vals:v3}=sandbox(); v3.h1='#abc'; v3.h2='#123456'; v3.angleN='45';
const f3=new Function('document', src.slice(0, src.indexOf('// events'))+'; return buildCSS;')(doc3);
eq('short hex kept', f3(), 'background: linear-gradient(45deg, #abc, #123456);');
console.log(res.join('\n'));
console.log('TOTAL '+res.filter(r=>r.startsWith('PASS')).length+'/'+res.length);
