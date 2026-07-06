import { ArrowRight } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';

/**
 * Full-width primary-colored CTA band near the end of the page.
 * Single strong headline + prominent appointment button.
 */
export function BookingCTA() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section
      id="booking"
      aria-label="Book an appointment"
      className="relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, var(--primary-color) 0%, #2f5fb0 100%)',
        color: '#ffffff',
      }}
    >
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 z-0 h-64 w-64 rounded-full"
        style={{ background: 'rgba(234,166,56,0.18)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 z-0 h-48 w-48 rounded-full"
        style={{ background: 'rgba(255,255,255,0.08)' }}
        aria-hidden="true"
      />

      <div className="container-x relative">
        <div
          ref={ref}
          className="reveal flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between md:py-16 lg:py-20"
        >
          <div className="max-w-2xl">
            <p
              className="mb-3 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: 'var(--secondary-color)' }}
                aria-hidden="true"
              />
              Same-day appointments available
            </p>
            <h2
              style={{
                color: '#ffffff',
                fontSize: 'clamp(28px, 4vw, 44px)',
                marginBottom: 0,
              }}
            >
              Ready to book your dental care session?
            </h2>
            <p
              className="mt-4 text-[16px] leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.82)', marginBottom: 0 }}
            >
              Pick a time that works for you. Our team will confirm your visit
              and send everything you need to feel prepared.
            </p>
          </div>

          <a
            href="#contact"
            className="btn btn-white btn-lg group"
            style={{ padding: '16px 32px', fontSize: 16 }}
          >
            Book Appointment
            <ArrowRight
              size={18}
              style={{ transition: 'transform 0.3s ease' }}
              className="group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>
    </section>
  );
}