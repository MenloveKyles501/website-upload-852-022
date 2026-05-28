(function() {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function() {
    var navToggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-site-nav]");

    if (navToggle && nav) {
      navToggle.addEventListener("click", function() {
        nav.classList.toggle("is-open");
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function(slide, i) {
          slide.classList.toggle("is-active", i === current);
        });
        dots.forEach(function(dot, i) {
          dot.classList.toggle("is-active", i === current);
        });
      }

      function go(step) {
        show(current + step);
      }

      function start() {
        stop();
        timer = window.setInterval(function() {
          go(1);
        }, 5000);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      if (prev) {
        prev.addEventListener("click", function() {
          go(-1);
          start();
        });
      }

      if (next) {
        next.addEventListener("click", function() {
          go(1);
          start();
        });
      }

      dots.forEach(function(dot, index) {
        dot.addEventListener("click", function() {
          show(index);
          start();
        });
      });

      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
      show(0);
      start();
    }

    var filterForm = document.querySelector("[data-filter-form]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    var count = document.querySelector("[data-filter-count]");
    var empty = document.querySelector("[data-empty-state]");

    if (filterForm && cards.length) {
      var input = filterForm.querySelector("[data-search-input]");
      var typeSelect = filterForm.querySelector('[data-filter-select="type"]');
      var regionSelect = filterForm.querySelector('[data-filter-select="region"]');
      var yearSelect = filterForm.querySelector('[data-filter-select="year"]');
      var params = new URLSearchParams(window.location.search);
      var q = params.get("q");

      if (q && input && !input.value) {
        input.value = q;
      }

      function applyFilters() {
        var keyword = input ? input.value.trim().toLowerCase() : "";
        var type = typeSelect ? typeSelect.value : "";
        var region = regionSelect ? regionSelect.value : "";
        var year = yearSelect ? yearSelect.value : "";
        var visible = 0;

        cards.forEach(function(card) {
          var text = (card.getAttribute("data-search") || "").toLowerCase();
          var cardType = card.getAttribute("data-type") || "";
          var cardRegion = card.getAttribute("data-region") || "";
          var cardYear = card.getAttribute("data-year") || "";
          var matched = true;

          if (keyword && text.indexOf(keyword) === -1) {
            matched = false;
          }

          if (type && cardType !== type) {
            matched = false;
          }

          if (region && cardRegion !== region) {
            matched = false;
          }

          if (year && cardYear !== year) {
            matched = false;
          }

          card.style.display = matched ? "" : "none";

          if (matched) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = "当前显示 " + visible + " 部影片";
        }

        if (empty) {
          empty.style.display = visible ? "none" : "block";
        }
      }

      [input, typeSelect, regionSelect, yearSelect].forEach(function(el) {
        if (!el) {
          return;
        }
        el.addEventListener("input", applyFilters);
        el.addEventListener("change", applyFilters);
      });

      applyFilters();
    }
  });
})();
