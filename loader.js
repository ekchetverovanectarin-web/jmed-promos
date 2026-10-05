(function () {
  var SCRIPT = document.currentScript;
  var PAGE_KEY = SCRIPT ? SCRIPT.getAttribute('data-jmed-page') : null;
  var CONTAINER_ID = (SCRIPT && SCRIPT.getAttribute('data-jmed-target')) || 'jmed-promos';
  var DATA_URL = SCRIPT ? new URL('promos.json', SCRIPT.src).href : 'promos.json';
  var STYLE_ID = 'jmed-promo-styles';

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
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
      + '.jp-evergreen{margin-top:40px;padding-top:32px;border-top:1px solid var(--jp-line)}'
      + '.jp-evergreen-title{font-family:Georgia,serif;font-size:20px;font-weight:300;color:var(--jp-ink);margin-bottom:18px}'
      + '.jp-evergreen-row{display:flex;gap:16px;align-items:baseline;padding:10px 0;border-bottom:1px solid var(--jp-line);font-size:14px;color:var(--jp-muted)}'
      + '.jp-evergreen-pct{font-family:Georgia,serif;font-size:22px;color:var(--jp-gold);flex:0 0 auto}';
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
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

    var list = el('div', 'jp-full-list');
    (pageCfg.offerIds || []).forEach(function (id) {
      var o = offersById[id];
      if (!o) return;
      var item = el('div', 'jp-full-item');
      item.id = o.id;
      var priceHtml = '<span class="jp-price-new">' + o.priceNew + '</span>';
      if (o.priceOld) priceHtml += '<span class="jp-price-old">' + o.priceOld + '</span>';
      var termsHtml = (o.terms || []).map(function (t) { return '<li>' + t + '</li>'; }).join('');
      item.innerHTML = ''
        + '<div class="jp-badge">' + o.badge + '</div>'
        + '<div class="jp-title">' + o.title + '</div>'
        + '<div class="jp-price">' + priceHtml + '</div>'
        + '<p class="jp-full-desc">' + o.description + '</p>'
        + (termsHtml ? '<ul class="jp-full-terms">' + termsHtml + '</ul>' : '')
        + '<a class="jp-full-cta" href="https://n463443.yclients.com/company/438951/personal/menu?o=" target="_blank" rel="noopener">' + (o.cta || 'Записаться') + ' →</a>';
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
