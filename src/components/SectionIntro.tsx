import { useReveal } from '../hooks/useReveal';

interface SectionIntroProps {
  eyebrow: string;
  heading: string;
  description?: string;
  align?: 'left' | 'center';
  /** When on dark backgrounds, the eyebrow uses the accent variant. */
  tone?: 'light' | 'dark';
  className?: string;
}

/**
 * Centered intro block used by Services, Team, FAQ, Testimonials, etc.
 * Handles a small reveal animation on scroll.
 */
export function SectionIntro({
  eyebrow,
  heading,
  description,
  align = 'center',
  tone = 'light',
  className = '',
}: SectionIntroProps) {
  const ref = useReveal<HTMLDivElement>();

  const isCenter = align === 'center';
  const eyebrowClass = tone === 'dark' ? 'eyebrow eyebrow--light' : 'eyebrow';
  const headingColor = tone === 'dark' ? '#ffffff' : undefined;
  const descColor = tone === 'dark' ? 'rgba(255,255,255,0.7)' : undefined;

  return (
    <div
      ref={ref}
      className={`reveal max-w-2xl ${isCenter ? 'mx-auto text-center' : ''} ${className}`}
    >
      <p className={eyebrowClass}>{eyebrow}</p>
      <h2 style={{ color: headingColor }}>{heading}</h2>
      {description ? (
        <p style={{ color: descColor, marginBottom: 0 }}>{description}</p>
      ) : null}
    </div>
  );
}