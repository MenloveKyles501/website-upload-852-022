
(function(){
  const qs = (s, el=document) => el.querySelector(s);
  const qsa = (s, el=document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function hashCode(str){
    let h=0;
    for (let i=0;i<str.length;i++) h=((h<<5)-h)+str.charCodeAt(i), h|=0;
    return Math.abs(h);
  }
  function colorTriplet(seed){
    const h = hashCode(seed).toString(16).padStart(8,'0');
    return ['#'+h.slice(0,6), '#'+h.slice(2,8), '#'+h.slice(1,7)];
  }
  function buildPoster(item, size='md'){
    const [c1,c2,c3] = colorTriplet(item.title || item.id || 'movie');
    const tags = (item.tags || []).slice(0,3).join(' · ');
    const meta = [item.year, item.region, item.genre].filter(Boolean).join(' · ');
    return `
      <div class="poster poster-${size}" style="--c1:${c1};--c2:${c2};--c3:${c3};">
        <span class="poster-orb poster-orb-a"></span>
        <span class="poster-orb poster-orb-b"></span>
        <span class="poster-ribbon">${esc(item.bucketName || item.category || '推荐')}</span>
        <div class="poster-kicker">${esc(meta)}</div>
        <div class="poster-title">${esc(item.title || '')}</div>
        <div class="poster-tags">${esc(tags)}</div>
        <div class="poster-foot">${esc(item.type || '')} · ${esc(item.id || '')}</div>
      </div>`;
  }
  function initMobileNav(){
    const btn = qs('[data-nav-toggle]');
    const panel = qs('[data-nav-panel]');
    if (!btn || !panel) return;
    btn.addEventListener('click', () => panel.classList.toggle('show'));
  }
  function initHeroSlider(){
    const shell = qs('[data-hero-shell]');
    if (!shell) return;
    const slides = qsa('[data-hero-slide]', shell);
    const dots = qsa('[data-hero-dot]', shell);
    const prev = qs('[data-hero-prev]', shell);
    const next = qs('[data-hero-next]', shell);
    if (slides.length <= 1) return;
    let idx = 0;
    let timer;
    const show = (n) => {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s,i)=>s.classList.toggle('active', i === idx));
      dots.forEach((d,i)=>d.classList.toggle('active', i === idx));
    };
    const start = () => {
      stop();
      timer = setInterval(() => show(idx + 1), 5000);
    };
    const stop = () => { if (timer) clearInterval(timer); };
    prev && prev.addEventListener('click', () => { show(idx - 1); start(); });
    next && next.addEventListener('click', () => { show(idx + 1); start(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { show(i); start(); }));
    shell.addEventListener('mouseenter', stop);
    shell.addEventListener('mouseleave', start);
    show(0);
    start();
  }
  function initPlayer(){
    const shell = qs('[data-player-shell]');
    if (!shell) return;
    const video = qs('video', shell);
    const btn = qs('[data-player-play]', shell);
    if (!video || !btn) return;
    const sync = () => {
      shell.classList.toggle('playing', !video.paused && !video.ended);
      btn.textContent = video.paused ? '▶' : '❚❚';
    };
    btn.addEventListener('click', async () => {
      try {
        if (video.paused) await video.play(); else video.pause();
      } catch (e) {}
      sync();
    });
    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    video.addEventListener('ended', sync);
    sync();
  }
  function initSearch(){
    const root = qs('[data-search-root]');
    if (!root || !window.MOVIE_INDEX) return;
    const input = qs('[data-search-input]', root);
    const region = qs('[data-search-region]', root);
    const year = qs('[data-search-year]', root);
    const category = qs('[data-search-category]', root);
    const results = qs('[data-search-results]', root);
    const count = qs('[data-search-count]', root);
    const render = (list) => {
      if (!results) return;
      const html = list.slice(0, 200).map(item => `
        <a class="movie-card grid" href="movie-${item.id}.html">
          ${buildPoster(item, 'sm')}
          <div class="movie-card-body">
            <h3>${esc(item.title)}</h3>
            <p>${esc(item.oneLine || '')}</p>
            <div class="movie-meta"><span>${esc(item.year || '')}</span><span>${esc(item.region || '')}</span><span>${esc(item.genre || '')}</span></div>
          </div>
        </a>`).join('');
      results.innerHTML = html || '<div class="panel"><h3>没有匹配结果</h3><p>请尝试更换关键词或筛选条件。</p></div>';
      if (count) count.textContent = String(list.length);
    };
    const filter = () => {
      const q = (input?.value || '').trim().toLowerCase();
      const reg = (region?.value || '').trim();
      const y = (year?.value || '').trim();
      const cat = (category?.value || '').trim();
      const list = window.MOVIE_INDEX.filter(item => {
        const hay = [item.title,item.region,item.type,item.genre,(item.tags||[]).join(' '),item.oneLine,item.bucketName,item.year].join(' ').toLowerCase();
        if (q && !hay.includes(q)) return false;
        if (reg && item.region !== reg) return false;
        if (y && String(item.year) !== y) return false;
        if (cat && item.bucketSlug !== cat) return false;
        return true;
      });
      list.sort((a,b)=> (b.score||0)-(a.score||0));
      render(list);
    };
    [input, region, year, category].forEach(el => el && el.addEventListener('input', filter));
    [region, year, category].forEach(el => el && el.addEventListener('change', filter));
    filter();
  }
  document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initHeroSlider();
    initPlayer();
    initSearch();
  });
  window.MovieSite = { buildPoster };
})();
