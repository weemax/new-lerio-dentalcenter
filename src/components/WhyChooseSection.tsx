import type { LucideIcon } from 'lucide-react';
import { Section } from './Section';
import { benefits } from '../data/content';
import { useReveal } from '../hooks/useReveal';

/**
 * Two-column editorial section: copy + 2x2 benefit grid on the left,
 * staggered image composition on the right.
 */
export function WhyChooseSection() {
  return (
    <Section bg="white" reveal>
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Left content */}
        <div>
          <p className="eyebrow">Why Choose Our Dental Care</p>
          <h2>Exceptional Service With a Personal Touch</h2>
          <p className="text-[16px] leading-relaxed text-body">
            We pair modern dental technology with a calm, thoughtful experience
            — so every visit feels less like a procedure and more like trusted,
            ongoing care for the people you love.
          </p>

          <div className="my-8 h-px w-full bg-bg-grey" aria-hidden="true" />

          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <BenefitItem key={b.title} index={i} title={b.title} description={b.description} icon={Icon} />
              );
            })}
          </ul>
        </div>

        {/* Right image composition */}
        <ImageComposition />
      </div>
    </Section>
  );
}

interface BenefitItemProps {
  title: string;
  description: string;
  icon: LucideIcon;
  index: number;
}

function BenefitItem({ title, description, icon: Icon, index }: BenefitItemProps) {
  const ref = useReveal<HTMLLIElement>();
  return (
    <li
      ref={ref}
      className="reveal flex gap-4"
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <span
        className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl"
        style={{ background: 'rgba(74, 124, 210, 0.1)' }}
        aria-hidden="true"
      >
        <Icon size={22} color="var(--primary-color)" strokeWidth={1.8} />
      </span>
      <div>
        <h4 className="mb-1 text-[18px]" style={{ marginBottom: 4 }}>
          {title}
        </h4>
        <p className="text-[14.5px] leading-relaxed text-body" style={{ marginBottom: 0 }}>
          {description}
        </p>
      </div>
    </li>
  );
}

function ImageComposition() {
  const ref1 = useReveal<HTMLDivElement>();
  const ref2 = useReveal<HTMLDivElement>();
  const ref3 = useReveal<HTMLDivElement>();

  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      {/* Large primary image */}
      <div
        ref={ref1}
        className="reveal relative overflow-hidden rounded-[20px]"
        style={{
          aspectRatio: '4 / 5',
          boxShadow: '0 30px 60px -25px rgba(15, 28, 65, 0.35)',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80"
          alt="Dentist reviewing a patient scan"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Smaller secondary image */}
      <div
        ref={ref2}
        className="reveal absolute -bottom-8 -left-6 hidden w-[50%] overflow-hidden rounded-[20px] border-8 border-white sm:block"
        style={{
          aspectRatio: '5 / 6',
          boxShadow: '0 25px 50px -22px rgba(15, 28, 65, 0.4)',
          transitionDelay: '120ms',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=600&q=80"
          alt="Modern dental treatment room"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Stat badge */}
      <div
        ref={ref3}
        className="reveal absolute -right-4 top-10 hidden flex-col items-center justify-center rounded-2xl bg-white px-5 py-4 shadow-2xl sm:flex"
        style={{
          boxShadow: '0 25px 50px -22px rgba(15, 28, 65, 0.4)',
          transitionDelay: '240ms',
        }}
        aria-hidden="true"
      >
        <span
          className="text-[28px] font-extrabold leading-none"
          style={{ color: 'var(--primary-color)', fontFamily: 'var(--heading-font)' }}
        >
          98%
        </span>
        <span
          className="mt-1 text-[12px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: 'var(--body-font-color)' }}
        >
          Patient Satisfaction
        </span>
      </div>
    </div>
  );
}