
(function(){
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  if (header && toggle) {
    toggle.addEventListener('click', () => header.classList.toggle('open'));
  }

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = [...hero.querySelectorAll('.hero-slide')];
    const prev = hero.querySelector('[data-prev]');
    const next = hero.querySelector('[data-next]');
    let idx = Math.max(0, slides.findIndex(s => s.classList.contains('active')));
    const show = (n) => {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    };
    if (prev) prev.addEventListener('click', () => show(idx - 1));
    if (next) next.addEventListener('click', () => show(idx + 1));
    if (slides.length > 1) setInterval(() => show(idx + 1), 5500);
  }

  const inputs = document.querySelectorAll('[data-filter-input]');
  inputs.forEach(input => {
    const list = document.querySelector(input.getAttribute('data-target'));
    const cards = list ? [...list.querySelectorAll('.movie-card')] : [];
    const status = document.querySelector(input.getAttribute('data-status'));
    const apply = () => {
      const q = input.value.trim().toLowerCase();
      let shown = 0;
      cards.forEach(card => {
        const text = [card.dataset.title, card.dataset.genre, card.dataset.region, card.dataset.year].join(' ').toLowerCase();
        const ok = !q || text.includes(q);
        card.style.display = ok ? '' : 'none';
        if (ok) shown += 1;
      });
      if (status) status.textContent = q ? `筛选结果：${shown} 条` : `共 ${cards.length} 条`;
    };
    input.addEventListener('input', apply);
    apply();
  });

  const playerWrap = document.querySelector('[data-player]');
  if (playerWrap) {
    const video = playerWrap.querySelector('video');
    const overlay = playerWrap.querySelector('.play-overlay');
    const playBtn = playerWrap.querySelector('[data-play]');
    const source = playerWrap.getAttribute('data-m3u8');
    let hls = null;
    const startPlay = async () => {
      if (overlay) overlay.classList.add('hidden');
      if (!video || !source) return;
      try {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else if (window.Hls && Hls.isSupported()) {
          if (!hls) hls = new Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }
        await video.play();
      } catch (e) {
        if (overlay) overlay.classList.remove('hidden');
      }
    };
    if (overlay) overlay.addEventListener('click', startPlay);
    if (playBtn) playBtn.addEventListener('click', startPlay);
  }
})();
