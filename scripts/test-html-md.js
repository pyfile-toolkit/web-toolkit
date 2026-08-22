const fs=require('fs');
const html=fs.readFileSync('html-to-markdown.html','utf8');
const src=html.match(/<script>([\s\S]*?)<\/script>/g).slice(-1)[0].replace(/<\/?script>/g,'');
const fn=new Function(src.slice(0, src.indexOf('function convert()'))+'; return {htmlToMarkdown,decodeEntities,convertInline};');
const {htmlToMarkdown,decodeEntities}=fn();
const res=[];
function eq(n,a,e){const ok=a===e;res.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' GOT:\n'+a+'\nEXP:\n'+e));}
function has(n,needle,htmlstr){ const ok=(htmlstr||'').includes(needle); res.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' missing: '+needle+'\nOUT:\n'+htmlstr)); }
// heading
let o=htmlToMarkdown('<h1>Title</h1>');
has('h1', '# Title', o);
// paragraph + strong + link
o=htmlToMarkdown('<p>Hello <strong>world</strong>! Read <a href="https://x.com">this</a>.</p>');
has('strong','**world**',o); has('link','[this](https://x.com)',o);
// list
o=htmlToMarkdown('<ul><li>One</li><li>Two</li></ul>');
has('ul dash','- One',o); has('ul two','- Two',o);
// ordered list
o=htmlToMarkdown('<ol><li>First</li><li>Second</li></ol>');
has('ol num','1. First',o);
// nested list
o=htmlToMarkdown('<ul><li>Parent<ul><li>Child</li></ul></li></ul>');
has('nested','- Child',o);
// code block
o=htmlToMarkdown('<pre>npm i markdown-it</pre>');
has('codeblock','```',o); has('code text','npm i markdown-it',o);
// image
o=htmlToMarkdown('<img src="p.png" alt="A pic">');
has('image','![A pic](p.png)',o);
// entities
eq('entities', decodeEntities('a &amp; b &lt;3'), 'a & b <3');
// table basic
o=htmlToMarkdown('<table><tr><th>A</th><th>B</th></tr><tr><td>1</td><td>2</td></tr></table>');
has('table head','| A | B |',o); has('table sep','---',o); has('table row','| 1 | 2 |',o);
// inline code
o=htmlToMarkdown('<p>use <code>x()</code></p>');
has('inline code','`x()`',o);
// blockquote
o=htmlToMarkdown('<blockquote>Note</blockquote>');
has('quote','> Note',o);
console.log(res.join('\n'));
console.log('TOTAL '+res.filter(r=>r.startsWith('PASS')).length+'/'+res.length);
