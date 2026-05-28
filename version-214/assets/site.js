(function () {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-main-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-filter-area]').forEach(function (area) {
    const input = area.querySelector('[data-search-input]');
    const selects = Array.from(area.querySelectorAll('[data-filter-select]'));
    const cards = Array.from(area.querySelectorAll('.movie-card'));

    const normalize = function (value) {
      return String(value || '').toLowerCase().trim();
    };

    const update = function () {
      const query = normalize(input ? input.value : '');
      const activeFilters = selects.map(function (select) {
        return {
          key: select.getAttribute('data-filter-key'),
          value: normalize(select.value)
        };
      }).filter(function (item) {
        return item.key && item.value;
      });

      cards.forEach(function (card) {
        const text = normalize(card.getAttribute('data-search'));
        const queryMatch = !query || text.includes(query);
        const filterMatch = activeFilters.every(function (item) {
          return normalize(card.getAttribute('data-' + item.key)) === item.value;
        });
        card.hidden = !(queryMatch && filterMatch);
      });
    };

    if (input) {
      input.addEventListener('input', update);
    }
    selects.forEach(function (select) {
      select.addEventListener('change', update);
    });
    update();
  });

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let index = 0;
    let timer = null;

    if (!slides.length) {
      return;
    }

    const show = function (nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    };

    const start = function () {
      clearInterval(timer);
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    };

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });
    show(0);
    start();
  });
})();
