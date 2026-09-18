/* json-diff-lib.js — UMD JSON diff (leaf-level) (no deps). Runtime: browser + tests. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.JsonDiffLib = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  function flatten(node, prefix, out, seen) {
    out = out || []; seen = seen || new Set();
    if (node && typeof node === 'object') {
      var tag = seen.size;
      if (seen.has(node)) { out.push({ path: prefix, kind: 'circular', value: '[Circular]' }); return out; }
      seen.add(node);
      if (Array.isArray(node)) {
        node.forEach(function (v, i) { flatten(v, prefix + '[' + i + ']', out, seen); });
      } else {
        Object.keys(node).sort().forEach(function (k) { flatten(node[k], prefix ? prefix + '.' + k : k, out, seen); });
      }
      seen.delete(node);
    } else {
      out.push({ path: prefix || '<root>', value: node });
    }
    return out;
  }
  function parse(text) { return JSON.parse(String(text)); }
  function diff(aText, bText) {
    var A, B;
    try { A = parse(aText); } catch (e) { return { error: 'A is not valid JSON: ' + e.message }; }
    try { B = parse(bText); } catch (e) { return { error: 'B is not valid JSON: ' + e.message }; }
    var fa = flatten(A), fb = flatten(B);
    var ma = {}, mb = {};
    fa.forEach(function (x) { ma[x.path] = JSON.stringify(x.value); });
    fb.forEach(function (x) { mb[x.path] = JSON.stringify(x.value); });
    var changes = [];
    Object.keys(ma).forEach(function (p) {
      if (!(p in mb)) changes.push({ type: 'removed', path: p, value: ma[p] });
      else if (ma[p] !== mb[p]) changes.push({ type: 'changed', path: p, from: ma[p], to: mb[p] });
    });
    Object.keys(mb).forEach(function (p) {
      if (!(p in ma)) changes.push({ type: 'added', path: p, value: mb[p] });
    });
    changes.sort(function (x, y) { return x.path < y.path ? -1 : x.path > y.path ? 1 : 0; });
    return { changed: changes.length ? changes.length : 0, changes: changes, equal: changes.length === 0 };
  }
  function toText(diffResult) {
    if (diffResult.error) return diffResult.error;
    if (diffResult.equal) return '✓ JSON documents are identical.';
    var out = [];
    (diffResult.changes || []).forEach(function (c) {
      if (c.type === 'added') out.push('+ ' + c.path + ' = ' + c.value);
      else if (c.type === 'removed') out.push('- ' + c.path + ' = ' + c.value);
      else out.push('~ ' + c.path + ': ' + c.from + ' → ' + c.to);
    });
    return out.join('\n');
  }
  return { diff: diff, toText: toText, flatten: flatten };
});