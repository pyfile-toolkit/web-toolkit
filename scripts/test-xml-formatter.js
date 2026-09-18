const fs=require('fs');
const html=fs.readFileSync('xml-formatter.html','utf8');
const src=html.match(/<script>([\s\S]*?)<\/script>/g).slice(-1)[0].replace(/<\/?script>/g,'');
const fn=new Function(src.slice(0, src.indexOf('function formatIt'))+'; return {formatXml};');
const {formatXml}=fn();
const res=[];
function has(n,needle,out){ const ok=(typeof out==='string'?out:JSON.stringify(out)).includes(needle); res.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' missing "'+needle+'"\n'+JSON.stringify(out))); }
function nhas(n,needle,out){ const ok=!out.includes(needle); res.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' had "'+needle+'"')); }
// basic nesting
let o=formatXml('<a><b>1</b><c>2</c></a>');
has('a root','<a>',o);
has('b indent','<b>',o);
// attributes preserved
o=formatXml('<root id="x" active="1"><child/></root>');
has('attrs','id="x" active="1"',o);
has('self tag','<child/>',o);
// comment preserved
o=formatXml('<a><!-- note --><b>x</b></a>');
has('comment','<!-- note -->',o);
// CDATA preserved verbatim
o=formatXml('<a><![CDATA[   raw   stuff ]]></a>');
has('cdata','<![CDATA[   raw   stuff ]]>',o);
// PI + doctype on own line
o=formatXml('<?xml version="1.0"?><a><b/></a>');
has('pi','<?xml version="1.0"?>',o);
o=formatXml('<!DOCTYPE note><a/>');
has('doctype','<!DOCTYPE note>',o);
// text normalization
o=formatXml('<a>  hello   world  </a>');
has('text normalized inline-like','hello world',o);
// deep nesting indent = 2 spaces per level
o=formatXml('<a><b><c><d>deep</d></c></b></a>');
has('depth 8','\n        deep',o);
// minified survives (roundtrip content)
const original='<a><b x="1">text</b><!--c--></a>';
const flat=formatXml('<a><b x="1">text</b><!--c--></a>');
has('content kept','<!--c-->',flat);
has('attr kept','x="1"',flat);
console.log(res.join('\n'));
console.log('TOTAL '+res.filter(r=>r.startsWith('PASS')).length+'/'+res.length);
