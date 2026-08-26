/* uuid-lib.js — UMD UUID v4/v7 generator (no deps). Runtime: browser + tests. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.UuidLib = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var R = typeof crypto !== 'undefined' && crypto.getRandomValues ? crypto : null;
  function rnd16() { // 16 random bytes
    var b = new Uint8Array(16);
    if (R) R.getRandomValues(b);
    else for (var i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256);
    return b;
  }
  function hex(b) {
    var s = '';
    for (var i = 0; i < 16; i++) s += ('0' + b[i].toString(16)).slice(-2);
    return s;
  }
  function v4() {
    var b = rnd16();
    b[6] = (b[6] & 0x0f) | 0x40; // version 4
    b[8] = (b[8] & 0x3f) | 0x80; // variant 10
    var h = hex(b);
    return h.slice(0,8) + '-' + h.slice(8,12) + '-' + h.slice(12,16) + '-' + h.slice(16,20) + '-' + h.slice(20);
  }
  function v7() { // time-ordered (RFC 9562)
    var b = rnd16();
    var t = Date.now(); // ms since epoch
    var hi = Math.floor(t / 4096);           // 36 bits (approx via two 32-bit halves)
    var lo = (t % 4096) * 4096;              // lower 12 bits + 12 random-ish
    // 48-bit timestamp: bytes 0..5
    b[0] = (hi >>> 24) & 0xff; b[1] = (hi >>> 16) & 0xff; b[2] = (hi >>> 8) & 0xff; b[3] = hi & 0xff;
    b[4] = (lo >>> 8) & 0xff; b[5] = lo & 0xff;
    b[6] = ((b[6] & 0x0f) | 0x70);           // version 7
    b[8] = (b[8] & 0x3f) | 0x80;             // variant
    var h = hex(b);
    return h.slice(0,8) + '-' + h.slice(8,12) + '-' + h.slice(12,16) + '-' + h.slice(16,20) + '-' + h.slice(20);
  }
  function many(n, fn) { var a = []; for (var i = 0; i < n; i++) a.push(fn()); return a; }
  return { v4: v4, v7: v7, manyV4: function(n){ return many(n, v4); }, manyV7: function(n){ return many(n, v7); } };
});