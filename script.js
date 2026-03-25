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

/* ─── Scroll-scrubbed frame animation ───────────────────────────────── */
(function () {
  const FRAME_COUNT = 151;          // extracted frame count (24fps × 6.29s)
  const FRAME_DIR   = 'media/frames/hand/';
  const FRAME_EXT   = '.jpg';

  const section = document.getElementById('scrubSection');
  const canvas  = document.getElementById('scrubCanvas');
  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });

  // Loaded HTMLImageElement per frame index (null = not yet loaded)
  const frames = new Array(FRAME_COUNT).fill(null);

  let pendingIndex  = 0;   // frame to draw on next RAF
  let renderedIndex = -1;  // last frame actually drawn
  let rafId         = null;

  // ── Sizing ───────────────────────────────────────────────────────────
  // After the first frame loads we know the video's intrinsic dimensions.
  // We set the canvas draw buffer to native size and CSS size to fit the
  // viewport, preserving aspect ratio on every window resize.
  let nativeW = 0;
  let nativeH = 0;

  function applyCanvasSize() {
    if (!nativeW) return;
    const center = document.querySelector('.scrub-center');
    const cw = center ? center.clientWidth  - 8  : window.innerWidth;
    const ch = center ? center.clientHeight - 16 : window.innerHeight;
    // Hard-cap: canvas occupies at most 42vw × 58vh so it reads as
    // "framed content" with the info panels clearly dominant beside it.
    const maxW = Math.min(cw, window.innerWidth  * 0.42);
    const maxH = Math.min(ch, window.innerHeight * 0.58);
    const scale = Math.min(maxW / nativeW, maxH / nativeH);
    canvas.style.width  = Math.round(nativeW * scale) + 'px';
    canvas.style.height = Math.round(nativeH * scale) + 'px';
  }

  // ── Phase switching ───────────────────────────────────────────────────
  // Swaps the active phase class at the 45% progress mark.
  // Phase 0 = problem (workflows), Phase 1 = solution (agents).
  const scrubSticky = document.querySelector('.scrub-sticky');
  let currentPhase  = -1; // force first call to always apply

  function updatePhase(progress) {
    const phase = progress >= 0.45 ? 1 : 0;
    if (phase === currentPhase) return;   // skip redundant DOM writes
    currentPhase = phase;

    document.querySelectorAll('.scrub-phase').forEach(el => {
      el.classList.toggle('active', Number(el.dataset.phase) === phase);
    });

    // Toggle a class on the sticky container so CSS can restyle panels
    // globally on phase change (border accent, background tint, etc.)
    if (scrubSticky) scrubSticky.classList.toggle('is-phase-agents', phase === 1);
  }

  function initCanvas(img) {
    nativeW = img.naturalWidth;
    nativeH = img.naturalHeight;
    // Draw-buffer stays at native resolution for crisp rendering
    canvas.width  = nativeW;
    canvas.height = nativeH;
    applyCanvasSize();
  }

  window.addEventListener('resize', applyCanvasSize, { passive: true });

  // ── Frame loading ─────────────────────────────────────────────────────
  function pad(i) {
    // frames on disk are 1-indexed: frame_0001.jpg … frame_0151.jpg
    return String(i + 1).padStart(4, '0');
  }

  function loadFrame(i) {
    return new Promise(resolve => {
      if (frames[i]) { resolve(frames[i]); return; }
      const img = new Image();
      img.onload  = () => { frames[i] = img; resolve(img); };
      img.onerror = () => resolve(null);
      img.src = `${FRAME_DIR}frame_${pad(i)}${FRAME_EXT}`;
    });
  }

  async function preload() {
    // 1. Load frame 0 immediately so we have something to show right away
    const first = await loadFrame(0);
    if (!first) return;

    initCanvas(first);
    drawImmediate(0);
    canvas.classList.add('is-ready');
    updatePhase(0);

    // 2. Load remaining frames sequentially in the background.
    //    Sequential (not parallel) keeps memory pressure low and lets
    //    the browser continue rendering without competing for bandwidth.
    for (let i = 1; i < FRAME_COUNT; i++) {
      await loadFrame(i);
    }
  }

  // ── Rendering ─────────────────────────────────────────────────────────
  function drawImmediate(index) {
    const img = frames[index];
    if (!img) return;
    ctx.drawImage(img, 0, 0, nativeW, nativeH);
    renderedIndex = index;
  }

  function scheduleRender(index) {
    pendingIndex = index;
    if (rafId !== null) return;          // already scheduled, just update target
    rafId = requestAnimationFrame(() => {
      rafId = null;
      if (pendingIndex !== renderedIndex) {
        drawImmediate(pendingIndex);
      }
    });
  }

  // ── Scroll mapping ────────────────────────────────────────────────────
  function getTargetIndex() {
    const { top } = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    // progress: 0 = animation start, 1 = animation end
    const progress = Math.max(0, Math.min(1, -top / scrollable));
    return Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));
  }

  function onScroll() {
    if (!nativeW) return;               // first frame not yet loaded
    const index = getTargetIndex();
    scheduleRender(index);
    updatePhase(index / (FRAME_COUNT - 1));
  }

  // ── Reduced-motion: just show first frame, no scrubbing ───────────────
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!prefersReduced.matches) {
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  preload();
})();

/* Header state */
const header = document.querySelector('.site-header');

function syncHeaderState() {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 20);
}

syncHeaderState();
window.addEventListener('scroll', syncHeaderState, { passive: true });
