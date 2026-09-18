/* base-lib.js — UMD base conversion helpers (no deps). Runtime: browser + tests. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BaseLib = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const DIGITS = '0123456789ABCDEF';

  // Convert a string in arbitrary base 2..36 to a BigInt, or null if invalid.
  function parseBase(str, base) {
    const s = String(str || '').trim().toUpperCase();
    if (!s || base < 2 || base > 36) return null;
    let v = 0n, neg = false, i = 0;
    if (s[0] === '-') { neg = true; i = 1; }
    else if (s[0] === '+') { i = 1; }
    for (; i < s.length; i++) {
      const d = DIGITS.indexOf(s[i]);
      if (d < 0 || d >= base) return null;
      v = v * BigInt(base) + BigInt(d);
    }
    if (i === (s[0] === '-' || s[0] === '+' ? 1 : 0)) return null;
    return neg ? -v : v;
  }

  // BigInt -> string in base 2..36.
  function formatBase(value, base) {
    if (base < 2 || base > 36) throw new Error('base out of range');
    let v = value < 0n ? -value : value;
    let out = '';
    const b = BigInt(base);
    do {
      out = DIGITS[Number(v % b)] + out;
      v = v / b;
    } while (v > 0n);
    return (value < 0n ? '-' : '') + out;
  }

  // Convenience: convert(s, fromBase, toBase) -> string or null.
  function convert(s, fromBase, toBase) {
    const v = parseBase(s, fromBase);
    if (v === null) return null;
    return formatBase(v, toBase);
  }

  function isValid(s, base) {
    return parseBase(s, base) !== null;
  }

  return { parseBase, formatBase, convert, isValid };
});