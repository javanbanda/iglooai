import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LINK_GROUPS = [
  {
    title: 'Product',
    links: ['Live Demo', 'Features', 'Pricing', 'Changelog'],
  },
  {
    title: 'Company',
    links: ['About', 'Blog', 'Careers', 'Contact'],
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'Security'],
  },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const upperRef = useRef<HTMLDivElement>(null);
  const lowerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const upper = upperRef.current;
    const lower = lowerRef.current;
    if (!footer || !upper || !lower) return;

    const logoArea = upper.querySelector('.logo-area');
    const linkGroups = upper.querySelectorAll('.link-group');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(logoArea, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
    tl.fromTo(linkGroups, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power3.out' }, '-=0.4');
    tl.fromTo(lower, { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.2');

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      style={{
        backgroundColor: '#2A2A2A',
        padding: '80px clamp(24px, 5vw, 80px) 40px',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Upper Footer */}
        <div
          ref={upperRef}
          className="flex flex-col lg:flex-row justify-between"
          style={{ gap: '48px' }}
        >
          {/* Left - Brand */}
          <div className="logo-area" style={{ opacity: 0 }}>
            {/* Logo */}
            <div className="flex items-center" style={{ gap: '10px' }}>
              <svg width="32" height="28" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16 0C8.5 0 3 5 2 12h28C29 5 23.5 0 16 0zM2 14v10c0 2.2 1.8 4 4 4h20c2.2 0 4-1.8 4-4V14H2zm10 10c-1.1 0-2-.9-2-2v-4h8v4c0 1.1-.9 2-2 2h-4z"
                  fill="#FFFFFF"
                />
              </svg>
              <span
                className="font-mono font-semibold"
                style={{
                  fontSize: '24px',
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                }}
              >
                igloo
              </span>
            </div>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 400,
                color: '#8A8A8A',
                marginTop: '16px',
              }}
            >
              AI-powered notes for smarter students.
            </p>

            {/* Social Icons */}
            <div className="flex" style={{ gap: '16px', marginTop: '24px' }}>
              {/* Twitter/X */}
              <a
                href="#"
                className="transition-colors duration-200"
                style={{ color: '#8A8A8A' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#D4A72C'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#8A8A8A'; }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="#"
                className="transition-colors duration-200"
                style={{ color: '#8A8A8A' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#D4A72C'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#8A8A8A'; }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="5" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              {/* GitHub */}
              <a
                href="#"
                className="transition-colors duration-200"
                style={{ color: '#8A8A8A' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#D4A72C'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#8A8A8A'; }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="#"
                className="transition-colors duration-200"
                style={{ color: '#8A8A8A' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#D4A72C'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#8A8A8A'; }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right - Link Groups */}
          <div className="flex flex-wrap" style={{ gap: '60px' }}>
            {LINK_GROUPS.map((group, i) => (
              <div key={i} className="link-group" style={{ opacity: 0 }}>
                <h4
                  className="font-mono font-semibold uppercase"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    color: '#FFFFFF',
                    marginBottom: '16px',
                  }}
                >
                  {group.title}
                </h4>
                <ul className="flex flex-col" style={{ gap: '10px', listStyle: 'none', padding: 0, margin: 0 }}>
                  {group.links.map((link, j) => (
                    <li key={j}>
                      <a
                        href="#"
                        className="transition-colors duration-200"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '14px',
                          fontWeight: 400,
                          color: '#8A8A8A',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#8A8A8A'; }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Lower Footer */}
        <div
          ref={lowerRef}
          className="flex flex-col sm:flex-row justify-between items-center"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '24px',
            marginTop: '60px',
            opacity: 0,
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              color: 'rgba(138, 138, 138, 0.6)',
            }}
          >
            © 2025 igloo. Made by Javan Ban. All rights reserved.
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              color: 'rgba(138, 138, 138, 0.6)',
              marginTop: '8px',
            }}
          >
            Made with care for students everywhere
          </span>
        </div>
      </div>
    </footer>
  );
}
