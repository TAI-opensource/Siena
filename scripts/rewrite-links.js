const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'quintoandar');

const script = `<script>
(function(){
  function rewriteLinks() {
    document.querySelectorAll('a[href]').forEach(function(a) {
      var h = a.getAttribute('href');
      if (h && h.indexOf('quintoandar.com.br/imovel/') !== -1) {
        var path = h.replace(/.*quintoandar\\.com\\.br/, '');
        a.setAttribute('href', path);
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', rewriteLinks);
  } else {
    rewriteLinks();
  }
  new MutationObserver(rewriteLinks).observe(document.body || document.documentElement, {childList: true, subtree: true});
})();
</script></body>`;

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
let count = 0;
files.forEach(f => {
  const fp = path.join(dir, f);
  let html = fs.readFileSync(fp, 'utf8');
  if (html.includes('quintoandar.com.br/imovel/') && !html.includes('rewriteLinks')) {
    html = html.replace('</body>', script);
    fs.writeFileSync(fp, html);
    count++;
  }
});
console.log(`Rewrote links in ${count} files`);
