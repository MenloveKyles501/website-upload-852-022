(() => {
  const toggle = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      mobileNav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', mobileNav.classList.contains('is-open') ? 'true' : 'false');
    });
  }

  const searchPage = document.querySelector('[data-search-page]');

  if (searchPage) {
    const input = document.querySelector('[data-search-input]');
    const category = document.querySelector('[data-filter-category]');
    const region = document.querySelector('[data-filter-region]');
    const year = document.querySelector('[data-filter-year]');
    const cards = Array.from(document.querySelectorAll('[data-movie-card]'));
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q') || '';

    if (input) {
      input.value = initialQuery;
    }

    const normalize = (value) => (value || '').toString().trim().toLowerCase();

    const applyFilters = () => {
      const query = normalize(input && input.value);
      const categoryValue = normalize(category && category.value);
      const regionValue = normalize(region && region.value);
      const yearValue = normalize(year && year.value);

      cards.forEach((card) => {
        const haystack = normalize(card.dataset.title + ' ' + card.dataset.keywords + ' ' + card.dataset.genre);
        const matchesQuery = !query || haystack.includes(query);
        const matchesCategory = !categoryValue || normalize(card.dataset.category) === categoryValue;
        const matchesRegion = !regionValue || normalize(card.dataset.region).includes(regionValue);
        const matchesYear = !yearValue || normalize(card.dataset.year) === yearValue;
        card.hidden = !(matchesQuery && matchesCategory && matchesRegion && matchesYear);
      });
    };

    [input, category, region, year].forEach((control) => {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  }
})();
