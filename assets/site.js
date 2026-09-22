/* Web Dev Toolkit — shared chrome.
   Инъекция: header (лого/навигация/CTA LLM API), breadcrumbs, CTA-band, footer.
   Никакой критичный для SEO контент здесь не создаётся — только навигация.
   Резервируем высоту шапки через CSS, чтобы не было layout shift. */
(function(){
  'use strict';
  var REPO='https://pyfile-toolkit.github.io/web-toolkit/';

  // --- path helper: работает и из корня, и из /guides/ ---
  var inGuides = /\/guides\//.test(location.pathname);
  var base = inGuides ? '../' : '';
  function U(p){ return base + p; }

  // --- header ---
  function buildHeader(){
    var el=document.createElement('header');
    el.className='wdt-header';
    el.innerHTML =
      '<div class="wdt-header-inner">'+
        '<a class="wdt-logo" href="'+U('index.html')+'"><span class="dot"></span>Web&nbsp;Toolkit</a>'+
        '<nav class="wdt-nav">'+
          '<a href="'+U('index.html')+'">All tools</a>'+
          '<a href="'+U('json-formatter.html')+'">JSON</a>'+
          '<a href="'+U('base64.html')+'">Base64</a>'+
          '<a href="'+U('uuid-generator.html')+'">UUID</a>'+
          '<a href="'+U('typing-test.html')+'">Typing</a>'+
          '<a href="'+U('guides/')+'">Guides</a>'+
        '</nav>'+
        '<a class="cta" href="'+U('llm-api.html')+'">LLM API · no KYC</a>'+
      '</div>';
    return el;
  }

  // --- breadcrumbs из URL ---
  function buildCrumbs(){
    var path=location.pathname.split('/').pop()||'index.html';
    if(path==='index.html'||path==='') return null;
    var name=path.replace('.html','').replace(/-/g,' ');
    name=name.charAt(0).toUpperCase()+name.slice(1);
    var el=document.createElement('nav');
    el.className='wdt-crumbs';
    el.setAttribute('aria-label','Breadcrumb');
    el.innerHTML='<a href="'+U('index.html')+'">Home</a> › <span>'+name+'</span>';
    return el;
  }

  // --- CTA band для LLM API ---
  function buildCtaBand(){
    var el=document.createElement('div');
    el.className='wdt-cta-band';
    el.innerHTML =
      '<div class="inner">'+
        '<div><h3>Need an LLM API without KYC?</h3>'+
        '<p>OpenAI-compatible endpoint. Pay in Lightning / Bitcoin. No signup.</p></div>'+
        '<a class="btn" href="'+U('llm-api.html')+'" data-cta="llm-api">View plans →</a>'+
      '</div>';
    return el;
  }

  // --- footer ---
  function buildFooter(){
    var el=document.createElement('footer');
    el.className='wdt-footer';
    el.innerHTML =
      '<div class="wdt-footer-inner">'+
        '<div><h4>Popular tools</h4>'+
          '<a href="'+U('json-formatter.html')+'">JSON Formatter</a>'+
          '<a href="'+U('base64.html')+'">Base64 Encoder</a>'+
          '<a href="'+U('uuid-generator.html')+'">UUID Generator</a>'+
          '<a href="'+U('password-generator.html')+'">Password Generator</a>'+
          '<a href="'+U('qr-generator.html')+'">QR Code Generator</a>'+
        '</div>'+
        '<div><h4>Learn</h4>'+
          '<a href="'+U('guides/base64-explained.html')+'">Base64 Explained</a>'+
          '<a href="'+U('guides/yaml-vs-json.html')+'">YAML vs JSON</a>'+
          '<a href="'+U('guides/md5-vs-sha256.html')+'">MD5 vs SHA256</a>'+
          '<a href="'+U('guides/lnd-payments-guide.html')+'">Lightning Payments</a>'+
        '</div>'+
        '<div><h4>Site</h4>'+
          '<a href="'+U('about.html')+'">About</a>'+
          '<a href="'+U('privacy.html')+'">Privacy</a>'+
          '<a href="'+U('llm-api.html')+'">LLM API</a>'+
        '</div>'+
        '<div class="copyright">© '+new Date().getFullYear()+' pyfile-toolkit · Free, open-source, 100% in-browser.</div>'+
      '</div>';
    return el;
  }

  function mount(){
    var body=document.body;
    // header первым
    if(!document.querySelector('.wdt-header')) body.insertBefore(buildHeader(), body.firstChild);
    // breadcrumbs после header
    var cr=buildCrumbs();
    if(cr && !document.querySelector('.wdt-crumbs')){
      var h=document.querySelector('.wdt-header');
      h.parentNode.insertBefore(cr, h.nextSibling);
    }
    // CTA band + footer в конец
    if(!document.querySelector('.wdt-cta-band')){
      var band=buildCtaBand();
      body.appendChild(band);
      // трекинг клика по CTA
      band.querySelector('[data-cta]').addEventListener('click',function(){
        if(window.gtag) window.gtag('event','cta_llm_api_click',{source:'cta_band'});
      });
    }
    if(!document.querySelector('.wdt-footer')) body.appendChild(buildFooter());
    // трекинг клика по шапке CTA
    var hc=document.querySelector('.wdt-header .cta');
    if(hc) hc.addEventListener('click',function(){
      if(window.gtag) window.gtag('event','cta_llm_api_click',{source:'header'});
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount);
  else mount();
})();