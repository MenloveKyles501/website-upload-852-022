(() => {
  const boxes = document.querySelectorAll('[data-player-box]');

  boxes.forEach((box) => {
    const video = box.querySelector('video');
    const overlay = box.querySelector('[data-play-trigger]');
    const stream = box.getAttribute('data-stream');
    let active = false;
    let hls = null;

    const attach = () => {
      if (active || !video || !stream) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }

      active = true;
    };

    const start = () => {
      attach();
      box.classList.add('is-playing');
      const promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(() => {});
      }
    };

    if (overlay) {
      overlay.addEventListener('click', start);
    }

    if (video) {
      video.addEventListener('click', () => {
        if (video.paused) {
          start();
        } else {
          video.pause();
        }
      });

      video.addEventListener('ended', () => {
        box.classList.remove('is-playing');
      });
    }
  });
})();
