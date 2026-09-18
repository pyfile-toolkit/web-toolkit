const assert = require('assert');
const M = require('./md-lib.js');
let h = M.mdToHtml('# Hello');
assert.strictEqual(h, '<h1>Hello</h1>');
h = M.mdToHtml('## Sub\n\npara');
assert.ok(h.includes('<h2>Sub</h2>'));
assert.ok(h.includes('<p>para</p>'));
h = M.mdToHtml('- a\n- b');
assert.strictEqual(h, '<ul><li>a</li><li>b</li></ul>');
h = M.mdToHtml('1. x\n2. y');
assert.strictEqual(h, '<ol><li>x</li><li>y</li></ol>');
h = M.mdToHtml('> quote');
assert.strictEqual(h, '<blockquote>quote</blockquote>');
h = M.mdToHtml('---');
assert.strictEqual(h, '<hr>');
h = M.mdToHtml('```js\nalert(1)\n```');
assert.strictEqual(h, '<pre><code class="language-js">alert(1)</code></pre>');
h = M.mdToHtml('**bold** and `code` and [link](https://x.com)');
assert.ok(h.includes('<strong>bold</strong>'));
assert.ok(h.includes('<code>code</code>'));
assert.ok(h.includes('<a href="https://x.com" rel="noopener" target="_blank">link</a>'));
// XSS safety
h = M.mdToHtml('<script>alert(1)</script>');
assert.ok(!h.includes('<script>'));
assert.ok(h.includes('&lt;script&gt;'));
// inline link with parens URL
console.log('md-lib tests: OK');
