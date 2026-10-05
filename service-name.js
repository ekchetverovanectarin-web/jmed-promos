(function () {
  if (window.__jmedServiceName) return;
  window.__jmedServiceName = true;

  function serviceName() {
    var h1 = document.querySelector('h1');
    var text = h1 ? h1.innerText.replace(/\s+/g, ' ').trim() : '';
    if (text) return text;
    text = document.title.split(/[|—]/)[0].replace(/\/\s*J`?MED\s*$/i, '').trim();
    return text || 'Главная / прочее';
  }

  function fill() {
    var name = serviceName();
    Array.prototype.forEach.call(document.querySelectorAll('input[name="usluga"]'), function (el) {
      if (el.value !== name) el.value = name;
    });
  }

  fill();
  document.addEventListener('DOMContentLoaded', fill);
  window.addEventListener('load', fill);
  document.addEventListener('click', fill, true);
  document.addEventListener('input', fill, true);
  document.addEventListener('submit', fill, true);
  var tries = 0;
  var timer = setInterval(function () {
    fill();
    if (++tries > 20) clearInterval(timer);
  }, 500);
})();
