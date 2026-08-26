const assert = require('assert');
const B = require('./base-lib.js');
assert.strictEqual(B.convert('255', 10, 16), 'FF');
assert.strictEqual(B.convert('ff', 16, 10), '255');
assert.strictEqual(B.convert('11111111', 2, 10), '255');
assert.strictEqual(B.convert('377', 8, 2), '11111111');
assert.strictEqual(B.convert('-10', 10, 2), '-1010');
assert.strictEqual(B.convert('3', 2, 10), null);          // invalid digit
assert.strictEqual(B.convert('', 10, 2), null);           // empty
assert.strictEqual(B.convert(' ' , 10, 2), null);         // blank
assert.strictEqual(B.convert('12', 36, 10), '38');        // 1*36 + 2
assert.strictEqual(B.formatBase(0n, 16), '0');
assert.strictEqual(B.isValid('1A', 16), true);
assert.strictEqual(B.isValid('1F', 15), false);
assert.strictEqual(B.convert('12345678901234567890', 10, 16), 'AB54A98CEB1F0AD2'); // BigInt
console.log('base-lib tests: OK');
