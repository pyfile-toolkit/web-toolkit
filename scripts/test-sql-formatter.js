const fs=require('fs');
const html=fs.readFileSync('sql-formatter.html','utf8');
const src=html.match(/<script>([\s\S]*?)<\/script>/g).slice(-1)[0].replace(/<\/?script>/g,'');
const fn=new Function(src.slice(0, src.indexOf('function formatIt'))+'; return {formatSql};');
const {formatSql}=fn();
const res=[];
function eq(n,a,e){const ok=a===e;res.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' GOT:\n'+a+'\nEXP:\n'+e));}
// basic select
eq('select', formatSql('SELECT id,name FROM users WHERE id>5'),
`SELECT id, name
FROM users
WHERE id > 5`);
// joins aligned
eq('join', formatSql('SELECT u.id FROM users u JOIN orders o ON o.user_id=u.id WHERE u.id=1'),
`SELECT u.id
FROM users u
JOIN orders o
ON o.user_id = u.id
WHERE u.id = 1`);
// string literal preserved
eq('string', formatSql("SELECT * FROM t WHERE name='a,b' AND x='it''s'"),
`SELECT *
FROM t
WHERE name = 'a,b' AND x = 'it''s'`);
// comment preserved + inline
eq('comment', formatSql('SELECT 1 -- note\nFROM dual'),
`SELECT 1
-- note
FROM dual`);
// subquery indent
const sq=formatSql('SELECT * FROM (SELECT id FROM users WHERE active=1) u');
eq('subquery has paren line', sq.includes('(') && sq.includes('  (') && sq.includes('  )'), true);
// case indented
const cq=formatSql("SELECT CASE WHEN a=1 THEN 'x' ELSE 'y' END AS v FROM t");
eq('case one-line ok', cq.includes('CASE') && cq.includes('THEN') && cq.includes('END AS v'), true);
// group/order/having/limit clauses
const gq=formatSql('SELECT a,count(*) c FROM t GROUP BY a HAVING count(*)>1 ORDER BY c DESC LIMIT 5');
eq('clause lines', gq.split('\n').length>=6, true);
// insert into
eq('insert', formatSql("INSERT INTO t (a,b) VALUES (1,2)"),
`INSERT INTO t (a, b)
VALUES (1, 2)`);
console.log(res.join('\n'));
console.log('TOTAL '+res.filter(r=>r.startsWith('PASS')).length+'/'+res.length);
