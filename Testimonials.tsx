import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import FormicaFoxShader from '../components/FormicaFoxShader';
import CascadingText from '../components/CascadingText';

interface HeroProps {
  onNavigate: (target: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const overlineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      overlineRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.3 }
    );

    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '+=0.3'
    );

    tl.fromTo(
      ctaRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.3'
    );

    tl.fromTo(
      chevronRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      '-=0.1'
    );

    // Continuous chevron bounce
    gsap.to(chevronRef.current, {
      y: 8,
      duration: 1.5,
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
      id="hero"
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* WebGL Shader Background */}
      <FormicaFoxShader />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 5,
          background: 'linear-gradient(to bottom, rgba(26,26,26,0.35) 0%, rgba(26,26,26,0.65) 100%)',
        }}
      />

      {/* Content */}
      <div
        className="relative text-center flex flex-col items-center"
        style={{
          zIndex: 10,
          maxWidth: '800px',
          padding: '0 clamp(24px, 5vw, 80px)',
        }}
      >
        {/* Overline */}
        <div
          ref={overlineRef}
          className="font-mono font-semibold uppercase"
          style={{
            fontSize: '11px',
            letterSpacing: '0.14em',
            color: '#D4A72C',
            opacity: 0,
            textShadow: '0 2px 40px rgba(0,0,0,0.4)',
          }}
        >
          AI-POWERED LECTURE NOTES
        </div>

        {/* Main Title with Cascading Text Reveal */}
        <div style={{
          fontSize: 'clamp(56px, 10vw, 120px)',
          lineHeight: 0.9,
          letterSpacing: '-0.04em',
          color: '#FFFFFF',
          textShadow: '0 2px 40px rgba(0,0,0,0.4)',
          marginTop: '16px',
        }}>
          <CascadingText
            text="NEVER MISS A WORD"
            delay={0.6}
            className="font-mono font-bold uppercase"
          />
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '18px',
            fontWeight: 400,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.85)',
            textShadow: '0 2px 40px rgba(0,0,0,0.4)',
            marginTop: '24px',
            maxWidth: '560px',
            opacity: 0,
          }}
        >
          igloo listens to your lectures and writes perfect notes — so you can focus on learning.
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          className="flex flex-wrap items-center justify-center"
          style={{ gap: '16px', marginTop: '36px', opacity: 0 }}
        >
          <button
            onClick={() => onNavigate('#live-demo')}
            className="font-mono font-semibold uppercase transition-all duration-200 focus:outline-none"
            style={{
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: '#2A2A2A',
              background: '#D4A72C',
              border: '2px solid #D4A72C',
              borderRadius: '100px',
              padding: '16px 36px',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.backgroundColor = '#E0B838';
              el.style.borderColor = '#E0B838';
              el.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.backgroundColor = '#D4A72C';
              el.style.borderColor = '#D4A72C';
              el.style.transform = 'scale(1)';
            }}
          >
            Try the Demo
          </button>
          <button
            onClick={() => onNavigate('#how-it-works')}
            className="font-mono font-semibold uppercase transition-all duration-200 focus:outline-none"
            style={{
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: '#FFFFFF',
              background: 'transparent',
              border: '2px solid rgba(255,255,255,0.5)',
              borderRadius: '100px',
              padding: '16px 36px',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = '#FFFFFF';
              el.style.backgroundColor = 'rgba(255,255,255,0.08)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = 'rgba(255,255,255,0.5)';
              el.style.backgroundColor = 'transparent';
            }}
          >
            Watch How It Works
          </button>
        </div>
      </div>

      {/* Bottom Chevron */}
      <div
        ref={chevronRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        style={{ zIndex: 10, opacity: 0 }}
      >
        <span
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '24px',
            display: 'block',
          }}
        >
          ↓
        </span>
      </div>
    </section>
  );
}
