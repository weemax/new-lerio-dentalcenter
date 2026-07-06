import { useEffect, useState } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { heroSlides } from '../data/content';

/**
 * Full-viewport hero with rotating slides, soft dark gradient,
 * dual CTAs and a Google-rating trust row.
 */
export function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % heroSlides.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      aria-label="Hero"
      className="relative w-full overflow-hidden"
      style={{ minHeight: 'min(100vh, 880px)' }}
    >
      {/* Background slides */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, i) => (
          <div
            key={slide.image}
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
            style={{ opacity: i === index ? 1 : 0 }}
            aria-hidden={i !== index}
          >
            <img
              src={slide.image}
              alt=""
              className="h-full w-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'auto'}
            />
          </div>
        ))}
        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(7, 22, 48, 0.92) 0%, rgba(0, 10, 91, 0.78) 45%, rgba(0, 10, 91, 0.55) 100%)',
          }}
        />
        {/* Bottom fade for content strip transition */}
        <div
          className="absolute inset-x-0 bottom-0 h-32"
          style={{
            background:
              'linear-gradient(180deg, rgba(7,22,48,0) 0%, rgba(7,22,48,0.6) 100%)',
          }}
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex min-h-[inherit] items-center">
        <div className="container-x w-full pt-32 pb-20 lg:pt-40 lg:pb-32">
          <div className="max-w-2xl">
            <p
              className="reveal is-visible mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-semibold uppercase tracking-[0.16em]"
              style={{
                color: '#ffffff',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: 'var(--secondary-color)' }}
                aria-hidden="true"
              />
              {heroSlides[index].eyebrow}
            </p>

            <h1
              key={heroSlides[index].headline}
              className="hero-fade"
              style={{ color: '#ffffff', maxWidth: 800 }}
            >
              {heroSlides[index].headline}
            </h1>

            <p
              className="hero-fade mb-8 text-[17px] leading-relaxed"
              style={{
                color: 'rgba(255, 255, 255, 0.78)',
                maxWidth: 560,
              }}
            >
              Trusted family dental care in Dumaguete City — led by Dr. Myrine
              Lerio, Dr. Francine Nicole Lerio, and Dr. Yumi Sayade Alquisalas.
              We combine expert clinical skills with a calm, patient-focused
              experience.
            </p>

            <div className="hero-fade flex flex-wrap items-center gap-3">
              <a href="#booking" className="btn btn-primary btn-lg">
                Book Appointment <ArrowRight size={18} />
              </a>
              <a href="tel:+639365422515" className="btn btn-outline-light btn-lg">
                Call 0936-542-2515
              </a>
            </div>

            {/* Trust row */}
            <div
              className="hero-fade mt-10 flex flex-wrap items-center gap-5 rounded-2xl px-5 py-4 sm:gap-7 sm:px-6"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
                width: 'fit-content',
              }}
            >
              <span
                className="text-[12px] font-semibold uppercase tracking-[0.16em]"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                Google Rating
              </span>
              <span
                className="text-[28px] font-extrabold leading-none"
                style={{
                  color: '#ffffff',
                  fontFamily: 'var(--heading-font)',
                }}
              >
                5.0
              </span>
              <span className="flex items-center gap-1" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill="var(--secondary-color)"
                    stroke="var(--secondary-color)"
                  />
                ))}
              </span>
              <span
                className="text-[14px] font-medium"
                style={{ color: 'rgba(255,255,255,0.85)' }}
              >
                Based on Google Reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-2 sm:bottom-8">
        {heroSlides.map((s, i) => (
          <button
            key={s.image}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === index ? 32 : 8,
              background:
                i === index ? 'var(--secondary-color)' : 'rgba(255,255,255,0.45)',
            }}
          />
        ))}
      </div>
    </section>
  );
}