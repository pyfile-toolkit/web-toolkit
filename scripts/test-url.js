const assert = require('assert');
const U = require('./url-lib.js');
assert.strictEqual(U.encodeComponent('a b&c'), 'a%20b%26c');
assert.strictEqual(U.decodeComponent('a%20b%26c'), 'a b&c');
assert.strictEqual(U.decodeComponent('%'), null);            // malformed -> null
assert.strictEqual(U.encodeAll('https://x.com/a b?q=1&x=2'), 'https://x.com/a%20b?q=1&x=2'); // keeps ://?&
assert.strictEqual(U.decodeAll('https://x.com/a%20b?q=1'), 'https://x.com/a b?q=1');
assert.strictEqual(U.encodeStrict('héllo wörld'), 'h%C3%A9llo%20w%C3%B6rld');
assert.strictEqual(U.decodeStrict('h%C3%A9llo w%C3%B6rld'), 'héllo wörld');
assert.strictEqual(U.encodeComponent(''), '');
assert.strictEqual(U.decodeComponent('😀'), '😀');           // utf8 round-trip via defineProps
assert.strictEqual(U.decodeComponent('%E2%9C%93'), '✓');
console.log('url-lib tests: OK');
