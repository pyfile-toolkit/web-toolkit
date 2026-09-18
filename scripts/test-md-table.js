const assert = require('assert');
const M = require('./md-table-lib.js');
const md = M.toMarkdown('Name,Role\nAlice,Engineer\nBob,"Dev, QA"\n');
const lines = md.split('\n');
assert.strictEqual(lines.length, 4);
assert.ok(lines[0].includes('| Name | Role |'));
assert.ok(lines[1].includes('---'));
assert.ok(lines[3].includes('Dev, QA'));          // quoted comma kept
assert.ok(lines[2].includes('\\|') === false);    // plain pipes fine here
// pipe separator support
const md2 = M.toMarkdown('a|b\n1|2', {separator:'pipe'});
assert.ok(md2.includes('| a | b |'));
// escaping pipe in cell
const md3 = M.toMarkdown('x|y\n"p|q",z');
assert.ok(md3.includes('p\\|q'));
// empty input
assert.strictEqual(M.toMarkdown(''), '');
// rows of different lengths -> padded
const md4 = M.toMarkdown('a,b,c\nd,e');
assert.ok(md4.includes('| d | e |  |'));
// header:false
const md5 = M.toMarkdown('a,b\n1,2', {header:false});
assert.ok(md5.startsWith('|  |  |'));
console.log('md-table-lib tests: OK');
