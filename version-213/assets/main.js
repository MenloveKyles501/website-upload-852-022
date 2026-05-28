
(function () {
  var qs = function (selector, root) {
    return (root || document).querySelector(selector);
  };

  var qsa = function (selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  };

  function setupMenu() {
    var toggle = qs('.menu-toggle');
    var panel = qs('.mobile-panel');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function setupHero() {
    var slides = qsa('[data-hero-slide]');
    if (!slides.length) {
      return;
    }
    var dots = qsa('[data-hero-dot]');
    var prev = qs('.hero-prev');
    var next = qs('.hero-next');
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    start();
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupFilters() {
    qsa('.filter-bar').forEach(function (bar) {
      var input = qs('.local-filter-input', bar);
      var chips = qsa('.filter-chip', bar);
      var grid = bar.nextElementSibling;
      var cards = grid ? qsa('.movie-card', grid) : [];
      var active = 'all';

      function apply() {
        var text = normalize(input ? input.value : '');
        cards.forEach(function (card) {
          var title = normalize(card.dataset.title);
          var region = normalize(card.dataset.region);
          var genre = normalize(card.dataset.genre);
          var year = normalize(card.dataset.year);
          var matchText = !text || title.indexOf(text) > -1 || region.indexOf(text) > -1 || genre.indexOf(text) > -1;
          var matchYear = active === 'all' || year === normalize(active);
          card.classList.toggle('hidden-by-filter', !(matchText && matchYear));
        });
      }

      if (input) {
        input.addEventListener('input', apply);
      }

      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          chips.forEach(function (item) {
            item.classList.remove('active');
          });
          chip.classList.add('active');
          active = chip.dataset.filterValue || 'all';
          apply();
        });
      });
    });
  }

  function setupSearchPage() {
    var input = qs('#siteSearchInput');
    var category = qs('#categorySelect');
    var year = qs('#yearSelect');
    if (!input || !category || !year) {
      return;
    }
    var cards = qsa('.movie-card');
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    input.value = query;

    function apply() {
      var text = normalize(input.value);
      var catValue = normalize(category.value);
      var yearValue = normalize(year.value);
      cards.forEach(function (card) {
        var haystack = normalize([
          card.dataset.title,
          card.dataset.region,
          card.dataset.genre,
          card.dataset.category,
          card.dataset.year
        ].join(' '));
        var matchText = !text || haystack.indexOf(text) > -1;
        var matchCat = catValue === 'all' || normalize(card.dataset.category) === catValue;
        var matchYear = yearValue === 'all' || normalize(card.dataset.year) === yearValue;
        card.classList.toggle('hidden-by-filter', !(matchText && matchCat && matchYear));
      });
    }

    input.addEventListener('input', apply);
    category.addEventListener('change', apply);
    year.addEventListener('change', apply);
    apply();
  }

  function setupPlayers() {
    qsa('.video-shell').forEach(function (shell) {
      var video = qs('video', shell);
      var cover = qs('.player-cover', shell);
      var source = shell.getAttribute('data-stream');
      var loaded = false;
      var hlsInstance = null;

      if (!video || !cover || !source) {
        return;
      }

      function loadVideo() {
        if (loaded) {
          return;
        }
        loaded = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else if (typeof Hls !== 'undefined' && Hls.isSupported()) {
          hlsInstance = new Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
          hlsInstance.on(Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              shell.classList.add('has-error');
            }
          });
        } else {
          video.src = source;
        }
      }

      function playVideo() {
        loadVideo();
        shell.classList.add('is-playing');
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {
            shell.classList.remove('is-playing');
          });
        }
      }

      cover.addEventListener('click', playVideo);
      video.addEventListener('click', function () {
        if (video.paused) {
          playVideo();
        } else {
          video.pause();
        }
      });
      video.addEventListener('play', function () {
        shell.classList.add('is-playing');
      });
      video.addEventListener('pause', function () {
        shell.classList.remove('is-playing');
      });
      video.addEventListener('error', function () {
        shell.classList.add('has-error');
      });
      window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupSearchPage();
    setupPlayers();
  });
})();
