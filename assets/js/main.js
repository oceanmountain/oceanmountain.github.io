(function () {
  "use strict";

  // Mobile nav
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Code tabs: group the code blocks inside .code-tabs by language
  var labels = { bash: "cURL", shell: "cURL", http: "HTTP", js: "JavaScript", javascript: "JavaScript", python: "Python", csharp: "C#", json: "JSON", xml: "XML" };
  document.querySelectorAll(".code-tabs").forEach(function (group) {
    var blocks = group.querySelectorAll(":scope > div.highlighter-rouge");
    if (blocks.length < 2) return;
    var list = document.createElement("div");
    list.className = "tab-list";
    list.setAttribute("role", "tablist");
    blocks.forEach(function (block, i) {
      var lang = (block.className.match(/language-([\w+-]+)/) || [])[1] || "code";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("role", "tab");
      btn.textContent = labels[lang] || lang;
      btn.setAttribute("aria-selected", String(i === 0));
      block.hidden = i !== 0;
      btn.addEventListener("click", function () {
        list.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-selected", "false"); });
        blocks.forEach(function (b) { b.hidden = true; });
        btn.setAttribute("aria-selected", "true");
        block.hidden = false;
      });
      list.appendChild(btn);
    });
    group.insertBefore(list, group.firstChild);
  });

  // Copy buttons
  document.querySelectorAll(".prose div.highlighter-rouge").forEach(function (block) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    btn.addEventListener("click", function () {
      var code = block.querySelector("code");
      if (!code || !navigator.clipboard) return;
      navigator.clipboard.writeText(code.innerText).then(function () {
        btn.textContent = "Copied!";
        setTimeout(function () { btn.textContent = "Copy"; }, 1500);
      });
    });
    block.appendChild(btn);
  });

  // "On this page" table of contents
  var toc = document.getElementById("toc");
  var headings = document.querySelectorAll(".prose h2[id], .prose h3[id]");
  if (toc && headings.length) {
    headings.forEach(function (h) {
      var li = document.createElement("li");
      if (h.tagName === "H3") li.className = "sub";
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      toc.appendChild(li);
    });
    if ("IntersectionObserver" in window) {
      var links = toc.querySelectorAll("a");
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            links.forEach(function (l) { l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id); });
          }
        });
      }, { rootMargin: "-80px 0px -70% 0px" });
      headings.forEach(function (h) { io.observe(h); });
    }
  } else if (toc) {
    toc.closest(".doc-toc").hidden = true;
  }

  // Client-side search
  var input = document.getElementById("search-input");
  var results = document.getElementById("search-results");
  var index = null;

  function load() {
    if (index) return Promise.resolve(index);
    return fetch(window.SEARCH_INDEX_URL).then(function (r) { return r.json(); }).then(function (d) { index = d; return d; });
  }

  function render(items) {
    results.innerHTML = "";
    if (!items.length) {
      var empty = document.createElement("li");
      empty.style.padding = "10px 12px";
      empty.textContent = "No results";
      results.appendChild(empty);
    }
    items.forEach(function (item) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = item.url;
      var t = document.createElement("strong");
      t.textContent = item.title;
      var s = document.createElement("small");
      s.textContent = item.excerpt;
      a.appendChild(t);
      a.appendChild(s);
      li.appendChild(a);
      results.appendChild(li);
    });
    results.hidden = false;
  }

  if (input && results) {
    input.addEventListener("input", function () {
      var terms = input.value.toLowerCase().split(/\s+/).filter(Boolean);
      if (!terms.length) { results.hidden = true; return; }
      load().then(function (docs) {
        var scored = docs.map(function (d) {
          var title = d.title.toLowerCase();
          var body = d.content.toLowerCase();
          var score = 0;
          for (var i = 0; i < terms.length; i++) {
            var inTitle = title.indexOf(terms[i]) !== -1;
            var inBody = body.indexOf(terms[i]) !== -1;
            if (!inTitle && !inBody) return null;
            score += (inTitle ? 10 : 0) + (inBody ? 1 : 0);
          }
          return { d: d, score: score };
        }).filter(Boolean).sort(function (a, b) { return b.score - a.score; }).slice(0, 8);
        render(scored.map(function (s) { return s.d; }));
      });
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".search")) results.hidden = true;
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement !== input && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
        e.preventDefault();
        input.focus();
      }
      if (e.key === "Escape") results.hidden = true;
    });
  }
})();
