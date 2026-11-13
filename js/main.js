(() => {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  /* Nav scroll state */
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile nav toggle */
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('is-active');
    navLinks.classList.toggle('is-open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navToggle.classList.remove('is-active');
      navLinks.classList.remove('is-open');
    });
  });

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* Counter animation */
  function animateCounters(container) {
    const nums = container.querySelectorAll('.stat-num[data-count]');
    nums.forEach(el => {
      if (el.dataset.animated) return;
      el.dataset.animated = 'true';
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const suffix = el.dataset.suffix || '';
      const divisor = Math.pow(10, decimals);
      const finalValue = target / divisor;
      const duration = 1300;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = finalValue * eased;
        el.textContent = decimals > 0
          ? current.toFixed(decimals) + suffix
          : Math.round(current).toLocaleString('en-US') + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) animateCounters(entry.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.modal-stats').forEach(el => statObserver.observe(el));

  /* Modal case studies */
  const backdrop = document.getElementById('modalBackdrop');
  const cards = document.querySelectorAll('[data-modal]');
  const modals = document.querySelectorAll('.modal[data-case]');
  let lastFocused = null;

  function openModal(key) {
    modals.forEach(m => m.hidden = m.dataset.case !== key);
    backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const activeModal = backdrop.querySelector(`.modal[data-case="${key}"]`);
    if (activeModal) {
      activeModal.querySelectorAll('.modal-stats').forEach(el => animateCounters(el));
    }
  }
  function closeModal() {
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      lastFocused = card;
      openModal(card.dataset.modal);
    });
  });
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });
  backdrop.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('is-open')) closeModal();
  });

  /* Contact form -> mailto */
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const subject = encodeURIComponent(`Project inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:mrebellon63@gmail.com?subject=${subject}&body=${body}`;
  });
})();
