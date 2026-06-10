import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FEATURES_DATA = [
  {
    image: '/images/feature-mic.jpg',
    title: 'Crystal Clear Audio',
    description: 'Captures every word with advanced noise cancellation — even in crowded lecture halls.',
  },
  {
    image: '/images/feature-brain.jpg',
    title: 'Smart Summarization',
    description: 'AI identifies key concepts, definitions, and formulas automatically. No fluff, just focus.',
  },
  {
    image: '/images/feature-list.jpg',
    title: 'Structured Formatting',
    description: 'Notes organized with headers, bullets, and highlights — ready to study.',
  },
  {
    image: '/images/feature-lock.jpg',
    title: 'Private & Secure',
    description: 'Your lectures and notes are encrypted and never shared. Full data ownership.',
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current;
    if (!section || !header || !cards) return;

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

    const cardElements = cards.querySelectorAll('.feature-card');
    tl.fromTo(
      cardElements,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out' },
      '-=0.3'
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      style={{
        backgroundColor: '#F5F0E6',
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
            FEATURES
          </div>
          <h2
            className="title font-mono font-semibold uppercase"
            style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              color: '#2A2A2A',
              maxWidth: '700px',
              marginTop: '12px',
              opacity: 0,
            }}
          >
            Everything You Need for Better Notes
          </h2>
        </div>

        {/* Feature Cards Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ gap: '24px', marginTop: '60px' }}
        >
          {FEATURES_DATA.map((feature, i) => (
            <div
              key={i}
              className="feature-card transition-all duration-300"
              style={{
                background: '#EDE8DD',
                border: '2px solid #D6D0C4',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                opacity: 0,
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(-8px)';
                el.style.borderColor = '#D4A72C';
                el.style.boxShadow = '0 16px 48px rgba(212, 167, 44, 0.15)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'translateY(0)';
                el.style.borderColor = '#D6D0C4';
                el.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.04)';
              }}
            >
              {/* Image */}
              <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full"
                  style={{ aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                />
              </div>

              {/* Title */}
              <h3
                className="font-mono font-semibold uppercase"
                style={{
                  fontSize: '20px',
                  lineHeight: 1.3,
                  letterSpacing: '-0.01em',
                  color: '#2A2A2A',
                  marginTop: '20px',
                }}
              >
                {feature.title}
              </h3>

              {/* Description */}
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
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
