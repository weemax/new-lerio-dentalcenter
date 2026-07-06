import { Sparkles } from 'lucide-react';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

/**
 * Brand wordmark for Lerio Dental Center.
 * Uses the Urbanist display font for the logotype with a tooth/dental accent mark.
 * `light` is for dark backgrounds, `dark` for light backgrounds.
 */
export function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const text = variant === 'light' ? '#ffffff' : 'var(--heading-font-color)';
  const accent = 'var(--secondary-color)';
  const primary = 'var(--primary-color)';

  return (
    <a
      href="#top"
      aria-label="Lerio Dental Center — home"
      className={`inline-flex items-center gap-2.5 ${className}`}
      style={{ width: 'auto', maxWidth: 'var(--logo-width)' }}
    >
      <span
        className="inline-flex items-center justify-center"
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: primary,
          color: '#fff',
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        <Sparkles size={20} strokeWidth={2.5} />
      </span>
      <span
        style={{
          fontFamily: 'var(--heading-font)',
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: '-0.02em',
          color: text,
          lineHeight: 1.05,
          whiteSpace: 'nowrap',
        }}
      >
        Lerio<span style={{ color: accent }}>.</span>{' '}
        <span
          style={{
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: text,
            opacity: 0.85,
          }}
        >
          Dental Center
        </span>
      </span>
    </a>
  );
}