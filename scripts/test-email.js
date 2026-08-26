const assert = require('assert');
const E = require('./email-lib.js');
let r = E.extractEmails('Contact me at john.doe@example.com or jane@sub.domain.org!');
assert.deepStrictEqual(r, ['jane@sub.domain.org', 'john.doe@example.com']);
r = E.extractEmails('no emails here');
assert.deepStrictEqual(r, []);
r = E.extractEmails('mix a@b.co and not-an-email and also b@a.co');
assert.deepStrictEqual(r, ['a@b.co', 'b@a.co']);
// image extension noise skipped
r = E.extractEmails('see picture.png and logo.svg stuff@x.com');
assert.deepStrictEqual(r, ['stuff@x.com']);
// deduplication + case
r = E.extractEmails('X@Y.com x@y.com');
assert.deepStrictEqual(r, ['x@y.com']);
// no tld should not match
r = E.extractEmails('user@localhost');
assert.deepStrictEqual(r, []);
// long local bound
r = E.extractEmails('toolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolongtoolong@x.com ok@x.com');
assert.deepStrictEqual(r, ['ok@x.com']);
console.log('email-lib tests: OK');
