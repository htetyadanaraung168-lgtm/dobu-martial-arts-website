
(function () {
  'use strict';

  var sash      = document.getElementById('sash');
  var progress  = document.getElementById('progress');
  var toTop     = document.getElementById('toTop');
  var navToggle = document.getElementById('navToggle');
  var navLinks  = document.getElementById('navLinks');
  var docEl     = document.documentElement;

  /* ---------- scroll: header shadow, progress, back-to-top ---------- */
  var ticking = false;

  function onScroll() {
    var y   = window.pageYOffset || docEl.scrollTop;
    var max = docEl.scrollHeight - window.innerHeight;

    if (sash)     sash.classList.toggle('scrolled', y > 8);
    if (toTop)    toTop.classList.toggle('show', y > 600);
    if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  onScroll();

  /* ---------- back to top ---------- */
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- mobile navigation ---------- */
  function closeNav() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    document.addEventListener('click', function (e) {
      if (!navLinks.classList.contains('open')) return;
      if (navLinks.contains(e.target) || navToggle.contains(e.target)) return;
      closeNav();
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealItems  = document.querySelectorAll('.reveal');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !reduceMotion) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealItems.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
      observer.observe(el);
    });
  } else {
    revealItems.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- smooth in-page anchor scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (!id || id === '#') return;

      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      var offset = (sash ? sash.offsetHeight : 0) + 16;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---------- newsletter form ---------- */
  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var input = newsletterForm.querySelector('input[type="email"]');
      var value = input ? input.value.trim() : '';
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      if (!valid) {
        if (input) {
          input.style.boxShadow = 'inset 0 0 0 2px var(--red)';
          input.focus();
        }
        return;
      }

      if (input) {
        input.value = '';
        input.placeholder = 'Thanks — you\'re subscribed.';
        input.style.boxShadow = '';
        input.disabled = true;
      }

      var btn = newsletterForm.querySelector('button');
      if (btn) {
        btn.textContent = 'Subscribed ✓';
        btn.disabled = true;
        btn.style.background = 'var(--success)';
      }

      setTimeout(function () {
        if (input) {
          input.disabled = false;
          input.placeholder = 'you@example.com';
        }
        if (btn) {
          btn.textContent = 'Subscribe';
          btn.disabled = false;
          btn.style.background = '';
        }
      }, 3600);
    });
  }

})();
