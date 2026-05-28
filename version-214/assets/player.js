(function () {
  const initialize = function (root) {
    const video = root.querySelector('video');
    const button = root.querySelector('[data-play-button]');
    const stream = root.getAttribute('data-player-stream');
    let instance = null;

    if (!video || !stream) {
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      instance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      instance.loadSource(stream);
      instance.attachMedia(video);
    } else {
      video.src = stream;
    }

    const showButton = function () {
      if (button && !video.ended && video.currentTime > 0) {
        button.classList.add('is-hidden');
      }
    };

    const play = function () {
      if (!button) {
        video.play();
        return;
      }
      button.classList.add('is-loading');
      const request = video.play();
      if (request && typeof request.then === 'function') {
        request.then(function () {
          button.classList.add('is-hidden');
        }).catch(function () {
          button.classList.remove('is-loading');
        });
      } else {
        button.classList.add('is-hidden');
      }
    };

    if (button) {
      button.addEventListener('click', play);
    }

    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });

    video.addEventListener('pause', showButton);

    video.addEventListener('ended', function () {
      if (button) {
        button.classList.remove('is-hidden');
        button.classList.remove('is-loading');
      }
    });

    window.addEventListener('beforeunload', function () {
      if (instance) {
        instance.destroy();
      }
    });
  };

  document.querySelectorAll('[data-player]').forEach(initialize);
})();
