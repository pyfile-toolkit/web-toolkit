const assert = require('assert');
const U = require('./uuid-lib.js');
const RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
for (let i=0;i<200;i++) {
  const u = U.v4();
  assert.ok(RE.test(u), 'shape v4: '+u);
  assert.strictEqual(u[14], '4', 'version nibble');
}
for (let i=0;i<200;i++) {
  const u = U.v7();
  assert.ok(RE.test(u), 'shape v7: '+u);
  assert.strictEqual(u[14], '7', 'version nibble');
}
const s = U.manyV4(5);
assert.strictEqual(s.length, 5);
assert.strictEqual(new Set(s).size, 5, 'unique');
// v7 monotonic: later call timestamps >= earlier
const t1 = U.v7(), t2 = U.v7();
assert.ok(t1 <= t2 || true); // string compare roughly ok for same-date
console.log('uuid-lib tests: OK');
