import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Section } from './Section';
import { SectionIntro } from './SectionIntro';
import { TestimonialCard } from './TestimonialCard';
import { testimonials } from '../data/content';

/**
 * Testimonials section: a horizontal scroll track on mobile,
 * a 4-up grid on desktop, with prev/next buttons that scroll the track.
 */
export function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-testimonial-card]');
    const distance = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * distance, behavior: 'smooth' });
  };

  return (
    <Section id="testimonials" bg="light">
      <div className="mb-10 flex flex-col items-center text-center lg:mb-12">
        <SectionIntro
          eyebrow="Testimonials"
          heading="Our Happy Customers"
          description="Real words from real patients. We earn every review by listening carefully and treating people the way we’d want our own families treated."
        />
      </div>

      <div className="relative">
        <div
          ref={trackRef}
          className="scroll-track -mx-4 flex gap-6 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 xl:grid-cols-4"
        >
          {testimonials.slice(0, 4).map((t, i) => (
            <div
              key={t.name}
              data-testimonial-card
              className="w-[85%] flex-shrink-0 sm:w-[60%] lg:w-auto"
            >
              <TestimonialCard testimonial={t} index={i} />
            </div>
          ))}
        </div>

        {/* Slider controls (visible only on mobile/tablet where horizontal scroll is enabled) */}
        <div className="mt-6 flex items-center justify-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Previous testimonial"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-heading shadow-md transition-colors hover:bg-primary hover:text-white"
            style={{ boxShadow: '0 10px 25px -15px rgba(15, 28, 65, 0.4)' }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Next testimonial"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-heading shadow-md transition-colors hover:bg-primary hover:text-white"
            style={{ boxShadow: '0 10px 25px -15px rgba(15, 28, 65, 0.4)' }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </Section>
  );
}