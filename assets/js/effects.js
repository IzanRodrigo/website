(function () {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  const scrollProgress = document.querySelector('.scroll-progress');
  const canvas = document.querySelector('.particles-canvas');
  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let particles = [];

  let ticking = false;

  function updateScrollProgress() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0) + '%';
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollProgress);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateScrollProgress();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() > 0.5 ? 185 : 300;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
        if (Math.random() > 0.5) {
          this.x = Math.random() > 0.5 ? 0 : canvas.width;
          this.y = Math.random() * canvas.height;
        } else {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() > 0.5 ? 0 : canvas.height;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.min(50, Math.floor((canvas.width * canvas.height) / 20000));
    particles = Array.from({ length: count }, () => new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }

  if (!prefersReducedMotion) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
    animateParticles();

    let lastWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
      }
    });
  }

  const isTouchDevice = 'ontouchstart' in window;
  const TAP_DELAY = 200;

  document.querySelectorAll('.project-card').forEach((card) => {
    const link = card.querySelector('h3 a');
    if (!link) return;

    if (isTouchDevice) {
      let tapTimer, didScroll;

      card.addEventListener(
        'touchstart',
        () => {
          didScroll = false;
          tapTimer = setTimeout(() => !didScroll && card.classList.add('tap-active'), TAP_DELAY);
        },
        { passive: true }
      );

      card.addEventListener(
        'touchmove',
        () => {
          didScroll = true;
          clearTimeout(tapTimer);
          card.classList.remove('tap-active');
        },
        { passive: true }
      );

      card.addEventListener('touchend', () => {
        clearTimeout(tapTimer);
        if (!didScroll) {
          card.classList.add('tap-active');
          setTimeout(() => {
            card.classList.remove('tap-active');
            window.open(link.href, '_blank', 'noopener');
          }, 100);
        } else {
          card.classList.remove('tap-active');
        }
      });

      card.addEventListener('touchcancel', () => {
        clearTimeout(tapTimer);
        card.classList.remove('tap-active');
      });
    } else {
      card.addEventListener('click', () => window.open(link.href, '_blank', 'noopener'));
    }
  });

  const konamiCode = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    konamiIndex = e.key === konamiCode[konamiIndex] ? konamiIndex + 1 : 0;
    if (konamiIndex === konamiCode.length) {
      konamiIndex = 0;
      let hue = 0;
      const interval = setInterval(() => {
        hue = (hue + 2) % 360;
        document.documentElement.style.setProperty('--color-accent', `hsl(${hue}, 80%, 60%)`);
        document.documentElement.style.setProperty(
          '--color-gradient-start',
          `hsl(${hue}, 80%, 60%)`
        );
        document.documentElement.style.setProperty(
          '--color-gradient-end',
          `hsl(${(hue + 60) % 360}, 80%, 60%)`
        );
      }, 50);
      setTimeout(() => {
        clearInterval(interval);
        ['--color-accent', '--color-gradient-start', '--color-gradient-end'].forEach((p) =>
          document.documentElement.style.removeProperty(p)
        );
      }, 5000);
    }
  });
})();
