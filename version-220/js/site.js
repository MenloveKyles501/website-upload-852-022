(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var menuToggle = document.querySelector("[data-menu-toggle]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");

    if (menuToggle && mobilePanel) {
      menuToggle.addEventListener("click", function () {
        mobilePanel.classList.toggle("open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var prev = document.querySelector("[data-hero-prev]");
    var next = document.querySelector("[data-hero-next]");
    var activeIndex = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === activeIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
      });
    }

    function startTimer() {
      if (timer) {
        window.clearInterval(timer);
      }
      if (slides.length > 1) {
        timer = window.setInterval(function () {
          showSlide(activeIndex + 1);
        }, 5200);
      }
    }

    if (slides.length) {
      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
          startTimer();
        });
      });
      if (prev) {
        prev.addEventListener("click", function () {
          showSlide(activeIndex - 1);
          startTimer();
        });
      }
      if (next) {
        next.addEventListener("click", function () {
          showSlide(activeIndex + 1);
          startTimer();
        });
      }
      startTimer();
    }

    var searchInput = document.querySelector(".card-search");
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
    var activeFilter = "all";

    function cardText(card) {
      return [
        card.getAttribute("data-title"),
        card.getAttribute("data-region"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-year"),
        card.getAttribute("data-type")
      ].join(" ").toLowerCase();
    }

    function applyFilters() {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
      var filterTerms = activeFilter === "all" ? [] : activeFilter.toLowerCase().split(/\s+/).filter(Boolean);

      cards.forEach(function (card) {
        var text = cardText(card);
        var matchesQuery = !query || text.indexOf(query) !== -1;
        var matchesFilter = !filterTerms.length || filterTerms.some(function (term) {
          return text.indexOf(term) !== -1;
        });
        card.classList.toggle("is-hidden", !(matchesQuery && matchesFilter));
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        filterButtons.forEach(function (item) {
          item.classList.remove("active");
        });
        button.classList.add("active");
        activeFilter = button.getAttribute("data-filter") || "all";
        applyFilters();
      });
    });
  });
})();
