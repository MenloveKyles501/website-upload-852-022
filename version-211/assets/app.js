(function () {
  const toggle = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let index = 0;
    let timer = null;

    const show = function (nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    };

    const play = function () {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    };

    const reset = function () {
      if (timer) {
        window.clearInterval(timer);
      }
      play();
    };

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        reset();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        reset();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const dotIndex = Number(dot.getAttribute('data-hero-dot')) || 0;
        show(dotIndex);
        reset();
      });
    });

    show(0);
    play();
  }

  const searchInput = document.querySelector('[data-page-search]');
  const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
  const cards = Array.from(document.querySelectorAll('[data-search-card]'));
  const emptyState = document.querySelector('[data-empty-state]');
  let currentFilter = 'all';

  const params = new URLSearchParams(window.location.search);
  const queryFromUrl = params.get('q');

  if (searchInput && queryFromUrl) {
    searchInput.value = queryFromUrl;
  }

  const normalize = function (value) {
    return String(value || '').trim().toLowerCase();
  };

  const applyFilter = function () {
    const query = normalize(searchInput ? searchInput.value : '');
    let visible = 0;

    cards.forEach(function (card) {
      const category = card.getAttribute('data-category') || '';
      const text = normalize(card.getAttribute('data-tags'));
      const matchCategory = currentFilter === 'all' || category === currentFilter;
      const matchText = !query || text.indexOf(query) !== -1;
      const showCard = matchCategory && matchText;

      card.style.display = showCard ? '' : 'none';

      if (showCard) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('show', visible === 0);
    }
  };

  if (searchInput && cards.length) {
    searchInput.addEventListener('input', applyFilter);
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      currentFilter = button.getAttribute('data-filter') || 'all';

      filterButtons.forEach(function (item) {
        item.classList.toggle('active', item === button);
      });

      applyFilter();
    });
  });

  if (cards.length) {
    applyFilter();
  }
})();
