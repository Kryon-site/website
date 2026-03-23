/* Reveal on scroll */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

reveals.forEach(el => revealObserver.observe(el));

/* Animated counters */
function animateCounter(el) {
  const target = Number.parseFloat(el.dataset.target);
  const decimals = Number.parseInt(el.dataset.decimals ?? '0', 10);
  const duration = 1800;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = (target * eased).toFixed(decimals);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target.toFixed(decimals);
    }
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.estat-num').forEach(el => {
  counterObserver.observe(el);
});

/* Walkthrough tabs */
const stepBtns = Array.from(document.querySelectorAll('.step-btn'));
const stepPanels = Array.from(document.querySelectorAll('.step-panel'));
const AUTO_DELAY = 5000;
let autoTimer = null;
let currentStep = Math.max(
  stepBtns.findIndex(btn => btn.classList.contains('active')),
  0
);

function goToStep(index) {
  if (!stepBtns.length) return;

  index = ((index % stepBtns.length) + stepBtns.length) % stepBtns.length;

  stepBtns.forEach((btn, i) => {
    const active = i === index;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', String(active));
    btn.tabIndex = active ? 0 : -1;

    const bar = btn.querySelector('.step-progress');
    if (bar && active) {
      const clone = bar.cloneNode(true);
      bar.parentNode.replaceChild(clone, bar);
    }
  });

  stepPanels.forEach((panel, i) => {
    const active = i === index;
    panel.classList.toggle('active', active);
    panel.hidden = !active;
  });

  currentStep = index;
}

function startAuto() {
  if (stepBtns.length < 2) return;
  clearInterval(autoTimer);
  autoTimer = setInterval(() => {
    goToStep(currentStep + 1);
  }, AUTO_DELAY);
}

function stopAuto() {
  clearInterval(autoTimer);
}

stepBtns.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    goToStep(i);
    startAuto();
  });

  btn.addEventListener('keydown', event => {
    let nextIndex = null;

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      nextIndex = i + 1;
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      nextIndex = i - 1;
    }

    if (event.key === 'Home') {
      nextIndex = 0;
    }

    if (event.key === 'End') {
      nextIndex = stepBtns.length - 1;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    goToStep(nextIndex);
    stepBtns[currentStep]?.focus();
    startAuto();
  });
});

const walkthroughEl = document.querySelector('.walkthrough-section');
if (walkthroughEl && stepBtns.length) {
  goToStep(currentStep);
  startAuto();

  const autoObserver = new IntersectionObserver(
    entries => {
      if (entries[0]?.isIntersecting) {
        startAuto();
      } else {
        stopAuto();
      }
    },
    { threshold: 0.35 }
  );

  autoObserver.observe(walkthroughEl);
}

/* Header state */
const header = document.querySelector('.site-header');

function syncHeaderState() {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 20);
}

syncHeaderState();
window.addEventListener('scroll', syncHeaderState, { passive: true });
