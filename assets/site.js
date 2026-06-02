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
})();
