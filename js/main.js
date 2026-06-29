/* ─── Copyright year ──────────────────────────────────────── */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ─── Navigation: solid background on scroll ─────────────── */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 48);
}, { passive: true });

/* ─── Mobile menu toggle ──────────────────────────────────── */
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

/* Close menu when any nav link is clicked */
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* Close menu when clicking outside */
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

/* ─── Scroll-reveal via IntersectionObserver ─────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ─── Contact form: async Formspree submission ────────────── */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    /* Basic client-side guard: Formspree form ID must be set */
    if (form.action.includes('FORM_ID')) {
      formStatus.style.color = '#e63946';
      formStatus.textContent = 'Contact form not yet configured. Email directly: joshibhrugu0607@gmail.com';
      return;
    }

    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    formStatus.textContent = '';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = '#2d6a4f';
        formStatus.style.color = '#52b788';
        formStatus.textContent = 'Thanks. Bhrugu will get back to you soon.';
        form.reset();

        setTimeout(() => {
          submitBtn.textContent = originalLabel;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          formStatus.textContent = '';
        }, 5000);
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.errors?.[0]?.message || 'Submission failed');
      }
    } catch (err) {
      submitBtn.textContent = 'Error. Try again.';
      submitBtn.style.background = '#7b1e26';
      formStatus.style.color = '#e63946';
      formStatus.textContent = err.message || 'Something went wrong. Please email directly.';

      setTimeout(() => {
        submitBtn.textContent = originalLabel;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 4000);
    }
  });
}
