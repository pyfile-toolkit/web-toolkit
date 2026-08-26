/* md-lib.js — UMD minimal Markdown-to-HTML converter (no deps).
   Runtime: browser + tests (module.exports). Escape-first, XSS-safe. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MdLib = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function inline(s) {
    s = esc(s);
    // inline code first (protect)
    s = s.replace(/`([^`]+)`/g, (m, c) => '<code>' + c + '</code>');
    // bold
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
         .replace(/__([^_]+)__/g, '<strong>$1</strong>');
    // italic
    s = s.replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
         .replace(/_([^_\n]+)_/g, '<em>$1</em>');
    // links [text](url)
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      (m, t, u) => '<a href="' + u + '" rel="noopener" target="_blank">' + t + '</a>');
    return s;
  }

  function mdToHtml(src) {
    const lines = (src || '').replace(/\r\n?/g, '\n').split('\n');
    const out = [];
    let i = 0;
    const n = lines.length;
    while (i < n) {
      const line = lines[i];
      const fence = line.match(/^```\s*([\w+-]*)\s*$/);
      if (fence) {
        const lang = fence[1];
        const buf = [];
        i++;
        while (i < n && !/^```\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
        i++; // skip closing fence
        const code = esc(buf.join('\n'));
        out.push('<pre><code' + (lang ? ' class="language-' + esc(lang) + '"' : '') + '>' + (code || '') + '</code></pre>');
        continue;
      }
      const h = line.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        const lvl = h[1].length;
        out.push('<h' + lvl + '>' + inline(h[2]) + '</h' + lvl + '>');
        i++;
        continue;
      }
      if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
        out.push('<hr>');
        i++;
        continue;
      }
      if (/^\s*>/.test(line)) {
        const buf = [];
        while (i < n && /^\s*>/.test(lines[i])) {
          buf.push(inline(lines[i].replace(/^\s*>\s?/, '')));
          i++;
        }
        out.push('<blockquote>' + buf.join('<br>') + '</blockquote>');
        continue;
      }
      const ul = /^\s*[-*+]\s+(.*)$/.exec(line);
      if (ul) {
        const items = [];
        while (i < n) {
          const m = /^\s*[-*+]\s+(.*)$/.exec(lines[i]);
          if (m) { items.push('<li>' + inline(m[1]) + '</li>'); i++; } else break;
        }
        out.push('<ul>' + items.join('') + '</ul>');
        continue;
      }
      const ol = /^\s*\d+\.\s+(.*)$/.exec(line);
      if (ol) {
        const items = [];
        while (i < n) {
          const m = /^\s*\d+\.\s+(.*)$/.exec(lines[i]);
          if (m) { items.push('<li>' + inline(m[1]) + '</li>'); i++; } else break;
        }
        out.push('<ol>' + items.join('') + '</ol>');
        continue;
      }
      if (line.trim() === '') { i++; continue; }
      // paragraph (may be multi-line until blank)
      const buf = [line];
      i++;
      while (i < n && lines[i].trim() !== '' && !/^```/.test(lines[i]) &&
             !/^#{1,6}\s/.test(lines[i]) && !/^\s*[-*+]\s/.test(lines[i]) &&
             !/^\s*\d+\.\s/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      out.push('<p>' + inline(buf.join('<br>')) + '</p>');
    }
    return out.join('\n');
  }

  return { mdToHtml, inline, esc };
});