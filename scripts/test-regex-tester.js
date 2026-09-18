// Replicates the page's matching engine exactly
function findMatches(pattern, flagsStr, text){
  const re=new RegExp(pattern, flagsStr);
  const matches=[];
  if(re.global){ let m; re.lastIndex=0;
    while((m=re.exec(text))!==null){ matches.push({index:m.index,val:m[0],groups:m.slice(1)}); if(m.index===re.lastIndex) re.lastIndex++; }
  } else { const m=re.exec(text); if(m) matches.push({index:m.index,val:m[0],groups:m.slice(1)}); }
  return matches;
}
const res=[];
function eq(n,a,e){const ok=JSON.stringify(a)===JSON.stringify(e);res.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' got='+JSON.stringify(a)+' exp='+JSON.stringify(e)));}
// emails
const txt='Contact john.doe@example.com or support@site.io for help.';
const m1=findMatches('[\\w.]+@[\\w.-]+\\.[\\w.]+','g',txt);
eq('email count',m1.length,2);
eq('email1',m1[0].val,'john.doe@example.com');
eq('email2',m1[1].val,'support@site.io');
// groups: capture date
const m2=findMatches('(\\d{4})-(\\d{2})','g','Date: 2024-08-21 end');
eq('date match',m2[0].val,'2024-08');
eq('groups',m2[0].groups,['2024','08']);
// non-global returns first only
const m3=findMatches('\\d+','','a 10 b 20');
eq('nonglobal 1 match',m3.length,1);
// case-insensitive
const m4=findMatches('hello','i','HELLO world hello');
eq("ci val",m4[0].val,"HELLO");
eq('ci count',findMatches('hello','ig','HELLO world hello').length,2);
// invalid pattern throws
let threw=false; try{ findMatches('(', 'g', 'x'); }catch(e){ threw=true; }
eq('invalid throws',threw,true);
// zero-length match safety (global loop must not hang)
const m5=findMatches('a*','g','bab');
eq('zerolength ok',m5.length>=3,true);
console.log(res.join('\n'));
console.log('TOTAL '+res.filter(r=>r.startsWith('PASS')).length+'/'+res.length);
