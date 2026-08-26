const assert = require('assert');
const J = require('./json-diff-lib.js');
let r = J.diff('{"a":1,"b":2}', '{"a":1,"b":3,"c":4}');
assert.strictEqual(r.equal, false);
assert.strictEqual(r.changed, 2);
assert.ok(r.changes.some(c=>c.type==='changed'&&c.path==='b'&&c.from==='2'&&c.to==='3'));
assert.ok(r.changes.some(c=>c.type==='added'&&c.path==='c'));
assert.ok(r.changes.some(c=>c.type==='removed'&&c.path==='x') === false);
r = J.diff('{"a":1}', '{"a":1}');
assert.strictEqual(r.equal, true);
r = J.diff('not json', '{"a":1}');
assert.ok(r.error && /not valid/.test(r.error));
// nested + arrays
r = J.diff('{"user":{"name":"A","tags":["x","y"]}}', '{"user":{"name":"B","tags":["x","z"]}}');
assert.ok(r.changes.some(c=>c.path==='user.name'));
assert.ok(r.changes.some(c=>c.path==='user.tags[1]'));
console.log('json-diff-lib tests: OK');
