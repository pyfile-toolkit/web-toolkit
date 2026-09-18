const fs=require('fs');
const html=fs.readFileSync('csv-json-converter.html','utf8');
const block=html.match(/<script>([\s\S]*?)<\/script>/g).slice(-1)[0];
const src=block.replace(/<\/?script>/g,'');
const pure=src.slice(src.indexOf('function parseCSV'), src.indexOf('function convert'));
eval(pure);
const res=[];
function eq(n,a,e){const ok=JSON.stringify(a)===JSON.stringify(e);res.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' got='+JSON.stringify(a)+' exp='+JSON.stringify(e)));}
// basic 2 rows
eq('basic', JSON.parse(csvToJson('a,b\n1,2\n3,4')), [{a:'1',b:'2'},{a:'3',b:'4'}]);
// quoted comma + quotes
eq('quoted', JSON.parse(csvToJson('name,city\n"New York, NY",US')), [{name:'New York, NY',city:'US'}]);
eq('escaped quote', JSON.parse(csvToJson('t\n"say ""hi"""')), [{t:'say "hi"'}]);
// CRLF line endings
eq('crlf', JSON.parse(csvToJson('a,b\r\n1,2\r\n3,4')), [{a:'1',b:'2'},{a:'3',b:'4'}]);
// json2csv
eq('j2c', jsonToCsv(JSON.stringify([{a:'1',b:'2'},{a:'3',b:'4'}])), 'a,b\n1,2\n3,4');
// j2c quoting: comma forces quotes
eq('j2c quoting', jsonToCsv(JSON.stringify([{x:'a,b',y:'plain'}])), 'x,y\n"a,b",plain');
// j2c empty
eq('j2c empty', jsonToCsv('[]'), '');
// round trip
const rt=jsonToCsv(csvToJson('n\n1\n2'));
eq('roundtrip', rt, 'n\n1\n2');
// error cases
let threw=false; try{ csvToJson('a,b'); }catch(e){ threw=true; }
eq('err header only', threw, true);
threw=false; try{ jsonToCsv('{"a":1}'); }catch(e){ threw=true; }
eq('err not array', threw, true);
console.log(res.join('\n'));
console.log('TOTAL '+res.filter(r=>r.startsWith('PASS')).length+'/'+res.length);
