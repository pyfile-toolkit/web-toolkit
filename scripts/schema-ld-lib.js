/* schema-ld-lib.js — UMD JSON-LD snippet generator (no deps). Runtime: browser + tests. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SchemaLdLib = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  function base(type, ctx) { return Object.assign({ '@context': 'https://schema.org', '@type': type }, ctx || {}); }
  function organization(o) {
    return base('Organization', { name: o.name, url: o.url, logo: o.logo ? { '@type': 'ImageObject', url: o.logo } : undefined,
      sameAs: o.sameAs && o.sameAs.length ? o.sameAs : undefined });
  }
  function product(p) {
    return base('Product', { name: p.name, description: p.description, image: p.image,
      offers: { '@type': 'Offer', price: p.price, priceCurrency: p.currency || 'USD', availability: 'https://schema.org/InStock',
        url: p.url } });
  }
  function article(a) {
    return base('Article', { headline: a.headline, description: a.description, image: a.image,
      author: { '@type': 'Person', name: a.author }, publisher: { '@type': 'Organization', name: a.publisher || '' },
      datePublished: a.datePublished, dateModified: a.dateModified || a.datePublished });
  }
  function faq(f) {
    var qs = (f.questions || []).filter(function (q) { return q.q && q.a; })
      .map(function (q) { return { '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: q.a } }; });
    return base('FAQPage', { mainEntity: qs });
  }
  function breadcrumb(items) {
    var list = (items || []).filter(function (x) { return x.name && x.url; })
      .map(function (x, i) { return { '@type': 'ListItem', position: i + 1, name: x.name, item: x.url }; });
    return base('BreadcrumbList', { itemListElement: list });
  }
  function render(type, fields) {
    switch (type) {
      case 'Organization': return organization(fields);
      case 'Product': return product(fields);
      case 'Article': return article(fields);
      case 'FAQPage': return faq(fields);
      case 'BreadcrumbList': return breadcrumb(fields);
      default: return null;
    }
  }
  function toJson(type, fields) { return JSON.stringify(render(type, fields), null, 2); }
  return { render: render, toJson: toJson, organization: organization, product: product, article: article, faq: faq, breadcrumb: breadcrumb };
});