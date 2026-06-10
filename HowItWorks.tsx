import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FEATURES_LIST = [
  'Live transcript with timestamps',
  'Auto-generated structured notes',
  'Key term highlighting',
  'Speaker detection',
];

export default function DemoInterface() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;
    if (!section || !leftCol || !rightCol) return;

    const overline = leftCol.querySelector('.overline');
    const title = leftCol.querySelector('.title');
    const desc = leftCol.querySelector('.description');
    const features = leftCol.querySelectorAll('.feature-item');
    const cta = leftCol.querySelector('.cta-button');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(overline, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
    tl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3');
    tl.fromTo(desc, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');
    tl.fromTo(features, { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out' }, '-=0.3');
    tl.fromTo(cta, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2');

    tl.fromTo(
      rightCol,
      { opacity: 0, x: 40, scale: 0.97 },
      { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: 'power3.out' },
      '-=0.8'
    );

    // Floating animation for mockup
    gsap.to(rightCol.querySelector('.mockup-image'), {
      y: -8,
      duration: 4,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="pricing"
      ref={sectionRef}
      style={{
        backgroundColor: '#1A1A1A',
        padding: '120px clamp(24px, 5vw, 80px)',
      }}
    >
      <div
        className="flex flex-col lg:flex-row items-center"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          gap: '60px',
        }}
      >
        {/* Left Column - Text */}
        <div ref={leftColRef} className="w-full lg:w-5/12">
          <div
            className="overline font-mono font-semibold uppercase"
            style={{
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: '#D4A72C',
              opacity: 0,
            }}
          >
            SEE IT IN ACTION
          </div>

          <h2
            className="title font-mono font-semibold uppercase"
            style={{
              fontSize: 'clamp(32px, 4vw, 52px)',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#EAEAEA',
              marginTop: '12px',
              opacity: 0,
            }}
          >
            A Beautiful Interface for Powerful Notes
          </h2>

          <p
            className="description"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: 1.65,
              color: '#8A8A8A',
              marginTop: '16px',
              maxWidth: '420px',
              opacity: 0,
            }}
          >
            Split-view design lets you follow the live transcript while igloo builds your structured notes in real time. Every key term highlighted. Every concept organized.
          </p>

          {/* Feature List */}
          <div className="flex flex-col" style={{ gap: '16px', marginTop: '32px' }}>
            {FEATURES_LIST.map((feature, i) => (
              <div
                key={i}
                className="feature-item flex items-center"
                style={{ gap: '10px', opacity: 0 }}
              >
                <span
                  style={{
                    color: '#D4A72C',
                    fontSize: '16px',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  ✓
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '15px',
                    fontWeight: 400,
                    color: '#EAEAEA',
                  }}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            className="cta-button font-mono font-semibold uppercase transition-all duration-200 focus:outline-none"
            style={{
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: '#2A2A2A',
              background: '#D4A72C',
              border: '2px solid #D4A72C',
              borderRadius: '100px',
              padding: '14px 32px',
              cursor: 'pointer',
              marginTop: '40px',
              opacity: 0,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.backgroundColor = '#E0B838';
              el.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.backgroundColor = '#D4A72C';
              el.style.transform = 'scale(1)';
            }}
          >
            Get Started Free
          </button>
        </div>

        {/* Right Column - Mockup */}
        <div ref={rightColRef} className="w-full lg:w-7/12" style={{ opacity: 0 }}>
          <div
            className="mockup-image"
            style={{
              boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            <img
              src="/images/app-mockup.jpg"
              alt="igloo app interface showing split view with live transcript and structured notes"
              className="w-full"
              style={{ display: 'block' }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
