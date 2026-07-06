import { Link } from 'lucide-react';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

/**
 * Brand wordmark. Uses the Urbanist display font for the logotype.
 * `light` is for dark backgrounds, `dark` for light backgrounds.
 */
export function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const text = variant === 'light' ? '#ffffff' : 'var(--heading-font-color)';
  const accent = 'var(--secondary-color)';
  const primary = 'var(--primary-color)';

  return (
    <a
      href="#top"
      aria-label="Dentia home"
      className={`inline-flex items-center gap-2 ${className}`}
      style={{ width: 'var(--logo-width)' }}
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
        <Link size={20} strokeWidth={2.5} />
      </span>
      <span
        style={{
          fontFamily: 'var(--heading-font)',
          fontWeight: 800,
          fontSize: 24,
          letterSpacing: '-0.02em',
          color: text,
          lineHeight: 1,
        }}
      >
        Dent<span style={{ color: accent }}>ia</span>
      </span>
    </a>
  );
}