(() => {
  const hero = document.querySelector('.hero');
  const frames = [...document.querySelectorAll('.hero-frame')];
  const progressBar = document.querySelector('.hero-image-progress span');
  const stageNumber = document.querySelector('.hero-stage-number');
  const stageTitle = document.querySelector('.hero-stage-title');
  const imageNote = document.querySelector('.image-note');
  const progressCount = document.querySelector('.hero-progress-count');
  const heroCopy = document.querySelector('.hero-copy');
  const heroHeading = document.querySelector('.hero-heading');
  const heroAccent = document.querySelector('.hero-heading-accent');
  const heroDescription = document.querySelector('.hero-description');
  let scheduled = false;
  let activeStage = -1;

  const updateHero = () => {
    scheduled = false;
    if (!hero || !frames.length) return;
    const bounds = hero.getBoundingClientRect();
    const travel = Math.max(1, hero.offsetHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, -bounds.top / travel));
    const framePosition = progress * (frames.length - 1);
    const active = Math.min(frames.length - 1, Math.round(framePosition));
    const revealIndex = Math.floor(framePosition);
    const revealProgress = framePosition - revealIndex;

    frames.forEach((frame, index) => {
      frame.style.opacity = '1';
      frame.style.clipPath = index <= revealIndex
        ? 'inset(0 0 0 0)'
        : index === revealIndex + 1
          ? `inset(${(1 - revealProgress) * 100}% 0 0 0)`
          : 'inset(100% 0 0 0)';
      frame.style.willChange = index === revealIndex + 1 ? 'clip-path' : 'auto';
      frame.classList.toggle('active', index === revealIndex || index === revealIndex + 1);
    });
    if (active === activeStage) {
      progressBar.style.transform = `scaleX(${progress})`;
      return;
    }
    activeStage = active;
    const current = frames[active];
    const copy = [
      { title: 'A space waits', accent: 'for a story.', description: 'Every celebration starts with a place — and a vision for what it can become.', stage: 'The open space' },
      { title: 'A frame takes', accent: 'its shape.', description: 'Canopy and draping give the venue its first new purpose.', stage: 'Structure & draping' },
      { title: 'Florals bring', accent: 'the feeling.', description: 'Flowers and an aisle add softness, colour and a focal point.', stage: 'Florals & aisle' },
      { title: 'Every place', accent: 'is made ready.', description: 'Tables, chairs and finishing details make room for everyone.', stage: 'Guest seating' },
      { title: 'And then,', accent: 'the lights come on.', description: 'A seamless celebration, thoughtfully curated by Evventi by Namita.', stage: 'The finishing glow' }
    ][active];
    if (activeStage >= 0) {
      heroCopy.classList.remove('stage-change');
      void heroCopy.offsetWidth;
      heroCopy.classList.add('stage-change');
    }
    heroHeading.textContent = copy.title;
    heroAccent.textContent = copy.accent;
    heroDescription.textContent = copy.description;
    stageNumber.textContent = String(active + 1).padStart(2, '0');
    stageTitle.textContent = copy.stage;
    imageNote.textContent = `${String(active + 1).padStart(2, '0')} · ${copy.stage.toUpperCase()}`;
    progressCount.textContent = `${String(active + 1).padStart(2, '0')} — 05`;
    progressBar.style.transform = `scaleX(${progress})`;
  };

  const requestUpdate = () => {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateHero);
    }
  };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  updateHero();

  const menu = document.querySelector('.menu-button');
  const header = document.querySelector('.site-header');
  menu?.addEventListener('click', () => {
    const open = header.classList.toggle('nav-open');
    menu.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.site-header nav a').forEach(link => link.addEventListener('click', () => {
    header.classList.remove('nav-open');
    menu?.setAttribute('aria-expanded', 'false');
  }));
})();
