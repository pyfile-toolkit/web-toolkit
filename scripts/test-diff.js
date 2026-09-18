const assert = require('assert');
const D = require('./diff-lib.js');
// identical
let ops = D.diffLines(['a','b','c'], ['a','b','c']);
assert.deepStrictEqual(D.stats(ops), {same:3, del:0, add:0});
assert.strictEqual(D.similarity(ops), 100);
// pure insertion at end
ops = D.diffLines(['a'], ['a','b']);
assert.strictEqual(D.stats(ops).add, 1);
// deletion
ops = D.diffLines(['a','b'], ['a']);
assert.strictEqual(D.stats(ops).del, 1);
// substitution
ops = D.diffLines(['foo'], ['bar']);
assert.strictEqual(D.stats(ops).add, 1);
assert.strictEqual(D.stats(ops).del, 1);
assert.strictEqual(D.similarity(ops), 0); // full replace = 0 same lines
// empty vs content
assert.strictEqual(D.splitText('').length, 0);
assert.deepStrictEqual(D.splitText('x\ny'), ['x','y']);
// crlf normalisation
assert.deepStrictEqual(D.splitText('a\r\nb\r\n'), ['a','b','']);
// interleaved edit
ops = D.diffLines(['1','2','3','4'], ['1','X','3','4','5']);
const seq = ops.map(o=>o.type[0]).join('');
assert.strictEqual(seq, 'sdassa');
console.log('diff-lib tests: OK');
