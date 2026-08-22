const fs=require('fs');
const html=fs.readFileSync('yaml-json-converter.html','utf8');
const src=html.match(/<script>([\s\S]*?)<\/script>/g).slice(-1)[0].replace(/<\/?script>/g,'');
const fn=new Function(src.slice(0, src.indexOf('function conv'))+'; return {yamlParse,toJS,jsonToYaml};');
const {yamlParse,toJS,jsonToYaml}=fn();
const res=[];
function eq(n,a,e){const ok=JSON.stringify(a)===JSON.stringify(e);res.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' got='+JSON.stringify(a)+' exp='+JSON.stringify(e)));}
// nested mapping + scalars + types
const r1=yamlParse('a:\n  b: 1\n  c: true\nd: hello\n');
eq('nested+types', toJS(r1.root), {a:{b:1,c:true},d:'hello'});
// list of mappings + inline flow
const r2=yamlParse('users:\n  - name: alice\n    admin: true\n  - name: bob\n    admin: false\ntags: [dev, tools]\n');
eq('list-of-maps+flow', toJS(r2.root), {users:[{name:'alice',admin:true},{name:'bob',admin:false}],tags:['dev','tools']});
// comments and blank lines skipped; quoted strings preserved
const r3=yamlParse('# comment\n\nkey: "quoted value"\nnum: 42\n');
eq('quoted+num', toJS(r3.root), {key:'quoted value',num:42});
// null handling
const r4=yamlParse('a: null\nb: ~\nc:\n');
eq('nulls', JSON.parse(JSON.stringify(toJS(r4.root))), {a:null,b:null,c:null});
// json→yaml→json round trip
const srcObj={server:{host:'localhost',port:8080,tls:true},users:[{name:'alice',admin:true}],tags:['dev','tools'],count:3};
const y=jsonToYaml(srcObj);
const back=toJS(yamlParse(y).root);
eq('roundtrip', back, srcObj);
// inline empty & deep nesting
const r5=yamlParse('a:\n  b:\n    c: [1, 2]\n');
eq('deep', toJS(r5.root), {a:{b:{c:[1,2]}}});
console.log(res.join('\n'));
console.log('TOTAL '+res.filter(r=>r.startsWith('PASS')).length+'/'+res.length);
// extra edges
const r6=yamlParse('nums: [1, 2.5, -3, true, null, x]\n');
const j6=toJS(r6.root); eq('flow mixed', j6, {nums:[1,2.5,-3,true,null,'x']});
const r7=yamlParse('a:\n  - 1\n  - 2\n');
eq('scalar list', toJS(r7.root), {a:[1,2]});
const r8=yamlParse('key: "with: colon inside"\n');
eq('colon in quoted', toJS(r8.root), {key:'with: colon inside'});
const r9=yamlParse('svc:\n  - name: api\n    env:\n      - key: TOKEN\n        val: x\n');
eq('nested list in item', toJS(r9.root), {svc:[{name:'api',env:[{key:'TOKEN',val:'x'}]}]});
console.log(res.join('\n'));
console.log('TOTAL '+res.filter(r=>r.startsWith('PASS')).length+'/'+res.length);
