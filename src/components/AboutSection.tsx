import { Check, ArrowRight } from 'lucide-react';
import { Section } from './Section';
import { aboutChecklist } from '../data/content';
import { useReveal } from '../hooks/useReveal';

/**
 * Two-column About section: image collage on the left, content + checklist on the right.
 */
export function AboutSection() {
  const img1Ref = useReveal<HTMLDivElement>();
  const img2Ref = useReveal<HTMLDivElement>();
  const contentRef = useReveal<HTMLDivElement>();

  return (
    <Section id="about" bg="white" reveal>
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Image collage */}
        <div className="relative overflow-hidden">
          <div
            ref={img1Ref}
            className="reveal relative overflow-hidden rounded-[20px] shadow-2xl"
            style={{
              aspectRatio: '4 / 5',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=900&q=80"
              alt="Friendly dentist with patient in modern clinic"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            {/* Decorative accent ribbon */}
            <div
              className="absolute -left-4 top-8 hidden h-24 w-24 rounded-2xl sm:block"
              style={{
                background: 'var(--secondary-color)',
                zIndex: -1,
                opacity: 0.85,
              }}
              aria-hidden="true"
            />
          </div>

          <div
            ref={img2Ref}
            className="reveal absolute bottom-6 right-6 hidden w-[55%] overflow-hidden rounded-[20px] border-8 border-white shadow-2xl sm:block"
            style={{
              aspectRatio: '5 / 6',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80"
              alt="Dental professional preparing equipment"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Floating badge */}
          <div
            className="absolute bottom-4 left-4 z-10 hidden rounded-2xl bg-white px-5 py-4 shadow-2xl sm:flex sm:items-center sm:gap-4"
            style={{
              boxShadow: '0 25px 50px -22px rgba(15, 28, 65, 0.4)',
            }}
            aria-hidden="true"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: 'var(--bg-light)' }}
            >
              <Check size={22} color="var(--primary-color)" strokeWidth={3} />
            </div>
            <div>
              <p
                className="text-[20px] font-extrabold leading-none"
                style={{ color: 'var(--heading-font-color)', fontFamily: 'var(--heading-font)' }}
              >
                15+
              </p>
              <p className="mt-1 text-[13px] font-medium text-body">Years of trusted care</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="reveal lg:pl-6">
          <p className="eyebrow">About Us</p>
          <h2>Professionals and Personalized Dental Excellence</h2>
          <p className="text-[16px] leading-relaxed text-body">
            At Lerio Dental Center, we believe great dentistry begins with
            listening. Our team builds calm, family-focused treatment plans
            around the real needs of every patient — from first tooth to
            confident smile.
          </p>

          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {aboutChecklist.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span
                  className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ background: 'rgba(74, 124, 210, 0.12)' }}
                  aria-hidden="true"
                >
                  <Check size={14} color="var(--primary-color)" strokeWidth={3} />
                </span>
                <span className="text-[15px] font-medium" style={{ color: 'var(--heading-font-color)' }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <a href="#contact" className="btn btn-primary btn-lg mt-8">
            Schedule a Visit <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </Section>
  );
}