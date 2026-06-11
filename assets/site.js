/* ===== Zina Liu site interactions ===== */
(function(){
  // mobile nav toggle
  document.addEventListener('click', function(e){
    const t = e.target.closest('.nav-toggle');
    if(t){ document.querySelector('.nav-links').classList.toggle('open'); }
  });

  // articles page: category filter + search
  const filters = document.querySelectorAll('.filters .f');
  const cards = document.querySelectorAll('.post-grid .pcard');
  const searchBar = document.querySelector('.search-bar');
  const searchInput = document.querySelector('.search-bar input');
  const empty = document.querySelector('.empty');
  let activeCat = 'all';
  let query = '';

  function apply(){
    let shown = 0;
    cards.forEach(c=>{
      const okCat = activeCat==='all' || c.dataset.cat===activeCat;
      const okQ = !query || (c.dataset.title||'').toLowerCase().includes(query) || (c.dataset.text||'').toLowerCase().includes(query);
      const show = okCat && okQ;
      c.style.display = show ? '' : 'none';
      if(show) shown++;
    });
    if(empty) empty.style.display = shown===0 ? '' : 'none';
  }

  filters.forEach(f=>f.addEventListener('click',()=>{
    filters.forEach(x=>x.classList.remove('active'));
    f.classList.add('active');
    activeCat = f.dataset.cat;
    // sync URL hash
    if(activeCat==='all'){ history.replaceState(null,'',location.pathname); }
    else { history.replaceState(null,'','#'+activeCat); }
    apply();
  }));

  if(searchInput){
    searchInput.addEventListener('input',()=>{ query = searchInput.value.trim().toLowerCase(); apply(); });
  }

  // nav search icon -> reveal search bar (on articles page) or go to articles
  document.querySelectorAll('.search').forEach(s=>{
    s.addEventListener('click',()=>{
      if(searchBar){
        searchBar.style.display='block';
        searchInput && searchInput.focus();
      } else {
        location.href = (s.dataset.base||'') + 'articles.html#search';
      }
    });
  });

  // honour incoming hash (#invest etc. or #search) — on load AND on hash change,
  // so footer/nav category links work even when already on the articles page
  function applyHash(){
    if(!filters.length) return;
    const h = decodeURIComponent(location.hash.replace('#',''));
    if(h==='search'){
      if(searchBar){ searchBar.style.display='block'; searchInput&&searchInput.focus(); }
      return;
    }
    if(h){
      const match = [...filters].find(f=>f.dataset.cat===h);
      if(match && !match.classList.contains('active')){ match.click(); }
    } else {
      // bare hash / no hash -> show everything
      const all = [...filters].find(f=>f.dataset.cat==='all');
      if(all && !all.classList.contains('active')){ all.click(); }
    }
  }
  applyHash();
  window.addEventListener('hashchange', applyHash);

  /* ===== article pages: author byline + view counter (auto-injected) ===== */
  (function(){
    const head = document.querySelector('.article .art-head');
    if(!head) return;

    const AUTHOR = 'Zina';
    const meta = head.querySelector('.meta');

    // --- author byline (below the title / meta row) ---
    if(meta && !head.querySelector('.byline')){
      const by = document.createElement('div');
      by.className = 'byline';
      by.innerHTML = '<span>作者：<span class="by-name"></span></span>';
      by.querySelector('.by-name').textContent = AUTHOR; // textContent avoids any injection
      meta.insertAdjacentElement('afterend', by);
    }

    // --- view counter (beside the date, inside .meta) ---
    if(meta && !meta.querySelector('.views')){
      const slug = (location.pathname.split('/').pop() || 'index')
        .replace(/\.html?$/i,'').replace(/[^a-zA-Z0-9_-]/g,'-') || 'home';

      const dot = document.createElement('span'); dot.textContent = '·';
      const views = document.createElement('span');
      views.className = 'views loading';
      views.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg><span class="views-num">…</span>';
      meta.appendChild(dot);
      meta.appendChild(views);

      const numEl = views.querySelector('.views-num');
      const NS = 'zinaliu-blog';

      function show(n){
        views.classList.remove('loading');
        numEl.textContent = (n==null ? '—' : Number(n).toLocaleString('en-US')) + ' 次瀏覽';
      }
      function localFallback(){
        const k = 'views:'+slug;
        let n = parseInt(localStorage.getItem(k)||'0',10) || 0;
        // count once per browser session to avoid refresh inflation
        if(!sessionStorage.getItem('vseen:'+slug)){ n += 1; localStorage.setItem(k,String(n)); sessionStorage.setItem('vseen:'+slug,'1'); }
        show(n);
      }

      // Abacus: free, no-account anonymous hit counter (CORS-enabled).
      // /hit increments; /get just reads. Increment only once per session.
      const firstThisSession = !sessionStorage.getItem('vseen:'+slug);
      const verb = firstThisSession ? 'hit' : 'get';
      const url = 'https://abacus.jasoncameron.dev/'+verb+'/'+encodeURIComponent(NS)+'/'+encodeURIComponent(slug);

      fetch(url, {cache:'no-store'})
        .then(r => r.ok ? r.json() : Promise.reject(r.status))
        .then(d => {
          if(d && typeof d.value === 'number'){
            if(firstThisSession) sessionStorage.setItem('vseen:'+slug,'1');
            show(d.value);
          } else { localFallback(); }
        })
        .catch(() => localFallback());
    }
  })();
})();
