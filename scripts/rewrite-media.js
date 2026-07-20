const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'quintoandar');

const script = `<script>
(function(){
  function rewriteMedia() {
    document.querySelectorAll('img[src*="quintoandar.com.br"]').forEach(function(img) {
      var src = img.getAttribute('src');
      if (src && src.indexOf('quintoandar.com.br') !== -1) {
        var p = src.replace(/.*quintoandar\\.com\\.br/, '');
        img.setAttribute('src', p);
      }
    });
    document.querySelectorAll('[style*="quintoandar.com.br"]').forEach(function(el) {
      var s = el.getAttribute('style');
      if (s) el.setAttribute('style', s.replace(/https?:\\/\\/[^"']*quintoandar\\.com\\.br/g, ''));
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', rewriteMedia);
  } else {
    rewriteMedia();
  }
  new MutationObserver(rewriteMedia).observe(document.body || document.documentElement, {childList: true, subtree: true});
})();
</script></body>`;

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
let count = 0;
files.forEach(f => {
  const fp = path.join(dir, f);
  let html = fs.readFileSync(fp, 'utf8');
  if (html.includes('quintoandar.com.br/img/') && !html.includes('rewriteMedia')) {
    html = html.replace('</body>', script);
    fs.writeFileSync(fp, html);
    count++;
  }
});
console.log(`Rewrote media in ${count} files`);
