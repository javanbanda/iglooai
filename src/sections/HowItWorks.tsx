import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS_DATA = [
  {
    image: '/images/step-record.jpg',
    title: 'Hit Record',
    description: 'Open igloo and tap the record button when class starts. That\'s it.',
  },
  {
    image: '/images/step-process.jpg',
    title: 'Let AI Work',
    description: 'igloo transcribes audio, identifies topics, and structures your notes in real time.',
  },
  {
    image: '/images/step-review.jpg',
    title: 'Study Smarter',
    description: 'Review clean, organized notes with highlighted key terms and concepts.',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const steps = stepsRef.current;
    const line = lineRef.current;
    if (!section || !header || !steps || !line) return;

    const overline = header.querySelector('.overline');
    const title = header.querySelector('.title');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(overline, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
    tl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3');

    // Line animation
    tl.fromTo(
      line,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.2, ease: 'power2.inOut', transformOrigin: 'left center' },
      '-=0.2'
    );

    // Step animations
    const stepElements = steps.querySelectorAll('.step-item');
    stepElements.forEach((step, i) => {
      const circle = step.querySelector('.step-circle');
      const image = step.querySelector('.step-image');
      const text = step.querySelector('.step-text');

      tl.fromTo(
        circle,
        { scale: 0 },
        { scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
        `-=${1.0 - i * 0.15}`
      );
      tl.fromTo(
        image,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.2'
      );
      tl.fromTo(
        text,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
        '-=0.3'
      );
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      style={{
        backgroundColor: '#FAF8F3',
        padding: '120px clamp(24px, 5vw, 80px)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
        <div ref={headerRef}>
          <div
            className="overline font-mono font-semibold uppercase"
            style={{
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: '#D4A72C',
              opacity: 0,
            }}
          >
            HOW IT WORKS
          </div>
          <h2
            className="title font-mono font-semibold uppercase"
            style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              color: '#2A2A2A',
              maxWidth: '600px',
              marginTop: '12px',
              opacity: 0,
            }}
          >
            Three Steps to Better Notes
          </h2>
        </div>

        {/* Steps Container */}
        <div ref={stepsRef} className="relative" style={{ marginTop: '60px' }}>
          {/* Connecting Line - Desktop only */}
          <div
            ref={lineRef}
            className="hidden lg:block absolute"
            style={{
              top: '28px',
              left: 'calc(16.67% - 24px)',
              right: 'calc(16.67% - 24px)',
              height: '2px',
              backgroundColor: 'rgba(212, 167, 44, 0.3)',
              transformOrigin: 'left center',
              zIndex: 0,
            }}
          />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: '48px' }}>
            {STEPS_DATA.map((step, i) => (
              <div
                key={i}
                className="step-item flex flex-col items-center text-center relative"
                style={{ zIndex: 1 }}
              >
                {/* Step Number Circle */}
                <div
                  className="step-circle flex items-center justify-center"
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: '#D4A72C',
                    border: '2px solid #B8942A',
                    flexShrink: 0,
                  }}
                >
                  <span
                    className="font-mono font-bold"
                    style={{
                      fontSize: '22px',
                      color: '#FFFFFF',
                    }}
                  >
                    {i + 1}
                  </span>
                </div>

                {/* Step Image */}
                <div
                  className="step-image"
                  style={{
                    marginTop: '24px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '2px solid #D6D0C4',
                    width: '200px',
                    height: '150px',
                  }}
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                    loading="lazy"
                  />
                </div>

                {/* Step Text */}
                <div className="step-text" style={{ marginTop: '16px', maxWidth: '280px' }}>
                  <h3
                    className="font-mono font-semibold uppercase"
                    style={{
                      fontSize: '20px',
                      lineHeight: 1.3,
                      color: '#2A2A2A',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '15px',
                      fontWeight: 400,
                      lineHeight: 1.6,
                      color: 'rgba(42, 42, 42, 0.8)',
                      marginTop: '8px',
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
