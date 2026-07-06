import { useEffect, useRef } from 'react';

/**
 * Adds `is-visible` to the element when it scrolls into the viewport.
 * Used to drive the `.reveal` CSS animation without any extra libraries.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options?: {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (options?.once !== false) {
              observer.unobserve(entry.target);
            }
          } else if (options?.once === false) {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      {
        threshold: options?.threshold ?? 0.15,
        rootMargin: options?.rootMargin ?? '0px 0px -40px 0px',
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options?.threshold, options?.rootMargin, options?.once]);

  return ref;
}

/**
 * Observes a group of refs and toggles `is-visible` on each.
 * Useful when you want a section to fade in many children together.
 */
export function useRevealAll<T extends HTMLElement = HTMLDivElement>(
  options?: { threshold?: number; rootMargin?: string; once?: boolean },
) {
  const refs = useRef<Array<T | null>>([]);

  useEffect(() => {
    const nodes = refs.current.filter(Boolean) as T[];
    if (nodes.length === 0) return;

    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach((n) => n.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (options?.once !== false) observer.unobserve(entry.target);
          } else if (options?.once === false) {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      {
        threshold: options?.threshold ?? 0.15,
        rootMargin: options?.rootMargin ?? '0px 0px -40px 0px',
      },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [options?.threshold, options?.rootMargin, options?.once]);

  const setRef = (index: number) => (el: T | null) => {
    refs.current[index] = el;
  };

  return setRef;
}