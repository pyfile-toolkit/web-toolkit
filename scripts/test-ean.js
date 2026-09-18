const assert = require('assert');
const E = require('./ean-lib.js');
assert.strictEqual(E.checkDigit('400638133393'), 1);   // known sample
assert.strictEqual(E.normalize('4006381333931'), '4006381333931');
assert.strictEqual(E.normalize('400638133393'), '4006381333931'); // auto check digit
assert.strictEqual(E.normalize('40063813x'), null);     // too short
const bin = E.encode('4006381333931');
assert.ok(bin && bin.startsWith('101') && bin.endsWith('101'));
assert.ok(bin.includes('01010'));                       // guard
assert.strictEqual(bin.length, 95);                     // 95 modules for EAN-13
console.log('ean-lib tests: OK');
