(function () {
  const translations = window.JEKYLL_DATA?.translations || {};
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let typewriterTimeout;

  function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML.replace(/&lt;(\/?)(b|i|em|strong|br|span)&gt;/gi, '<$1$2>');
  }

  function runTypewriter(text) {
    const el = document.querySelector('.typewriter');
    if (!el) return;
    clearTimeout(typewriterTimeout);
    el.textContent = '';
    if (prefersReducedMotion) {
      el.textContent = text;
      return;
    }

    let i = 0;
    (function type() {
      if (i < text.length) {
        el.textContent += text[i++];
        typewriterTimeout = setTimeout(type, 50 + Math.random() * 50);
      }
    })();
  }

  function getLang() {
    return localStorage.getItem('lang') === 'es' ? 'es' : 'en';
  }

  function setLang(lang) {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    const t = translations[lang];

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      if (t[el.dataset.i18n]) el.innerHTML = sanitizeHTML(t[el.dataset.i18n]);
    });
    document.querySelectorAll('[data-i18n-a11y]').forEach((el) => {
      const val = t[el.dataset.i18nA11y];
      if (val) {
        el.title = val;
        el.setAttribute('aria-label', val);
      }
    });

    if (t.hero_intro) runTypewriter(t.hero_intro);

    document.querySelectorAll('.lang-switcher button').forEach((btn) => {
      btn.setAttribute('aria-checked', btn.dataset.lang === lang);
    });
  }

  setLang(getLang());

  document.querySelectorAll('.lang-switcher button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (lang && lang !== getLang()) {
        setLang(lang);
        window.scrollTo(0, 0);
      }
    });
  });
})();
