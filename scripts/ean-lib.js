/* ean-lib.js — UMD EAN-13 barcode encoder (no deps). Runtime: browser + tests. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.EanLib = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  // EAN-13 patterns (per digit): L / G / R encodings
  var L = ['0001101','0011001','0010011','0111101','0100011','0110001','0101111','0111011','0110111','0001011'];
  var G = ['0100111','0110011','0011011','0100001','0011101','0111001','0000101','0010001','0001001','0010111'];
  var R = ['1110010','1100110','1101100','1000010','1011100','1001110','1010000','1000100','1001000','1110100'];
  var STRUCT = [ // first-digit parity pattern over digits 2..7 (LSB first)
    ['LLLLLL','LLGLGG','LLGGLG','LLGGGL','LGLLGG','LGGLLG','LGGGLL','LGLGLG','LGLGGL','LGGLGL']
  ][0];
  // compute EAN-13 check digit
  function checkDigit(d12) {
    var sum = 0;
    for (var i = 0; i < 12; i++) {
      var d = parseInt(d12[i], 10);
      sum += (i % 2 === 0) ? d : d * 3; // weighting 1-3-1-3...
    }
    return (10 - (sum % 10)) % 10;
  }
  function normalize(code) {
    var c = String(code == null ? '' : code).replace(/\D/g, '');
    if (c.length === 13) return c.slice(0, 13);
    if (c.length === 12) return c + String(checkDigit(c));
    return null;
  }
  // returns binary string of bars (1=black)
  function encode(code) {
    var c = normalize(code);
    if (!c) return null;
    var first = parseInt(c[0], 10);
    var pattern = STRUCT[first];
    var out = '101'; // start
    for (var i = 1; i <= 6; i++) {
      var par = pattern[i - 1]; // L or G
      var set = par === 'L' ? L : G;
      out += set[parseInt(c[i], 10)];
      if (i === 6) out += '01010'; // center guard
    }
    for (var j = 7; j <= 12; j++) {
      out += R[parseInt(c[j], 10)];
    }
    out += '101'; // end
    return out;
  }
  function drawBars(ctx, code, x, y, h, moduleW, color) {
    var bin = encode(code);
    if (!bin) return false;
    ctx.fillStyle = color || '#000';
    for (var i = 0; i < bin.length; i++) {
      if (bin[i] === '1') ctx.fillRect(x + i * moduleW, y, moduleW, h);
    }
    return true;
  }
  return { normalize: normalize, checkDigit: checkDigit, encode: encode, drawBars: drawBars };
});