/* diff-lib.js — UMD LCS-based line diff for the Web Dev Toolkit Diff Checker.
   Runtime: browser + tests (module.exports). No dependencies. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.DiffLib = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Standard LCS DP over lines. Returns a sequence of operations.
  function diffLines(aLines, bLines) {
    const n = aLines.length, m = bLines.length;
    const dp = new Uint32Array((n + 1) * (m + 1));
    const idx = (i, j) => i * (m + 1) + j;
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        dp[idx(i, j)] = aLines[i] === bLines[j]
          ? dp[idx(i + 1, j + 1)] + 1
          : Math.max(dp[idx(i + 1, j)], dp[idx(i, j + 1)]);
      }
    }
    const ops = [];
    let i = 0, j = 0;
    while (i < n && j < m) {
      if (aLines[i] === bLines[j]) {
        ops.push({ type: 'same', text: aLines[i] });
        i++; j++;
      } else if (dp[idx(i + 1, j)] >= dp[idx(i, j + 1)]) {
        ops.push({ type: 'del', text: aLines[i] });
        i++;
      } else {
        ops.push({ type: 'add', text: bLines[j] });
        j++;
      }
    }
    while (i < n) { ops.push({ type: 'del', text: aLines[i] }); i++; }
    while (j < m) { ops.push({ type: 'add', text: bLines[j] }); j++; }
    return ops;
  }

  function splitText(t) {
    const norm = (t || '').replace(/\r\n?/g, '\n');
    if (norm === '') return [];
    return norm.split('\n');
  }

  function stats(ops) {
    let same = 0, del = 0, add = 0;
    for (const o of ops) {
      if (o.type === 'same') same++;
      else if (o.type === 'del') del++;
      else add++;
    }
    return { same, del, add };
  }

  function similarity(ops) {
    const s = stats(ops);
    const total = s.same + s.add + s.del;
    if (total === 0) return 100;
    return Math.round((s.same / total) * 1000) / 10;
  }

  return { diffLines, splitText, stats, similarity };
});