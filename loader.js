(function () {
  var SCRIPT = document.currentScript;
  var PAGE_KEY = SCRIPT ? SCRIPT.getAttribute('data-jmed-page') : null;
  var CONTAINER_ID = (SCRIPT && SCRIPT.getAttribute('data-jmed-target')) || 'jmed-promos';
  var DATA_URL = SCRIPT ? new URL('promos.json', SCRIPT.src).href : 'promos.json';
  var STYLE_ID = 'jmed-promo-styles';

  function scopeCss(css, scope) {
    var out = '', i = 0;
    while (i < css.length) {
      var open = css.indexOf('{', i);
      if (open < 0) break;
      var sel = css.slice(i, open).trim();
      if (sel.charAt(0) === '@') {
        var depth = 1, j = open + 1;
        while (j < css.length && depth) {
          var ch = css.charAt(j);
          if (ch === '{') depth++; else if (ch === '}') depth--;
          j++;
        }
        out += sel + '{' + scopeCss(css.slice(open + 1, j - 1), scope) + '}';
        i = j;
      } else {
        var close = css.indexOf('}', open);
        var scoped = sel.split(',').map(function (s) {
          s = s.trim();
          return (s.indexOf(':root') === 0 || s.indexOf('.jp-lb') === 0) ? s : scope + ' ' + s;
        }).join(',');
        out += scoped + '{' + css.slice(open + 1, close) + '}';
        i = close + 1;
      }
    }
    return out;
  }

  function injectStyles() {
    var sid = STYLE_ID + '-' + CONTAINER_ID;
    if (document.getElementById(sid)) return;
    var css = ''
      + ':root{--jp-gold:#B8934A;--jp-ink:#1A1410;--jp-muted:#8A8078;--jp-line:#DDD8D0;--jp-alt:#F6F4F4;--jp-old:#B0A89E}'
      + '.jp-wrap{font-family:\'Helvetica Neue\',Arial,sans-serif}'
      + '.jp-head{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px 24px;margin-bottom:20px}'
      + '.jp-head .jp-until{margin:0}'
      + '.jp-allbtn{display:inline-flex;align-items:center;gap:12px;background:var(--jp-ink);color:#FDFAF5!important;font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;text-decoration:none!important;padding:15px 26px;border:1px solid var(--jp-ink);transition:background .2s,border-color .2s,color .2s,gap .2s}'
      + '.jp-allbtn span{color:var(--jp-gold);font-size:15px;transition:color .2s}'
      + '.jp-allbtn:hover{background:var(--jp-gold);border-color:var(--jp-gold);color:var(--jp-ink)!important;gap:18px}'
      + '.jp-allbtn:hover span{color:var(--jp-ink)}'
      + '@media(max-width:768px){.jp-allbtn{width:100%;justify-content:center;box-sizing:border-box}}'
      + '.jp-until{font-size:12px;font-weight:500;letter-spacing:.04em;color:var(--jp-gold);margin-bottom:20px}'
      + '.jp-until a{color:var(--jp-gold);border-bottom:1px solid var(--jp-gold);padding-bottom:1px;text-decoration:none}'
      + '.jp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--jp-line);border:1px solid var(--jp-line)}'
      + '@media(max-width:768px){.jp-grid{grid-template-columns:1fr}}'
      + '.jp-card{background:#fff;padding:32px 28px;position:relative;display:flex;flex-direction:column;text-decoration:none!important}'
      + '.jp-card::before{content:\'\';position:absolute;top:0;left:0;width:100%;height:2px;background:var(--jp-gold);transform:scaleX(0);transform-origin:left;transition:transform .4s cubic-bezier(.16,1,.3,1)}'
      + '.jp-card:hover::before{transform:scaleX(1)}'
      + '.jp-badge{font-size:10px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--jp-gold);margin-bottom:14px}'
      + '.jp-title{font-family:Georgia,serif;font-size:22px;font-weight:300;line-height:1.2;color:var(--jp-ink);margin-bottom:16px}'
      + '.jp-price{display:flex;align-items:baseline;flex-wrap:wrap;gap:10px;margin-bottom:10px}'
      + '.jp-price-new{font-family:Georgia,serif;font-size:30px;font-weight:300;color:var(--jp-gold);line-height:1}'
      + '.jp-price-old{font-size:15px;color:var(--jp-old);text-decoration:line-through}'
      + '.jp-note{font-size:13px;color:var(--jp-muted);line-height:1.6;margin-bottom:20px;font-weight:300}'
      + '.jp-link{margin-top:auto;font-size:11px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--jp-ink)!important;display:inline-flex;align-items:center;gap:8px;align-self:flex-start;border-bottom:1px solid var(--jp-gold);padding-bottom:4px;transition:gap .2s}'
      + '.jp-card:hover .jp-link{gap:14px;color:var(--jp-gold)!important}'
      + '.jp-seeall{background:var(--jp-alt);border:1px dashed rgba(184,147,74,.4);align-items:center;justify-content:center;text-align:center;gap:14px;transition:background .2s,border-color .2s}'
      + '.jp-seeall:hover{background:rgba(184,147,74,.06);border-color:var(--jp-gold)}'
      + '.jp-seeall-arrow{font-family:Georgia,serif;font-size:32px;font-weight:300;color:var(--jp-gold);line-height:1;transition:transform .25s}'
      + '.jp-seeall:hover .jp-seeall-arrow{transform:translateX(6px)}'
      + '.jp-seeall-text{font-size:14px;font-weight:500;color:var(--jp-ink);line-height:1.4}'
      + '.jp-full-list{display:flex;flex-direction:column;gap:1px;background:var(--jp-line);border:1px solid var(--jp-line);margin-top:24px}'
      + '.jp-full-item{background:#fff;padding:32px}'
      + '.jp-full-desc{font-size:14px;color:var(--jp-muted);line-height:1.7;margin:14px 0}'
      + '.jp-full-terms{margin:0 0 20px;padding-left:18px;font-size:13px;color:var(--jp-muted);line-height:1.8}'
      + '.jp-full-cta{display:inline-block;font-size:11px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--jp-ink)!important;text-decoration:none!important;border-bottom:1px solid var(--jp-gold);padding-bottom:4px}'
      + '.jp-bn{position:relative}'
      + '.jp-bn-track{display:flex;gap:1px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;background:var(--jp-line);border:1px solid var(--jp-line);scroll-behavior:smooth}'
      + '.jp-bn-track::-webkit-scrollbar{display:none}'
      + '.jp-bn-card{flex:0 0 280px;scroll-snap-align:start;overflow:hidden;background:#fff;cursor:zoom-in}'
      + '.jp-bn-card img{width:100%;height:360px;object-fit:cover;display:block;transition:transform .4s}'
      + '.jp-bn-card:hover img{transform:scale(1.03)}'
      + '.jp-bn-btn{position:absolute;top:50%;width:40px;height:40px;background:rgba(255,255,255,.92);border:1px solid var(--jp-line);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:5;transition:all .2s;transform:translateY(-50%);padding:0}'
      + '.jp-bn-btn:hover{border-color:var(--jp-gold);background:#fff;box-shadow:0 4px 12px rgba(0,0,0,.08)}'
      + '.jp-bn-btn svg{width:16px;height:16px;stroke:var(--jp-ink);stroke-width:2;fill:none}'
      + '.jp-bn-prev{left:-16px}.jp-bn-next{right:-16px}'
      + '.jp-lb{position:fixed;inset:0;background:rgba(26,20,16,.94);display:none;align-items:center;justify-content:center;z-index:99999;padding:70px 80px}'
      + '.jp-lb.open{display:flex}'
      + '.jp-lb img{max-width:100%;max-height:82vh;display:block;box-shadow:0 20px 60px rgba(0,0,0,.5)}'
      + '.jp-lb-close{position:absolute;top:24px;right:28px;width:44px;height:44px;background:transparent;border:1px solid rgba(255,255,255,.3);color:#fff;font-size:20px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:border-color .2s;z-index:3;padding:0}'
      + '.jp-lb-close:hover,.jp-lb-nav:hover{border-color:var(--jp-gold)}'
      + '.jp-lb-nav{position:absolute;top:50%;transform:translateY(-50%);width:44px;height:44px;background:transparent;border:1px solid rgba(255,255,255,.3);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:border-color .2s;z-index:3;padding:0}'
      + '.jp-lb-nav svg{width:18px;height:18px;stroke:#fff;stroke-width:2;fill:none}'
      + '.jp-lb-prev{left:24px}.jp-lb-next{right:24px}'
      + '.jp-lb-count{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,.6);font-size:11px;letter-spacing:.24em}'
      + '@media(max-width:768px){.jp-bn-card{flex:0 0 220px}.jp-bn-card img{height:280px}.jp-bn-prev{left:8px}.jp-bn-next{right:8px}.jp-lb{padding:56px 8px}.jp-lb img{max-height:74vh}.jp-lb-nav{width:38px;height:38px}.jp-lb-prev{left:10px}.jp-lb-next{right:10px}}'
      + '.jp-slider{position:relative}'
      + '.jp-sl-track{display:flex;gap:1px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch;background:var(--jp-line);border:1px solid var(--jp-line)}'
      + '.jp-sl-track::-webkit-scrollbar{display:none}'
      + '.jp-sl-btn{position:absolute;top:50%;transform:translateY(-50%);z-index:5;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.96);border:1px solid var(--jp-line);color:var(--jp-ink);font-size:26px;line-height:1;padding:0 0 3px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:border-color .2s,box-shadow .2s,opacity .2s}'
      + '.jp-sl-btn:hover:not(:disabled){border-color:var(--jp-gold);box-shadow:0 4px 12px rgba(0,0,0,.1);color:var(--jp-gold)}'
      + '.jp-sl-btn:disabled{opacity:.35;cursor:default}'
      + '.jp-sl-prev{left:-18px}.jp-sl-next{right:-18px}'
      + '.jp-ever-card{flex:0 0 calc(50% - .5px);scroll-snap-align:start;box-sizing:border-box;background:#fff;padding:32px 28px;display:flex;gap:22px;align-items:flex-start}'
      + '.jp-ever-pct{font-family:Georgia,serif;font-size:44px;font-weight:300;line-height:1;color:var(--jp-gold);flex:0 0 auto;min-width:92px}'
      + '.jp-ever-text{font-size:14px;color:var(--jp-muted);line-height:1.65;padding-top:4px}'
      + '@media(max-width:768px){.jp-ever-card{flex:0 0 100%;padding:24px 20px}.jp-ever-pct{font-size:36px;min-width:78px}.jp-sl-prev{left:6px}.jp-sl-next{right:6px}}'
      + '.jp-evergreen{margin-top:40px;padding-top:32px;border-top:1px solid var(--jp-line)}'
      + '.jp-evergreen-title{font-family:Georgia,serif;font-size:20px;font-weight:300;color:var(--jp-ink);margin-bottom:18px}'
      + '.jp-evergreen-row{display:flex;gap:16px;align-items:baseline;padding:10px 0;border-bottom:1px solid var(--jp-line);font-size:14px;color:var(--jp-muted)}'
      + '.jp-evergreen-pct{font-family:Georgia,serif;font-size:22px;color:var(--jp-gold);flex:0 0 auto}';
    var style = document.createElement('style');
    style.id = sid;
    style.textContent = scopeCss(css, '#' + CONTAINER_ID);
    document.head.appendChild(style);
  }

  function el(tag, className, html) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function renderMini(container, data, pageCfg) {
    var wrap = el('div', 'jp-wrap');
    var head = el('div', 'jp-head');
    head.appendChild(el('p', 'jp-until', data.deadlineText));
    head.appendChild(el('a', 'jp-allbtn', 'Все акции и скидки <span>→</span>'));
    head.lastChild.href = 'https://j-med.ru/akcii';
    wrap.appendChild(head);

    var grid = el('div', 'jp-grid');
    var offersById = {};
    data.offers.forEach(function (o) { offersById[o.id] = o; });

    (pageCfg.offerIds || []).forEach(function (id) {
      var o = offersById[id];
      if (!o) return;
      var card = el('a', 'jp-card');
      card.href = 'https://j-med.ru/akcii#' + o.id;
      var priceHtml = '<span class="jp-price-new">' + o.priceNew + '</span>';
      if (o.priceOld) priceHtml += '<span class="jp-price-old">' + o.priceOld + '</span>';
      card.innerHTML = ''
        + '<div class="jp-badge">' + o.badge + '</div>'
        + '<div class="jp-title">' + o.title + '</div>'
        + '<div class="jp-price">' + priceHtml + '</div>'
        + '<div class="jp-note">' + o.note + '</div>'
        + '<span class="jp-link">' + (o.cta || 'Подробнее') + ' →</span>';
      grid.appendChild(card);
    });

    if (pageCfg.seeAllCard) {
      var seeAll = el('a', 'jp-card jp-seeall');
      seeAll.href = 'https://j-med.ru/akcii';
      seeAll.style.display = 'flex';
      seeAll.innerHTML = '<span class="jp-seeall-arrow">→</span><span class="jp-seeall-text">Все акции<br>и скидки</span>';
      grid.appendChild(seeAll);
    }

    wrap.appendChild(grid);
    container.appendChild(wrap);
  }

  function renderFull(container, data, pageCfg) {
    var wrap = el('div', 'jp-wrap');
    if (!pageCfg.hideDeadline) wrap.appendChild(el('p', 'jp-until', data.deadlineText));

    var offersById = {};
    data.offers.forEach(function (o) { offersById[o.id] = o; });

    var list = el('div', 'offer-list');
    (pageCfg.offerIds || []).forEach(function (id) {
      var o = offersById[id];
      if (!o) return;
      var item = el('div', 'offer');
      item.id = o.id;
      var priceHtml = '<span class="offer-new">' + o.priceNew + '</span>';
      if (o.priceOld) priceHtml += '<span class="offer-old">' + o.priceOld + '</span>';
      var termsHtml = (o.terms || []).map(function (t) { return '<li>' + t + '</li>'; }).join('');
      item.innerHTML = ''
        + '<div class="offer-inner">'
        + '<div class="offer-price-col">'
        + '<div class="offer-badge">' + o.badge + '</div>'
        + '<div class="offer-title">' + o.title + '</div>'
        + '<div class="offer-price">' + priceHtml + '</div>'
        + '</div>'
        + '<div class="offer-body">'
        + '<p>' + o.description + '</p>'
        + (termsHtml ? '<ul class="offer-terms">' + termsHtml + '</ul>' : '')
        + '<div class="offer-cta"><a href="#popup:myform" class="btn-sm">' + (o.cta || 'Записаться') + '</a></div>'
        + '</div>'
        + '</div>';
      list.appendChild(item);
    });
    wrap.appendChild(list);

    if (pageCfg.showEvergreen && data.evergreen && data.evergreen.length) {
      var ev = el('div', 'jp-evergreen');
      ev.appendChild(el('div', 'jp-evergreen-title', 'Постоянные акции клиники'));
      data.evergreen.forEach(function (row) {
        var r = el('div', 'jp-evergreen-row');
        r.innerHTML = '<span class="jp-evergreen-pct">' + row.percent + '</span><span>' + row.text + '</span>';
        ev.appendChild(r);
      });
      wrap.appendChild(ev);
    }

    container.appendChild(wrap);
  }

  function fillExtras(data, pageCfg) {
    var offersById = {};
    data.offers.forEach(function (o) { offersById[o.id] = o; });
    Array.prototype.forEach.call(document.querySelectorAll('[data-jmed-deadline]'), function (n) {
      n.textContent = data.deadlineText;
    });
    if (!(pageCfg.offerIds || []).length) return;
    Array.prototype.forEach.call(document.querySelectorAll('[data-jmed-jump]'), function (n) {
      n.innerHTML = '';
      (pageCfg.offerIds || []).forEach(function (id) {
        var o = offersById[id];
        if (!o) return;
        var a = document.createElement('a');
        a.href = '#' + o.id;
        a.textContent = o.title.replace(/[«»]/g, '');
        n.appendChild(a);
        n.appendChild(document.createTextNode(' '));
      });
    });
  }

  function renderPerma(container, data) {
    var grid = el('div', 'perma-grid');
    (data.evergreen || []).forEach(function (row) {
      var c = el('div', 'perma-card');
      c.innerHTML = '<div class="perma-pct">' + row.percent + '</div><p>' + row.text + '</p>';
      grid.appendChild(c);
    });
    container.appendChild(grid);
  }

  function renderEvergreen(container, data) {
    var wrap = el('div', 'jp-wrap');
    var slider = el('div', 'jp-slider');
    var track = el('div', 'jp-sl-track');
    (data.evergreen || []).forEach(function (row) {
      var c = el('div', 'jp-ever-card');
      c.innerHTML = '<span class="jp-ever-pct">' + row.percent + '</span><span class="jp-ever-text">' + row.text + '</span>';
      track.appendChild(c);
    });
    var prev = el('button', 'jp-sl-btn jp-sl-prev', '‹');
    var next = el('button', 'jp-sl-btn jp-sl-next', '›');
    prev.type = next.type = 'button';
    prev.setAttribute('aria-label', 'Назад');
    next.setAttribute('aria-label', 'Вперёд');
    slider.appendChild(prev);
    slider.appendChild(track);
    slider.appendChild(next);
    wrap.appendChild(slider);
    container.appendChild(wrap);

    function step() {
      var c = track.firstElementChild;
      return c ? c.offsetWidth + 1 : track.clientWidth;
    }
    function update() {
      var max = track.scrollWidth - track.clientWidth;
      var scrollable = max > 2;
      prev.style.display = next.style.display = scrollable ? '' : 'none';
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
    }
    prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    track.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    update();
  }

  var SVG_L = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
  var SVG_R = '<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>';

  function renderBanners(container, data, pageCfg) {
    var banners = (data.banners || []).filter(function (b) {
      return !pageCfg.bannerIds || pageCfg.bannerIds.indexOf(b.id) > -1;
    });
    if (!banners.length) return;
    var idx = 0, swiping = false, sx = 0;

    var wrap = el('div', 'jp-wrap');
    var box = el('div', 'jp-bn');
    var prev = el('button', 'jp-bn-btn jp-bn-prev', SVG_L);
    var next = el('button', 'jp-bn-btn jp-bn-next', SVG_R);
    var track = el('div', 'jp-bn-track');
    prev.type = next.type = 'button';
    prev.setAttribute('aria-label', 'Назад');
    next.setAttribute('aria-label', 'Вперёд');

    var lb = el('div', 'jp-lb');
    var lbClose = el('button', 'jp-lb-close', '✕');
    var lbPrev = el('button', 'jp-lb-nav jp-lb-prev', SVG_L);
    var lbNext = el('button', 'jp-lb-nav jp-lb-next', SVG_R);
    var lbImg = document.createElement('img');
    var lbCount = el('div', 'jp-lb-count');
    lbClose.type = lbPrev.type = lbNext.type = 'button';
    lbClose.setAttribute('aria-label', 'Закрыть');
    lb.appendChild(lbClose); lb.appendChild(lbPrev); lb.appendChild(lbImg); lb.appendChild(lbNext); lb.appendChild(lbCount);

    function show() { lbImg.src = banners[idx].image; lbImg.alt = banners[idx].alt || 'Акция'; lbCount.textContent = (idx + 1) + ' / ' + banners.length; }
    function openLb(i) { idx = i; show(); lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; }
    function nav(d) { idx = (idx + d + banners.length) % banners.length; show(); }
    function slide(d) { var c = track.firstElementChild; track.scrollBy({ left: d * (c ? c.offsetWidth + 1 : track.clientWidth), behavior: 'smooth' }); }

    banners.forEach(function (b, i) {
      var card = el('div', 'jp-bn-card');
      var img = document.createElement('img');
      img.src = b.image; img.alt = b.alt || 'Акция'; img.loading = 'lazy';
      card.appendChild(img);
      card.addEventListener('click', function () { if (swiping) { swiping = false; return; } openLb(i); });
      track.appendChild(card);
    });

    prev.addEventListener('click', function () { slide(-1); });
    next.addEventListener('click', function () { slide(1); });
    lbClose.addEventListener('click', closeLb);
    lbPrev.addEventListener('click', function () { nav(-1); });
    lbNext.addEventListener('click', function () { nav(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    track.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; swiping = false; }, { passive: true });
    track.addEventListener('touchmove', function (e) { if (Math.abs(e.touches[0].clientX - sx) > 10) swiping = true; }, { passive: true });
    var lx = 0;
    lb.addEventListener('touchstart', function (e) { lx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) { var dx = e.changedTouches[0].clientX - lx; if (Math.abs(dx) > 50) nav(dx < 0 ? 1 : -1); }, { passive: true });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowRight') nav(1);
      if (e.key === 'ArrowLeft') nav(-1);
    });

    box.appendChild(prev); box.appendChild(track); box.appendChild(next);
    wrap.appendChild(box);
    container.appendChild(wrap);
    document.body.appendChild(lb);
  }

  function init() {
    var container = document.getElementById(CONTAINER_ID);
    if (!container) {
      console.warn('[jmed-promos] container #' + CONTAINER_ID + ' not found');
      return;
    }
    if (!PAGE_KEY) {
      console.warn('[jmed-promos] script tag is missing data-jmed-page attribute');
      return;
    }
    fetch(DATA_URL, { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var pageCfg = data.pages && data.pages[PAGE_KEY];
        if (!pageCfg) {
          console.warn('[jmed-promos] no config for page "' + PAGE_KEY + '" in promos.json');
          return;
        }
        injectStyles();
        fillExtras(data, pageCfg);
        container.innerHTML = '';
        if (pageCfg.variant === 'full') {
          renderFull(container, data, pageCfg);
        } else if (pageCfg.variant === 'evergreen') {
          renderEvergreen(container, data);
        } else if (pageCfg.variant === 'perma') {
          renderPerma(container, data);
        } else if (pageCfg.variant === 'banners') {
          renderBanners(container, data, pageCfg);
        } else {
          renderMini(container, data, pageCfg);
        }
      })
      .catch(function (err) {
        console.error('[jmed-promos] failed to load promos.json', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
