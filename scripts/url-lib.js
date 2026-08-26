/* url-lib.js — UMD URL encode/decode helpers (no deps). Runtime: browser + tests. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.UrlLib = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // component-level encode/decode: keeps reserved chars inside a URL intact
  function encodeComponent(s) {
    return encodeURIComponent(String(s == null ? '' : s));
  }
  function decodeComponent(s) {
    try { return decodeURIComponent(String(s)); } catch (e) { return null; }
  }
  // full-path encode/decode: safe for whole URLs (keeps / : ? # & =)
  function encodeAll(s) {
    return encodeURI(String(s));
  }
  function decodeAll(s) {
    try { return decodeURI(String(s)); } catch (e) { return null; }
  }
  // percent-encode everything except unreserved chars (RFC 3986 style)
  function encodeStrict(s) {
    // RFC 3986 unreserved chars stay; everything else UTF-8 percent-encoded
    return String(s).replace(/[^A-Za-z0-9\-._~]/g, c => encodeURIComponent(c));
  }
  function decodeStrict(s) {
    try { return decodeURIComponent(String(s)); } catch (e) { return null; }
  }
  return { encodeComponent, decodeComponent, encodeAll, decodeAll, encodeStrict, decodeStrict };
});