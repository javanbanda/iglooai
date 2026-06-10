import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import LiveDemo from './sections/LiveDemo';
import Features from './sections/Features';
import HowItWorks from './sections/HowItWorks';
import DemoInterface from './sections/DemoInterface';
import Testimonials from './sections/Testimonials';
import Footer from './sections/Footer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  const handleNavigate = (target: string) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -64 });
    }
  };

  return (
    <div>
      <Navigation onNavigate={handleNavigate} />
      <Hero onNavigate={handleNavigate} />
      <LiveDemo />
      <Features />
      <HowItWorks />
      <DemoInterface />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default App;
