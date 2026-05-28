(function () {
  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#039;"
      }[char];
    });
  }

  function card(movie) {
    return [
      "<article class=\"movie-card\" data-card data-title=\"" + escapeHtml(movie.title) + "\" data-region=\"" + escapeHtml(movie.region) + "\" data-genre=\"" + escapeHtml(movie.genre) + "\" data-year=\"" + escapeHtml(movie.year) + "\" data-type=\"" + escapeHtml(movie.type) + "\">",
      "  <a class=\"poster-link\" href=\"" + escapeHtml(movie.url) + "\" aria-label=\"" + escapeHtml(movie.title) + "\">",
      "    <img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">",
      "    <span class=\"play-badge\">▶</span>",
      "  </a>",
      "  <div class=\"card-body\">",
      "    <div class=\"card-meta\"><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.year) + "</span><span>" + escapeHtml(movie.type) + "</span></div>",
      "    <h3><a href=\"" + escapeHtml(movie.url) + "\">" + escapeHtml(movie.title) + "</a></h3>",
      "    <p>" + escapeHtml(movie.oneLine) + "</p>",
      "    <div class=\"tag-line\">" + escapeHtml(movie.genre) + "</div>",
      "  </div>",
      "</article>"
    ].join("\n");
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  var params = new URLSearchParams(window.location.search);
  var query = normalize(params.get("q"));
  var input = document.getElementById("searchPageInput");
  var title = document.getElementById("searchTitle");
  var results = document.getElementById("searchResults");
  var movies = window.SEARCH_MOVIES || [];

  if (input && query) {
    input.value = params.get("q") || "";
  }

  if (!results) {
    return;
  }

  if (!query) {
    return;
  }

  var matched = movies.filter(function (movie) {
    return [
      movie.title,
      movie.region,
      movie.type,
      movie.year,
      movie.genre,
      movie.tags,
      movie.oneLine
    ].join(" ").toLowerCase().indexOf(query) !== -1;
  }).slice(0, 120);

  if (title) {
    title.textContent = "“" + (params.get("q") || "") + "” 的搜索结果";
  }

  results.innerHTML = matched.length ? matched.map(card).join("\n") : "<p class=\"empty-state\">没有找到匹配影片，换个关键词试试。</p>";
})();
