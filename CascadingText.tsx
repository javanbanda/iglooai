import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS_DATA = [
  {
    quote: "igloo completely changed how I study. I actually pay attention in class now instead of frantically typing. My notes have never been better.",
    name: 'Sarah M.',
    detail: 'Computer Science, Stanford',
    initials: 'SM',
  },
  {
    quote: "The transcription accuracy is unreal. Even in my professor's thick accent, igloo catches everything. The auto-summarization saves me hours.",
    name: 'James K.',
    detail: 'Biology, UCLA',
    initials: 'JK',
  },
  {
    quote: "I was skeptical at first, but after one lecture I was hooked. The structured notes are perfectly organized for exam review.",
    name: 'Aisha R.',
    detail: 'Economics, NYU',
    initials: 'AR',
  },
];

export default function Testimonials() {
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

    const cardElements = cards.querySelectorAll('.testimonial-card');
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
            WHAT STUDENTS SAY
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
            Loved by Students Worldwide
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 lg:grid-cols-3"
          style={{ gap: '24px', marginTop: '60px' }}
        >
          {TESTIMONIALS_DATA.map((testimonial, i) => (
            <div
              key={i}
              className="testimonial-card"
              style={{
                background: '#FFFFFF',
                border: '2px solid #D6D0C4',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                opacity: 0,
              }}
            >
              {/* Stars */}
              <div className="flex" style={{ gap: '2px' }}>
                {[...Array(5)].map((_, j) => (
                  <span
                    key={j}
                    style={{
                      color: '#D4A72C',
                      fontSize: '16px',
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '16px',
                  fontWeight: 400,
                  lineHeight: 1.65,
                  color: '#2A2A2A',
                  marginTop: '16px',
                }}
              >
                "{testimonial.quote}"
              </p>

              {/* Divider */}
              <div
                style={{
                  height: '1px',
                  backgroundColor: '#D6D0C4',
                  marginTop: '20px',
                }}
              />

              {/* Author Info */}
              <div className="flex items-center" style={{ gap: '12px', marginTop: '16px' }}>
                {/* Avatar */}
                <div
                  className="flex items-center justify-center font-mono font-semibold"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#EDE8DD',
                    fontSize: '14px',
                    color: '#2A2A2A',
                    flexShrink: 0,
                  }}
                >
                  {testimonial.initials}
                </div>

                {/* Name + Detail */}
                <div className="flex flex-col">
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#2A2A2A',
                    }}
                  >
                    {testimonial.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '13px',
                      fontWeight: 400,
                      color: 'rgba(42, 42, 42, 0.6)',
                    }}
                  >
                    {testimonial.detail}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
