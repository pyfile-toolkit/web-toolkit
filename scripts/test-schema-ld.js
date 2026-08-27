const assert = require('assert');
const S = require('./schema-ld-lib.js');
let o = S.organization({name:'Acme', url:'https://acme.com'});
assert.strictEqual(o['@type'], 'Organization');
assert.ok(!o.logo); // omitted when absent
o = S.organization({name:'Acme', url:'https://acme.com', logo:'https://acme.com/l.png'});
assert.strictEqual(o.logo.url, 'https://acme.com/l.png');
let p = S.product({name:'Tool', price:'9.99', currency:'USD'});
assert.strictEqual(p.offers.price, '9.99');
assert.strictEqual(p.offers.availability, 'https://schema.org/InStock');
let f = S.faq({questions:[{q:'Q1', a:'A1'},{q:'Q2', a:''},{q:'', a:'orphan'}]});
assert.strictEqual(f.mainEntity.length, 1);
assert.strictEqual(f.mainEntity[0].name, 'Q1');
let b = S.breadcrumb([{name:'Home', url:'/'},{name:'Docs', url:'/docs'}]);
assert.strictEqual(b.itemListElement.length, 2);
assert.strictEqual(b.itemListElement[1].position, 2);
let a = S.article({headline:'H', author:'Me', datePublished:'2026-01-01'});
assert.strictEqual(a.author.name, 'Me');
assert.strictEqual(a.dateModified, '2026-01-01'); // falls back to published
assert.throws(()=>JSON.parse(S.toJson('Product', {})).offers.price===undefined ? (()=>{throw new Error('x')})() : null);
console.log('schema-ld-lib tests: OK');
