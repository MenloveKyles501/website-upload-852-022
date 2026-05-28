(function() {
  function initMoviePlayer(sourceUrl) {
    var player = document.querySelector("[data-player]");
    var video = document.getElementById("movie-player");
    var overlay = document.querySelector("[data-play-overlay]");
    var playButton = document.querySelector("[data-play-button]");
    var message = document.querySelector("[data-player-message]");
    var started = false;
    var hls = null;

    if (!player || !video || !overlay || !sourceUrl) {
      return;
    }

    function setMessage(text) {
      if (message) {
        message.textContent = text || "";
      }
    }

    function playVideo() {
      var result = video.play();

      if (result && typeof result.catch === "function") {
        result.catch(function() {
          setMessage("请再次点击播放");
        });
      }
    }

    function attachSource() {
      if (started) {
        playVideo();
        return;
      }

      started = true;
      overlay.classList.add("is-hidden");
      setMessage("");

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = sourceUrl;
        video.addEventListener("loadedmetadata", playVideo, { once: true });
        video.load();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });

        hls.loadSource(sourceUrl);
        hls.attachMedia(video);

        hls.on(window.Hls.Events.MANIFEST_PARSED, function() {
          playVideo();
        });

        hls.on(window.Hls.Events.ERROR, function(event, data) {
          if (!data || !data.fatal) {
            return;
          }

          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            setMessage("网络连接异常，正在重试");
            hls.startLoad();
            return;
          }

          if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            setMessage("播放恢复中");
            hls.recoverMediaError();
            return;
          }

          setMessage("当前浏览器暂时无法播放");
          hls.destroy();
        });

        return;
      }

      video.src = sourceUrl;
      video.addEventListener("loadedmetadata", playVideo, { once: true });
      video.load();
    }

    overlay.addEventListener("click", attachSource);

    if (playButton) {
      playButton.addEventListener("click", function(event) {
        event.stopPropagation();
        attachSource();
      });
    }

    video.addEventListener("click", function() {
      if (!started) {
        attachSource();
      }
    });

    window.addEventListener("beforeunload", function() {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();
