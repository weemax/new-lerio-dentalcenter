import { useEffect, useState } from 'react';

interface UseScrollPositionOptions {
  threshold?: number;
}

/**
 * Returns whether the window has scrolled past `threshold` pixels.
 * Used by the header to swap from transparent → solid white.
 */
export function useScrolledPast(options: UseScrollPositionOptions = {}) {
  const { threshold = 40 } = options;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}