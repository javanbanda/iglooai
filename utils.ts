import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NoiseRipple from '../components/NoiseRipple';

gsap.registerPlugin(ScrollTrigger);

const TRANSCRIPT_TEXT = "Today we're discussing the fundamental theorem of calculus. This theorem connects the concept of a derivative with the concept of an integral. Remember that the derivative measures the rate of change, while the integral measures the accumulation of change. The first part of the theorem states that if f is continuous on [a, b], then the function F defined by F(x) = integral from a to x of f(t) dt is continuous on [a, b], differentiable on (a, b), and F'(x) = f(x). This means differentiation and integration are essentially inverse operations.";

const NOTES_DATA = [
  { text: '📌 Fundamental Theorem of Calculus', isHeader: true },
  { text: '• Connects derivatives and integrals', isHeader: false },
  { text: '• Part 1: F(x) = ∫ₐˣ f(t)dt → F\'(x) = f(x)', isHeader: false },
  { text: '• Key insight: differentiation and integration are inverse operations', isHeader: false, highlight: true },
  { text: '• F must be continuous on [a,b] and differentiable on (a,b)', isHeader: false },
];

const HIGHLIGHT_TERMS = ['Fundamental Theorem', 'derivatives', 'integrals', "F'(x) = f(x)", 'inverse operations'];

export default function LiveDemo() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const demoContainerRef = useRef<HTMLDivElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [transcriptWords, setTranscriptWords] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const words = TRANSCRIPT_TEXT.split(' ');
    setTranscriptWords(words);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    if (!section || !header) return;

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
    tl.fromTo(demoContainerRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3');

    return () => {
      tl.kill();
    };
  }, []);

  const startDemo = useCallback(() => {
    if (isPlaying) {
      // Restart
      setVisibleCount(0);
      setShowNotes(false);
    }
    setIsPlaying(true);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying || visibleCount >= transcriptWords.length) {
      if (isPlaying && visibleCount >= transcriptWords.length && transcriptWords.length > 0) {
        // Show notes after transcript finishes
        const timer = setTimeout(() => {
          setShowNotes(true);
          setIsPlaying(false);
        }, 500);
        return () => clearTimeout(timer);
      }
      return;
    }

    const timer = setTimeout(() => {
      setVisibleCount((prev) => prev + 1);
    }, 60);
    return () => clearTimeout(timer);
  }, [isPlaying, visibleCount, transcriptWords.length]);

  useEffect(() => {
    if (showNotes && notesRef.current) {
      gsap.fromTo(
        notesRef.current,
        { opacity: 0, y: 20, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, [showNotes]);

  const clearDemo = () => {
    setIsPlaying(false);
    setShowNotes(false);
    setVisibleCount(0);
  };

  const renderHighlightedText = (text: string) => {
    let result = text;
    HIGHLIGHT_TERMS.forEach((term) => {
      if (text.includes(term)) {
        result = result.replace(
          term,
          `<mark style="background-color:rgba(212,167,44,0.2);border-radius:4px;padding:0 4px;">${term}</mark>`
        );
      }
    });
    return result;
  };

  return (
    <section
      id="live-demo"
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
              marginBottom: '12px',
              opacity: 0,
            }}
          >
            LIVE DEMO
          </div>
          <h2
            className="title font-mono font-semibold uppercase"
            style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              color: '#2A2A2A',
              maxWidth: '600px',
              opacity: 0,
            }}
          >
            Experience the Magic
          </h2>
        </div>

        {/* Interactive Demo Container */}
        <div
          ref={demoContainerRef}
          className="mx-auto"
          style={{
            maxWidth: '800px',
            marginTop: '60px',
            background: '#FFFFFF',
            border: '2px solid #D6D0C4',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(42, 42, 42, 0.08)',
            padding: '32px',
            opacity: 0,
          }}
        >
          {/* Status Indicator */}
          <div className="flex items-center" style={{ gap: '8px' }}>
            <div
              className={isPlaying ? 'recording-dot' : ''}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: isPlaying ? '#D13A3A' : '#8A8A8A',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                color: isPlaying ? '#D13A3A' : '#8A8A8A',
              }}
            >
              {isPlaying ? 'Recording' : showNotes ? 'Finished' : 'Ready'}
            </span>
          </div>

          {/* Transcript Display */}
          <div
            ref={transcriptRef}
            style={{
              marginTop: '24px',
              height: '200px',
              overflowY: 'auto',
              background: '#EDE8DD',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #D6D0C4',
            }}
          >
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: 1.65,
                color: '#2A2A2A',
              }}
            >
              {transcriptWords.slice(0, visibleCount).map((word, i) => (
                <span
                  key={i}
                  style={{
                    animation: 'fadeInWord 0.3s ease forwards',
                  }}
                >
                  {word}{' '}
                </span>
              ))}
              {isPlaying && visibleCount < transcriptWords.length && (
                <span
                  style={{
                    display: 'inline-block',
                    width: '2px',
                    height: '16px',
                    backgroundColor: '#D4A72C',
                    marginLeft: '2px',
                    verticalAlign: 'middle',
                    animation: 'blink 1s infinite',
                  }}
                />
              )}
            </p>
            <style>{`
              @keyframes fadeInWord {
                from { opacity: 0; transform: translateY(4px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
              }
            `}</style>
          </div>

          {/* Generated Notes Preview */}
          {showNotes && (
            <div
              ref={notesRef}
              style={{
                marginTop: '24px',
                background: '#FFFFFF',
                border: '2px solid #D4A72C',
                borderRadius: '12px',
                padding: '20px',
                opacity: 0,
              }}
            >
              <div
                className="font-mono font-semibold uppercase"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  color: '#D4A72C',
                  marginBottom: '12px',
                }}
              >
                Generated Notes
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {NOTES_DATA.map((note, i) => (
                  <p
                    key={i}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '15px',
                      fontWeight: note.isHeader ? 600 : 400,
                      lineHeight: 1.7,
                      color: '#2A2A2A',
                    }}
                    dangerouslySetInnerHTML={{ __html: renderHighlightedText(note.text) }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex items-center justify-center" style={{ gap: '12px', marginTop: '32px' }}>
            <button
              onClick={startDemo}
              className="font-mono font-semibold uppercase transition-all duration-200 focus:outline-none"
              style={{
                fontSize: '11px',
                letterSpacing: '0.12em',
                color: '#2A2A2A',
                background: '#D4A72C',
                border: '2px solid #D4A72C',
                borderRadius: '100px',
                padding: '12px 28px',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.backgroundColor = '#E0B838';
                el.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.backgroundColor = '#D4A72C';
                el.style.transform = 'scale(1)';
              }}
            >
              {visibleCount > 0 && !isPlaying ? 'Restart Demo' : 'Start Demo'}
            </button>
            <button
              onClick={clearDemo}
              className="font-mono font-semibold uppercase transition-all duration-200 focus:outline-none"
              style={{
                fontSize: '11px',
                letterSpacing: '0.12em',
                color: '#2A2A2A',
                background: 'transparent',
                border: '2px solid #D6D0C4',
                borderRadius: '100px',
                padding: '12px 28px',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2A2A2A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#D6D0C4';
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* App Mockup with Noise Ripple */}
        <div className="mx-auto hidden md:block" style={{ maxWidth: '720px', marginTop: '60px', aspectRatio: '16/9', borderRadius: '16px', boxShadow: '0 20px 60px rgba(42, 42, 42, 0.12)', overflow: 'hidden' }}>
          <NoiseRipple
            imageSrc="/images/app-mockup.jpg"
            className="w-full h-full"
          />
        </div>
        <div className="mx-auto md:hidden" style={{ maxWidth: '720px', marginTop: '60px' }}>
          <img
            src="/images/app-mockup.jpg"
            alt="igloo app interface showing live transcription and structured notes"
            className="w-full"
            style={{
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(42, 42, 42, 0.12)',
            }}
          />
        </div>
      </div>
    </section>
  );
}
