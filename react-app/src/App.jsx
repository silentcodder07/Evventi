import { useEffect, useRef, useState } from 'react';
import emptyFrame from '../../assets/transform-01-empty.jpg';
import canopyFrame from '../../assets/transform-02-canopy.jpg';
import floralsFrame from '../../assets/transform-03-florals.jpg';
import seatingFrame from '../../assets/transform-04-seating.jpg';
import finishedFrame from '../../assets/transform-05-finished.jpg';
import courtyardBefore from '../../assets/courtyard-before.jpg';
import courtyardAfter from '../../assets/courtyard-after.jpg';

const frames = [
  { src: emptyFrame, alt: 'The empty courtyard before event setup begins' },
  { src: canopyFrame, alt: 'The ceremony canopy and draping being set in place' },
  { src: floralsFrame, alt: 'Florals and an aisle runner added to the ceremony canopy' },
  { src: seatingFrame, alt: 'Guest tables and chairs arranged around the aisle' },
  { src: finishedFrame, alt: 'The finished celebration glowing with candles and overhead lights' },
];

const heroStages = [
  { title: 'A space waits', accent: 'for a story.', description: 'Every celebration starts with a place — and a vision for what it can become.', label: 'The open space' },
  { title: 'A frame takes', accent: 'its shape.', description: 'Canopy and draping give the venue its first new purpose.', label: 'Structure & draping' },
  { title: 'Florals bring', accent: 'the feeling.', description: 'Flowers and an aisle add softness, colour and a focal point.', label: 'Florals & aisle' },
  { title: 'Every place', accent: 'is made ready.', description: 'Tables, chairs and finishing details make room for everyone.', label: 'Guest seating' },
  { title: 'And then,', accent: 'the lights come on.', description: 'A seamless celebration, thoughtfully curated by Evventi by Namita.', label: 'The finishing glow' },
];

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="Evventi by Namita home">
      <span className="brand-mark">E</span>
      <span className="brand-name">EVVENTI<small>BY NAMITA</small></span>
    </a>
  );
}

function Eyebrow({ children }) {
  return <span className="eyebrow"><span className="eyebrow-line" />{children}</span>;
}

function App() {
  const heroRef = useRef(null);
  const heroCopyRef = useRef(null);
  const progressRef = useRef(null);
  const activeStageRef = useRef(-1);
  const [stage, setStage] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const currentStage = heroStages[stage];

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;
    const imageNodes = [...hero.querySelectorAll('.hero-frame')];
    let scheduled = false;

    const updateHero = () => {
      scheduled = false;
      const bounds = hero.getBoundingClientRect();
      const travel = Math.max(1, hero.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -bounds.top / travel));
      const framePosition = progress * (heroStages.length - 1);
      const nextStage = Math.min(heroStages.length - 1, Math.round(framePosition));
      const revealIndex = Math.floor(framePosition);
      const revealProgress = framePosition - revealIndex;

      imageNodes.forEach((image, index) => {
        image.style.opacity = '1';
        image.style.clipPath = index <= revealIndex
          ? 'inset(0 0 0 0)'
          : index === revealIndex + 1
            ? `inset(${(1 - revealProgress) * 100}% 0 0 0)`
            : 'inset(100% 0 0 0)';
        image.style.willChange = index === revealIndex + 1 ? 'clip-path' : 'auto';
        image.classList.toggle('active', index === revealIndex || index === revealIndex + 1);
      });
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;

      if (nextStage !== activeStageRef.current) {
        if (activeStageRef.current >= 0 && heroCopyRef.current) {
          heroCopyRef.current.classList.remove('stage-change');
          void heroCopyRef.current.offsetWidth;
          heroCopyRef.current.classList.add('stage-change');
        }
        activeStageRef.current = nextStage;
        setStage(nextStage);
      }
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
    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={`site-header${menuOpen ? ' nav-open' : ''}`}>
        <Brand />
        <nav aria-label="Main navigation">
          <a href="#story" onClick={closeMenu}>Our approach</a>
          <a href="#moments" onClick={closeMenu}>Celebrations</a>
          <a href="#process" onClick={closeMenu}>The process</a>
        </nav>
        <a className="header-cta" href="#contact">Plan your event <span>↗</span></a>
        <button className="menu-button" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span />
        </button>
      </header>

      <main>
        <section className="hero" id="top" aria-label="Scroll to see a celebration take shape" ref={heroRef}>
          <div className="hero-sticky">
            <div className="hero-visual">
              {frames.map((frame, index) => (
                <img
                  className={`hero-frame${index === 0 ? ' active' : ''}`}
                  key={frame.src}
                  src={frame.src}
                  alt={frame.alt}
                  aria-hidden="true"
                  fetchPriority={index === 0 ? 'high' : undefined}
                  decoding="async"
                />
              ))}
              <div className="hero-image-shade" />
              <div className="hero-copy" ref={heroCopyRef}>
                <Eyebrow>LUXURY EVENT PLANNING · BY NAMITA</Eyebrow>
                <h1><span className="hero-heading">{currentStage.title}</span><br /><em className="hero-heading-accent">{currentStage.accent}</em></h1>
                <p className="hero-description">{currentStage.description}</p>
                <div className="hero-timeline"><span className="hero-stage-number">{String(stage + 1).padStart(2, '0')}</span><span className="timeline-divider" /><span className="hero-stage-title">{currentStage.label}</span></div>
                <a className="round-link" href="#story"><span className="round-arrow">↓</span><span>Keep scrolling to see it unfold</span></a>
              </div>
              <div className="hero-stamp"><span>CURATED WITH</span><strong>care<br />&amp; feeling</strong></div>
              <span className="image-note">{String(stage + 1).padStart(2, '0')} · {currentStage.label.toUpperCase()}</span>
              <div className="hero-image-progress"><span ref={progressRef} /></div>
            </div>
            <div className="hero-side">WEDDINGS · CELEBRATIONS · EVENT CURATION</div>
            <div className="hero-bottom"><span>SEAMLESS FROM START TO FINISH</span><span className="hero-progress-count">{String(stage + 1).padStart(2, '0')} — 05</span></div>
          </div>
        </section>

        <section className="story" id="story" aria-label="How Evventi brings a celebration together">
          <div className="story-sticky">
            <div className="story-photo">
              <img src={finishedFrame} alt="A fully prepared courtyard celebration venue at golden hour" loading="lazy" decoding="async" />
              <div className="photo-shade" />
              <span className="photo-label">END-TO-END EVENT CURATION</span>
              <div className="story-caption"><span className="caption-index">THE MAKING OF A MOMENT</span><p>Thought through,<br /><em>all the way.</em></p></div>
            </div>
            <div className="story-copy">
              <Eyebrow>THE DETAILS, HELD TOGETHER</Eyebrow>
              <div className="story-steps">
                <article className="story-step active" data-step="0"><span className="step-no">01</span><div><h2>We start with the space.</h2><p>First comes a clear canvas, a plan, and a sense of how the celebration should feel.</p></div></article>
                <article className="story-step" data-step="1"><span className="step-no">02</span><div><h2>The structure takes shape.</h2><p>Canopy, draping and layout give the venue its first new purpose.</p></div></article>
                <article className="story-step" data-step="2"><span className="step-no">03</span><div><h2>Florals set the mood.</h2><p>Flowers and the aisle bring softness, colour and a focal point into the scene.</p></div></article>
                <article className="story-step" data-step="3"><span className="step-no">04</span><div><h2>Every place is prepared.</h2><p>Tables, chairs and little finishing details make room for everyone.</p></div></article>
                <article className="story-step" data-step="4"><span className="step-no">05</span><div><h2>Then the lights come on.</h2><p>The final glow arrives. The space is ready for the people and the moment.</p></div></article>
              </div>
              <span className="story-footnote">A LITTLE CARE IN EVERY CORNER</span>
            </div>
          </div>
        </section>

        <section className="intro-band">
          <Eyebrow>MORE THAN A BEAUTIFUL BACKDROP</Eyebrow>
          <p>We take care of the <em>how</em>, so you can be here for the <em>why.</em></p>
        </section>

        <section className="moments" id="moments">
          <div className="section-heading"><div><Eyebrow>CELEBRATIONS, CURATED AROUND YOU</Eyebrow><h2>Made for<br /><em>your kind of day.</em></h2></div><p>From a once-in-a-lifetime wedding to a joyful celebration, every detail is shaped around the people and feeling that matter to you.</p></div>
          <div className="moment-grid">
            <article className="moment-card wedding"><div className="moment-img"><img src={courtyardAfter} alt="A wedding venue styled with flowers and warm golden light" loading="lazy" decoding="async" /><span className="moment-number">01</span><span className="moment-arrow">↗</span></div><div className="moment-meta"><h3>The wedding day</h3><span>WEDDINGS &amp; WEDDING DECOR</span></div><p>A celebration with a sense of occasion, thoughtfully brought together from venue to finishing touches.</p></article>
            <article className="moment-card gathering"><div className="moment-img"><img src={courtyardBefore} alt="An open venue ready to be curated for a celebration" loading="lazy" decoding="async" /><span className="moment-number">02</span><span className="moment-arrow">↗</span></div><div className="moment-meta"><h3>A reason to celebrate</h3><span>THEMED EVENTS &amp; GATHERINGS</span></div><p>Personal, playful or dressed in ivory and gold — a gathering made to feel like yours.</p></article>
          </div>
          <p className="visual-note">Illustrative event concepts shown; replace with Evventi’s own event photography for launch.</p>
          <div className="handwritten">Every detail, in its right place</div>
        </section>

        <section className="process" id="process">
          <div className="process-visual"><img src={courtyardAfter} alt="Warm lanterns and flowers finishing a courtyard celebration" loading="lazy" decoding="async" /><span className="process-tag">THE FINISHING TOUCH</span><span className="process-big-no">04</span></div>
          <div className="process-copy"><Eyebrow>END-TO-END EVENT CURATION</Eyebrow><h2>Seamless by design.<br /><em>Personal by nature.</em></h2><p>Venue, look and flow — each part is considered as one. We bring the plan together behind the scenes, so when the day arrives, you can be present for all of it.</p><a href="https://www.instagram.com/evventibynamita/" target="_blank" rel="noreferrer" className="text-link">See more of Evventi’s work <span>↗</span></a><div className="process-signoff"><span>THOUGHTFULLY CURATED</span><span className="signature">Evventi</span></div></div>
        </section>

        <section className="contact" id="contact"><Eyebrow>YOUR CELEBRATION STARTS WITH A HELLO</Eyebrow><h2>Tell us what<br />you’re <em>imagining.</em></h2><p>Share your idea with Namita and start shaping a celebration that feels like yours.</p><a href="https://www.instagram.com/evventibynamita/" target="_blank" rel="noreferrer" className="contact-button">Enquire on Instagram <span>↗</span></a><span className="contact-note">EVVENTI BY NAMITA · LUXURY EVENT PLANNER</span></section>
      </main>

      <footer className="site-footer"><Brand /><span>SEAMLESS CELEBRATIONS, THOUGHTFULLY CURATED.</span><a href="#top">BACK TO THE TOP ↑</a><span>© EVVENTI BY NAMITA 2026</span></footer>
    </>
  );
}

export default App;
