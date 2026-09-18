// Slug Generator unit test (self-contained copy of page logic)
const MAP={'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'c','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya','ä':'a','ö':'o','ü':'u','ß':'ss','ø':'o','å':'a','æ':'ae','œ':'oe','ñ':'n','ç':'c','é':'e','è':'e','ê':'e','à':'a','á':'a','â':'a','í':'i','ì':'i','ó':'o','ò':'o','ú':'u','ù':'u','ü':'u','ÿ':'y'};
function slugify(str,separator,lower){
  let s=String(str).trim().toLowerCase();
  s=s.replace(/[а-яё]/gi, c=> MAP[c.toLowerCase()]!==undefined ? MAP[c.toLowerCase()] : c);
  s=s.replace(/['’]/g,'');
  if(separator){
    s=s.replace(/[^a-z0-9]+/gi,separator);
    s=s.replace(new RegExp('^\\'+separator+'+|\\'+separator+'+$','g'),'');
    s=s.replace(new RegExp('\\'+separator+'+','g'),separator);
  } else {
    s=s.replace(/[^a-z0-9]+/gi,'');
  }
  if(lower) s=s.toLowerCase();
  return s;
}
const results=[];
function check(n,got,exp){const ok=got===exp;results.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' got="'+got+'" exp="'+exp+'"'));}
check('basic', slugify('How to Make a Perfect Cup of Coffee','-',true), 'how-to-make-a-perfect-cup-of-coffee');
check('punct', slugify('Hello, World! How are you?','-',true), 'hello-world-how-are-you');
check('dup-sep', slugify('a  b   c','-',true), 'a-b-c');
check('strip-leading', slugify('  lead & trail  ','-',true), 'lead-trail');
check('cyrillic', slugify('Привет мир','-',true), 'privet-mir');
check('cyrillic2', slugify('Как приготовить кофе','-',true), 'kak-prigotovit-kofe');
check('underscore', slugify('Hello World','_',true), 'hello_world');
check('none-sep', slugify('Hello World 2024','',true), 'helloworld2024');
check('numbers', slugify('Top 10 List','-',true), 'top-10-list');
check('apostrophe', slugify("Don't Stop",'-',true), 'dont-stop');
check('emoji-strip', slugify('Hello 🚀 World','-',true), 'hello-world');
console.log(results.join('\n'));
console.log('TOTAL '+results.filter(r=>r.startsWith('PASS')).length+'/'+results.length);
