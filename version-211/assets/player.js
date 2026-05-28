(function () {
  window.initMoviePlayer = function (streamUrl) {
    const video = document.getElementById('movie-player');
    const button = document.getElementById('player-start');

    if (!video || !streamUrl) {
      return;
    }

    let attached = false;

    const attach = function () {
      if (attached) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }

      attached = true;
    };

    const start = function () {
      attach();

      if (button) {
        button.classList.add('is-hidden');
      }

      video.controls = true;

      const playTask = video.play();

      if (playTask && typeof playTask.catch === 'function') {
        playTask.catch(function () {});
      }
    };

    if (button) {
      button.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });

    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });
  };
})();
