// Универсальный крипто-донат блок. Встраивается: <div id="crypto-donate"></div> + <script src="donate.js"></script>
window.CRYPTO_DONATIONS = {
  BTC: { label: "Bitcoin (BTC)", addr: "1CaYRsXjEWN2JvpBuku75dK9rUgiFvXkb5" },
  LNB: { label: "Lightning (sats)", addr: "68hx4qea@ln.bot" },
  ETH: { label: "Ethereum (EVM)", addr: "0xA43774fD2e867FC45b782456d78F135a215D5561" },
  SOL: { label: "Solana (SOL)", addr: "3JSfz26cREL7RqssSWCZ2Aoafh6wZ8BVaDSSQPKuqN2Z" }
};
(function(){
  function mount(){
    var el = document.getElementById('crypto-donate');
    if(!el) return;
    el.innerHTML =
      '<div style="margin-top:16px;padding:14px;background:#161a33;border:1px solid #334155;border-radius:10px;text-align:center">'+
      '<div style="font-weight:600;color:#e2e8f0;margin-bottom:8px">⚡ Support with crypto (no KYC)</div>'+
      '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">'+
      Object.keys(window.CRYPTO_DONATIONS).map(function(k){
        var d = window.CRYPTO_DONATIONS[k];
        return '<button onclick="window.showDonateAddr(\''+k+'\')" style="padding:8px 16px;border:1px solid #475569;background:#1e293b;color:#cbd5e1;border-radius:8px;cursor:pointer;font-weight:600">'+d.label+'</button>';
      }).join('')+
      '</div>'+
      '<div id="donate-addr" style="margin-top:10px;font-family:monospace;font-size:.8rem;color:#94a3b8;word-break:break-all"></div>'+
      '</div>';
  }
  window.showDonateAddr = function(k){
    var d = window.CRYPTO_DONATIONS[k];
    var box = document.getElementById('donate-addr');
    if(!box || !d) return;
    box.innerHTML = '<span style="color:#e2e8f0">'+d.label+':</span> '+d.addr+
      ' <button onclick="navigator.clipboard.writeText(\''+d.addr+'\');this.textContent=\'Copied!\'" style="margin-left:8px;padding:2px 8px;background:#334155;border:1px solid #475569;border-radius:6px;color:#cbd5e1;cursor:pointer;font-size:.75rem">Copy</button>';
  };
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', mount); }
  else mount();
})();
