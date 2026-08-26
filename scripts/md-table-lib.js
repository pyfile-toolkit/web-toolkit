/* md-table-lib.js — UMD CSV->Markdown table converter (no deps). Runtime: browser + tests. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MdTableLib = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  // parseCSV: handles quoted fields, commas and pipes
  function parseCSV(text, sep) {
    sep = sep || ',';
    var rows = [], row = [], field = '', inQ = false;
    var s = String(text == null ? '' : text).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (inQ) {
        if (c === '"') {
          if (s[i + 1] === '"') { field += '"'; i++; }
          else inQ = false;
        } else field += c;
      } else if (c === '"' && field === '') inQ = true;
      else if (c === sep) { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else field += c;
    }
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    return rows.filter(function (r) { return r.some(function (x) { return x.trim() !== ''; }); });
  }
  function escapeCell(v) {
    var s = String(v == null ? '' : v);
    s = s.replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\n/g, '<br>');
    return s;
  }
  function toMarkdown(text, opts) {
    opts = opts || {};
    var sep = (opts.separator === 'pipe') ? '|' : (opts.separator || ',');
    var rows = parseCSV(text, sep);
    if (!rows.length) return '';
    var cols = Math.max.apply(null, rows.map(function (r) { return r.length; }));
    var norm = rows.map(function (r) {
      var a = r.slice(0, cols);
      while (a.length < cols) a.push('');
      return a;
    });
    var header = opts.header !== false ? norm.shift() : rows[0].map(function () { return ''; });
    if (opts.header === false && rows.length) { header = rows[0].map(function () { return ''; }); }
    var lines = [];
    lines.push('| ' + header.map(escapeCell).join(' | ') + ' |');
    lines.push('|' + header.map(function () { return '---'; }).join('|') + '|');
    norm.forEach(function (r) { lines.push('| ' + r.map(escapeCell).join(' | ') + ' |'); });
    return lines.join('\n');
  }
  return { parseCSV: parseCSV, toMarkdown: toMarkdown };
});