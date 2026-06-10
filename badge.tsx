import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CascadingTextProps {
  text: string;
  delay?: number;
  className?: string;
}

export default function CascadingText({ text, delay = 0.6, className = '' }: CascadingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chars = container.querySelectorAll<HTMLSpanElement>('.cascade-char');

    gsap.fromTo(
      chars,
      {
        opacity: 0,
        y: 60,
        rotateX: -80,
        filter: 'blur(8px)',
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: 'blur(0px)',
        stagger: 0.03,
        duration: 0.8,
        ease: 'power3.out',
        delay,
      }
    );

    return () => {
      gsap.killTweensOf(chars);
    };
  }, [delay]);

  const characters = text.split('').map((char, i) => (
    <span
      key={i}
      className="cascade-char inline-block"
      style={{
        opacity: 0,
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity, filter',
      }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
    >
      {characters}
    </div>
  );
}
