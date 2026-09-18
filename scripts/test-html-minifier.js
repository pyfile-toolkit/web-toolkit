const fs=require('fs');
const html=fs.readFileSync('html-minifier.html','utf8');
const src=html.match(/<script>([\s\S]*?)<\/script>/g).slice(-1)[0].replace(/<\/?script>/g,'');
const fn=new Function(src.slice(0, src.indexOf('function minifyIt'))+'; return {minifyHtml};');
const {minifyHtml}=fn();
const res=[];
function eq(n,a,e){const ok=a===e;res.push((ok?'PASS':'FAIL')+' '+n+(ok?'':' got='+JSON.stringify(a).slice(0,120)+' exp='+JSON.stringify(e).slice(0,120)));}
// comments removed
eq('comment removed', minifyHtml('<div><!-- bye --><p>x</p></div>',{comments:true,space:true,cond:true}), '<div><p>x</p></div>');
// inter-tag ws collapsed
eq('collapse ws', minifyHtml('<div>\n  <p>a</p>\n  <p>b</p>\n</div>',{comments:true,space:true,cond:true}), '<div><p>a</p><p>b</p></div>');
// pre preserved exactly
eq('pre intact', minifyHtml('<pre>\n  code\n    indented\n</pre>',{comments:true,space:true,cond:true}), '<pre>\n  code\n    indented\n</pre>');
// textarea preserved
eq('textarea intact', minifyHtml('<textarea>\n  hi\n</textarea>',{comments:true,space:true,cond:true}), '<textarea>\n  hi\n</textarea>');
// script content preserved
eq('script intact', minifyHtml('<script>\n  var x = 1;\n</script>',{comments:true,space:true,cond:true}), '<script>\n  var x = 1;\n</script>');
// IE conditional kept when cond=true
const m=minifyHtml('<div><!--[if IE]><p>old</p><![endif]--></div>',{comments:true,space:true,cond:true});
eq('cond kept', m, '<div><!--[if IE]><p>old</p><![endif]--></div>');
// IE conditional removed when cond=false
const m2=minifyHtml('<div><!--[if IE]><p>old</p><![endif]--></div>',{comments:true,space:true,cond:false});
eq('cond removed', m2, '<div></div>');
// plain comment removed, not conditional
eq('plain in cond-off', minifyHtml('<div><!-- plain --></div>',{comments:true,space:false,cond:true}), '<div></div>');
// whitespace collapsing does not harm inline text: 'Hello   world'
eq('inline text single space', minifyHtml('<p>Hello\t\t world</p>',{comments:true,space:true,cond:true}), '<p>Hello world</p>');
console.log(res.join('\n'));
console.log('TOTAL '+res.filter(r=>r.startsWith('PASS')).length+'/'+res.length);
