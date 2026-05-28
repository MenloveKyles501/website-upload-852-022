(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll(".video-player"));

    players.forEach(function (player) {
      var video = player.querySelector("video");
      var button = player.querySelector(".video-start");
      var message = player.querySelector(".video-message");
      var stream = player.getAttribute("data-stream");
      var loaded = false;
      var hls = null;

      function setMessage(text) {
        if (message) {
          message.textContent = text || "";
        }
      }

      function loadVideo() {
        if (!video || !stream || loaded) {
          return;
        }

        loaded = true;
        setMessage("正在加载视频…");

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            maxBufferLength: 30
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            setMessage("");
          });
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              setMessage("视频加载失败，请稍后重试");
            }
          });
          return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
          setMessage("");
          return;
        }

        video.src = stream;
      }

      function playVideo() {
        loadVideo();
        if (!video) {
          return;
        }
        var promise = video.play();
        if (promise && typeof promise.then === "function") {
          promise.then(function () {
            video.controls = true;
            player.classList.add("playing");
            setMessage("");
          }).catch(function () {
            setMessage("点击画面继续播放");
          });
        } else {
          video.controls = true;
          player.classList.add("playing");
        }
      }

      if (button) {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          playVideo();
        });
      }

      if (video) {
        video.addEventListener("click", function () {
          if (video.paused) {
            playVideo();
          } else {
            video.pause();
          }
        });
        video.addEventListener("pause", function () {
          player.classList.remove("playing");
        });
        video.addEventListener("play", function () {
          player.classList.add("playing");
        });
      }

      window.addEventListener("pagehide", function () {
        if (hls) {
          hls.destroy();
          hls = null;
        }
      });
    });
  });
})();
