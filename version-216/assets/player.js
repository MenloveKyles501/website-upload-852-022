(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function attachPlayer(player) {
    var video = player.querySelector('video');
    var button = player.querySelector('.play-overlay');
    var url = player.getAttribute('data-video-url');
    var loaded = false;
    var hlsInstance = null;

    function load() {
      if (loaded || !video || !url) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true });
        hlsInstance.loadSource(url);
        hlsInstance.attachMedia(video);
      } else {
        video.src = url;
      }
      loaded = true;
    }

    function start() {
      load();
      player.classList.add('is-playing');
      if (button) {
        button.hidden = true;
      }
      var result = video.play();
      if (result && typeof result.catch === 'function') {
        result.catch(function () {
          if (button) {
            button.hidden = false;
          }
          player.classList.remove('is-playing');
        });
      }
    }

    if (!video || !button) {
      return;
    }
    button.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
    window.addEventListener('pagehide', function () {
      if (hlsInstance && typeof hlsInstance.destroy === 'function') {
        hlsInstance.destroy();
      }
    });
  }

  ready(function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(attachPlayer);
  });
})();
