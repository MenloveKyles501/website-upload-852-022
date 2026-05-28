(function () {
  var toggle = document.querySelector('[data-mobile-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var forms = document.querySelectorAll('[data-search-form]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var input = form.querySelector('input[name="q"]');
      if (!input || !input.value.trim()) {
        event.preventDefault();
        return;
      }
    });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var activeIndex = 0;

  function setHero(index) {
    if (!slides.length) {
      return;
    }

    activeIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === activeIndex);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === activeIndex);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      setHero(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      setHero(activeIndex + 1);
    }, 5200);
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-search-item]'));
  var empty = document.querySelector('[data-empty-state]');
  var mainSearchInput = document.querySelector('[data-search-input-main]');

  function filterCards(value) {
    var term = (value || '').trim().toLowerCase();
    var visible = 0;

    items.forEach(function (item) {
      var text = (item.getAttribute('data-search-text') || item.textContent || '').toLowerCase();
      var matched = !term || text.indexOf(term) !== -1;
      item.hidden = !matched;
      if (matched) {
        visible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle('is-visible', visible === 0);
    }
  }

  if (filterInput) {
    filterInput.addEventListener('input', function () {
      filterCards(filterInput.value);
    });
  }

  if (mainSearchInput) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    mainSearchInput.value = query;
    filterCards(query);
    mainSearchInput.addEventListener('input', function () {
      filterCards(mainSearchInput.value);
    });
  }
})();
