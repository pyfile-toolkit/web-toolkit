function toTitle(s){
  const small = new Set(['a','an','the','and','or','but','nor','for','so','yet','of','to','in','on','at','by','with','from','up','down','off','over','under','as','is','are','was','were']);
  return s.replace(/\w[\w']*/g, (w, idx, str)=>{
    const prev = str.slice(0, idx).trimEnd();
    const isFirst = prev === '' || /[:.!?]/.test(prev.slice(-1));
    const low = w.toLowerCase();
    if(!isFirst && small.has(low)) return low;
    return w.charAt(0).toUpperCase() + low.slice(1);
  });
}
function toSentence(s){return s.replace(/(^\s*|\.\s+|\!\s+|\?\s+|\n\s*|:\s*)(\w)/g, (m,a,b)=>a+b.toUpperCase());}
function toAlt(s){let i=0;return s.replace(/[a-z]/gi, c=>{const r=(i++)%2===0 ? c.toUpperCase():c.toLowerCase();return r;});}
function toInvert(s){return s.replace(/[a-z]/gi, c=> c===c.toUpperCase() ? c.toLowerCase() : c.toUpperCase());}

const results=[];
function check(name,got,exp){const ok=got===exp;results.push((ok?'PASS':'FAIL')+' '+name+(ok?'':' -> got "'+got+'" exp "'+exp+'"'));}
check('upper','hello world'.toUpperCase(),'HELLO WORLD');
check('lower','HeLLo'.toLowerCase(),'hello');
check('title-basic',toTitle('the quick brown fox'),'The Quick Brown Fox');
check('title-smallword',toTitle('a tale of two cities and the sea'),'A Tale of Two Cities and the Sea');
check('title-first-small',toTitle('the lord'),'The Lord');
check('title-hyphen',toTitle('state-of-the-art tool'),'State-of-the-Art Tool');
check('title-apostrophe',toTitle("don't stop"),"Don't Stop");
check('title-after-colon',toTitle('note: the end'),'Note: The End');
check('sentence',toSentence('hello world. this is a test! second one.'),'Hello world. This is a test! Second one.');
check('sentence-newline',toSentence('first line\nsecond line'),'First line\nSecond line');
check('sentence-colon',toSentence('list: apples'),'List: Apples');
check('alt-even0',toAlt('abc'),'AbC');
check('invert',toInvert('AbC'),'aBc');
check('invert-num',toInvert('a1b'),'A1B');
console.log(results.join('\n'));
console.log('TOTAL '+results.filter(r=>r.startsWith('PASS')).length+'/'+results.length);
