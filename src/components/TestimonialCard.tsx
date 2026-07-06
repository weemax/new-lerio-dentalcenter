import { Quote } from 'lucide-react';
import type { Testimonial } from '../data/content';
import { useReveal } from '../hooks/useReveal';

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

/**
 * Single testimonial card with quote icon, copy, patient name and avatar.
 * Used inside the TestimonialsSection horizontal scroll track / grid.
 */
export function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <article
      ref={ref}
      className="reveal card-surface flex h-full flex-col justify-between p-8"
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div>
        <Quote
          size={32}
          color="var(--secondary-color)"
          strokeWidth={2}
          style={{ marginBottom: 16 }}
        />
        <p
          className="text-[16px] leading-relaxed"
          style={{
            color: 'var(--heading-font-color)',
            fontFamily: 'var(--heading-font)',
            fontWeight: 500,
          }}
        >
          “{testimonial.quote}”
        </p>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <img
          src={testimonial.avatar}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
          style={{ border: '2px solid var(--bg-light)' }}
        />
        <div>
          <p
            className="text-[15px] font-semibold"
            style={{ color: 'var(--heading-font-color)', marginBottom: 0 }}
          >
            {testimonial.name}
          </p>
          <p
            className="text-[13px] font-medium"
            style={{ color: 'var(--primary-color)', marginBottom: 0 }}
          >
            {testimonial.role}
          </p>
        </div>
      </div>
    </article>
  );
}