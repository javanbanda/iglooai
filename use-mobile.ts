import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface NavigationProps {
  onNavigate: (target: string) => void;
}

export default function Navigation({ onNavigate }: NavigationProps) {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    gsap.fromTo(nav, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 });
  }, []);

  const navLinks = [
    { label: 'LIVE DEMO', target: '#live-demo' },
    { label: 'FEATURES', target: '#features' },
    { label: 'HOW IT WORKS', target: '#how-it-works' },
    { label: 'PRICING', target: '#pricing' },
  ];

  const handleNav = (target: string) => {
    onNavigate(target);
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between transition-all duration-300"
        style={{
          zIndex: 50,
          padding: '0 clamp(24px, 5vw, 80px)',
          backgroundColor: scrolled ? 'rgba(255,255,255,0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '2px solid #D6D0C4' : '2px solid transparent',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => handleNav('#hero')}
          className="flex items-center gap-2.5 focus:outline-none"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <svg width="32" height="28" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16 0C8.5 0 3 5 2 12h28C29 5 23.5 0 16 0zM2 14v10c0 2.2 1.8 4 4 4h20c2.2 0 4-1.8 4-4V14H2zm10 10c-1.1 0-2-.9-2-2v-4h8v4c0 1.1-.9 2-2 2h-4z"
              fill={scrolled ? '#2A2A2A' : '#FFFFFF'}
            />
          </svg>
          <span
            className="font-mono text-2xl font-semibold tracking-tight"
            style={{
              color: scrolled ? '#2A2A2A' : '#FFFFFF',
              fontFamily: "'IBM Plex Mono', monospace",
              letterSpacing: '-0.02em',
            }}
          >
            igloo
          </span>
        </button>

        {/* Center Nav Links - Desktop */}
        <div className="hidden md:flex items-center" style={{ gap: '28px' }}>
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => handleNav(link.target)}
              className="relative font-mono font-semibold uppercase transition-colors duration-200 focus:outline-none group"
              style={{
                fontSize: '11px',
                letterSpacing: '0.12em',
                color: scrolled ? '#2A2A2A' : '#FFFFFF',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 0',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = '#D4A72C';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = scrolled ? '#2A2A2A' : '#FFFFFF';
              }}
            >
              {link.label}
              <span
                className="absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 ease-out group-hover:w-full"
                style={{ backgroundColor: '#D4A72C' }}
              />
            </button>
          ))}
        </div>

        {/* Right Buttons - Desktop */}
        <div className="hidden md:flex items-center" style={{ gap: '12px' }}>
          <button
            className="font-mono font-semibold uppercase transition-all duration-200 focus:outline-none"
            style={{
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: scrolled ? '#2A2A2A' : '#FFFFFF',
              background: 'transparent',
              border: `2px solid ${scrolled ? '#B8942A' : 'rgba(255,255,255,0.5)'}`,
              borderRadius: '100px',
              padding: '8px 20px',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.backgroundColor = '#D4A72C';
              el.style.color = '#FFFFFF';
              el.style.borderColor = '#D4A72C';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.backgroundColor = 'transparent';
              el.style.color = scrolled ? '#2A2A2A' : '#FFFFFF';
              el.style.borderColor = scrolled ? '#B8942A' : 'rgba(255,255,255,0.5)';
            }}
          >
            Log In
          </button>
          <button
            className="font-mono font-semibold uppercase transition-all duration-200 focus:outline-none"
            style={{
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: '#FFFFFF',
              background: scrolled ? '#2A2A2A' : 'rgba(255,255,255,0.15)',
              border: `2px solid ${scrolled ? '#2A2A2A' : 'rgba(255,255,255,0.3)'}`,
              borderRadius: '100px',
              padding: '8px 20px',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.backgroundColor = '#D4A72C';
              el.style.borderColor = '#D4A72C';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.backgroundColor = scrolled ? '#2A2A2A' : 'rgba(255,255,255,0.15)';
              el.style.borderColor = scrolled ? '#2A2A2A' : 'rgba(255,255,255,0.3)';
            }}
          >
            Get Started
          </button>
        </div>

        {/* Hamburger - Mobile */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 focus:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span className="block w-5 h-0.5 transition-all duration-300" style={{ backgroundColor: scrolled ? '#2A2A2A' : '#FFFFFF', transform: mobileOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
          <span className="block w-5 h-0.5 transition-all duration-300" style={{ backgroundColor: scrolled ? '#2A2A2A' : '#FFFFFF', opacity: mobileOpen ? 0 : 1 }} />
          <span className="block w-5 h-0.5 transition-all duration-300" style={{ backgroundColor: scrolled ? '#2A2A2A' : '#FFFFFF', transform: mobileOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center gap-8 md:hidden"
          style={{
            zIndex: 49,
            backgroundColor: '#F5F0E6',
          }}
        >
          {navLinks.map((link, i) => (
            <button
              key={link.target}
              onClick={() => handleNav(link.target)}
              className="font-mono font-bold uppercase focus:outline-none"
              style={{
                fontSize: '28px',
                letterSpacing: '0.05em',
                color: '#2A2A2A',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                animation: `fadeInUp 0.4s ease forwards ${i * 0.1}s`,
                opacity: 0,
              }}
            >
              {link.label}
            </button>
          ))}
          <div className="flex gap-3 mt-4">
            <button
              className="font-mono font-semibold uppercase focus:outline-none"
              style={{
                fontSize: '11px',
                letterSpacing: '0.12em',
                color: '#2A2A2A',
                background: 'transparent',
                border: '2px solid #B8942A',
                borderRadius: '100px',
                padding: '10px 24px',
                cursor: 'pointer',
              }}
            >
              Log In
            </button>
            <button
              className="font-mono font-semibold uppercase focus:outline-none"
              style={{
                fontSize: '11px',
                letterSpacing: '0.12em',
                color: '#FFFFFF',
                background: '#2A2A2A',
                border: '2px solid #2A2A2A',
                borderRadius: '100px',
                padding: '10px 24px',
                cursor: 'pointer',
              }}
            >
              Get Started
            </button>
          </div>
          <style>{`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
