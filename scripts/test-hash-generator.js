const html=require('fs').readFileSync('/tmp/web-toolkit/hash-generator.html','utf8');
// balanced-brace extractor for a top-level function
function grabFn(name){
  const start=html.indexOf('function '+name+'(');
  const fnStart=html.indexOf('{', start);
  let depth=0, inS=null, i=fnStart;
  for(; i<html.length; i++){
    const ch=html[i];
    if(inS){
      if(ch==='\\'){i++;continue;}
      if(ch===inS) inS=null;
      continue;
    }
    if(ch==='"'||ch==="'"||ch==='`'){inS=ch;continue;}
    if(ch==='/'){ if(html[i+1]==='/'){while(i<html.length&&html[i]!=='\n')i++;} else if(html[i+1]==='*'){i+=2;while(i<html.length&&!(html[i]==='*'&&html[i+1]==='/'))i++;i++;} }
    if(ch==='{')depth++;
    else if(ch==='}'){depth--; if(depth===0){i++;break;}}
  }
  const src=html.slice(start, i); // includes signature + body
  return new Function('return ('+src+');')();
}
const md5=grabFn('md5'), sha1=grabFn('sha1');
const results=[];
function check(n,got,exp){const ok=got===exp;results.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' got='+got));}
check('md5 empty', md5(''), 'd41d8cd98f00b204e9800998ecf8427e');
check('md5 abc', md5('abc'), '900150983cd24fb0d6963f7d28e17f72');
check('md5 quickfox', md5('The quick brown fox jumps over the lazy dog'), '9e107d9d372bb6826bd81d3542a419d6');
check('md5 unicode', md5('привет'), '608333adc72f545078ede3aad71bfe74');
check('sha1 empty', sha1(''), 'da39a3ee5e6b4b0d3255bfef95601890afd80709');
check('sha1 abc', sha1('abc'), 'a9993e364706816aba3e25717850c26c9cd0d89d');
check('sha1 quickfox', sha1('The quick brown fox jumps over the lazy dog'), '2fd4e1c67a2d28fced849ee1bb76e7391b93eb12');
check('sha1 unicode', sha1('привет'), 'e24505f94db2b5df4c7c2596b0788e720e073021');
console.log(results.join('\n'));
console.log('TOTAL '+results.filter(r=>r.startsWith('PASS')).length+'/'+results.length);
