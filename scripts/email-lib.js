/* email-lib.js — UMD email extraction (no deps). Runtime: browser + tests. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.EmailLib = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Practical email regex: local 1-64 chars, domain with optional subdomains + tld.
  const RE = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+/g;

  // Known throwaway / image-extension false positives to skip by default.
  const NOISE = /\.(png|jpe?g|gif|svg|webp|bmp|css|js|json|html?|pdf|zip|gz|tar|wav|mp3|mp4)$/i;

  function extractEmails(text, opts) {
    const o = opts || {};
    const out = new Set();
    const m = String(text || '').match(RE) || [];
    for (const raw of m) {
      let em = raw.replace(/^[.]+|[.]+$/g, '').replace(/^[^.a-zA-Z0-9]/,'').trim();
      const idx = em.indexOf('@');
      const local = em.slice(0, idx), domain = em.slice(idx + 1);
      if (!local || local.length > 64 || domain.length > 253) continue;
      if (domain.split('.').length < 2) continue;
      if (em.endsWith('.')) em = em.slice(0, -1);
      if (!o.noisy && NOISE.test(em)) continue;
      out.add(em.toLowerCase());
    }
    return Array.from(out).sort();
  }

  return { extractEmails, RE };
});