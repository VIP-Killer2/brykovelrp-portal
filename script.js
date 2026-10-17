(function () {
  var P = window.PORTAL || {};
  var L = P.links || {};

  // ---- Кнопки з посиланнями ----
  function setLink(id, url, offText) {
    var el = document.getElementById(id);
    if (!el) return;
    if (url) { el.href = url; return; }
    if (offText) { el.textContent = offText; el.classList.add('is-off'); el.removeAttribute('href'); el.setAttribute('aria-disabled', 'true'); }
    else { el.hidden = true; }
  }
  setLink('btn-roblox', L.roblox);
  setLink('btn-telegram', L.telegram);
  setLink('btn-discord', L.discord);          // немає Discord = кнопка прихована
  setLink('btn-rules', L.rules, 'Правила скоро');

  // ---- Фракції ----
  var grid = document.getElementById('factionGrid');
  (P.factions || []).forEach(function (f, i) {
    var card = document.createElement('article');
    card.className = 'card';
    var btn = f.apply
      ? '<a class="btn btn-primary btn-small" href="' + f.apply + '">Подати анкету</a>'
      : '<span class="btn btn-ghost btn-small is-off">Анкета скоро</span>';
    card.innerHTML =
      '<div class="card-icon" aria-hidden="true">' + f.icon + '</div>' +
      '<h3>' + f.name + '</h3>' +
      '<p class="full">' + f.full + '</p>' +
      '<p class="text">' + f.text + '</p>' + btn;
    grid.appendChild(card);
  });

  // ---- Команда ----
  var team = document.getElementById('teamList');
  (P.team || []).forEach(function (t, i) {
    var row = document.createElement('div');
    row.className = 'row' + (i < 2 ? ' top' : '');
    var list = (t.people || []).map(function (u) {
      var name = String(u).replace(/^@/, '').replace(/[<>"']/g, '');
      return '<a class="chip" href="https://t.me/' + encodeURIComponent(name) + '" target="_blank" rel="noopener">@' + name + '</a>';
    });
    var empty = Math.max((t.slots || 1) - list.length, list.length ? 0 : 1);
    for (var k = 0; k < empty; k++) list.push('<span class="chip empty">@юзернейм</span>');
    var people = list.join('');
    row.innerHTML = '<div class="role">' + t.role + '</div><div class="people">' + people + '</div>';
    team.appendChild(row);
  });

  // ---- Новини (найсвіжіша зверху) ----
  var newsBox = document.getElementById('newsList');
  var news = (P.news || []).slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
  function fmtDate(d) {
    var m = String(d).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return m ? m[3] + '.' + m[2] + '.' + m[1] : d;
  }
  function esc(t) { return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  if (!news.length) {
    newsBox.innerHTML = '<div class="empty-box">Новин поки немає. Перша з\'явиться тут.</div>';
  } else {
    news.forEach(function (n, i) {
      var a = document.createElement('article');
      a.className = 'news-item' + (i === 0 ? ' newest' : '');
      a.innerHTML = '<div class="news-meta">' + (i === 0 ? '<span class="badge">Нове</span>' : '') +
        '<time>' + esc(fmtDate(n.date)) + '</time></div><h3>' + esc(n.title) + '</h3><p>' + esc(n.text) + '</p>';
      newsBox.appendChild(a);
    });
  }

  // ---- Зірки ----
  var stars = document.getElementById('stars');
  if (stars) {
    for (var i = 0; i < 70; i++) {
      var s = document.createElement('i');
      s.className = 'star';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 70 + '%';
      s.style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
      s.style.animationDuration = (2.5 + Math.random() * 3).toFixed(2) + 's';
      stars.appendChild(s);
    }
  }

  // ---- Меню на телефоні ----
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  // ---- Розділи: один за раз ----
  var views = document.querySelectorAll('.view');
  var navLinks = document.querySelectorAll('[data-nav]');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(name) {
    var found = false;
    views.forEach(function (v) { if (v.dataset.view === name) found = true; });
    if (!found) name = 'home';
    views.forEach(function (v) {
      var on = v.dataset.view === name;
      v.classList.toggle('active', on);
      if (on) {
        var items = v.querySelectorAll('.reveal, .card, .row, .news-item');
        items.forEach(function (el) { el.classList.remove('in'); });
        void v.offsetWidth;
        items.forEach(function (el, i) {
          setTimeout(function () { el.classList.add('in'); }, reduce ? 0 : 80 + i * 60);
        });
      }
    });
    navLinks.forEach(function (a) { a.classList.toggle('current', a.dataset.nav === name); });
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = name === 'home' ? 'Буковель РП' : (document.querySelector('[data-nav="' + name + '"]').textContent + ' | Буковель РП');
  }

  function route() { show((location.hash || '#home').replace('#', '')); }
  window.addEventListener('hashchange', route);
  route();
})();
