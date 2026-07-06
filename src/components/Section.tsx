import type { CSSProperties, ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  /** Background variant for quick theming. */
  bg?: 'white' | 'light' | 'even' | 'odd' | 'grey' | 'dark-1' | 'dark-2' | 'gradient';
  /** Render as <section> (default) or another element. */
  as?: 'section' | 'div' | 'article' | 'footer' | 'header';
  /** Pad top/bottom using the design rhythm (default true). */
  pad?: boolean;
  /** Add a reveal animation to a wrapper div. */
  reveal?: boolean;
  ariaLabel?: string;
}

const bgClass: Record<NonNullable<SectionProps['bg']>, string> = {
  white: 'bg-white',
  light: 'bg-light',
  even: 'bg-even',
  odd: 'bg-odd',
  grey: 'bg-grey',
  'dark-1': 'bg-dark-1 text-white',
  'dark-2': 'bg-dark-2 text-white',
  gradient: 'bg-gradient-tint',
};

/**
 * Page section wrapper with consistent vertical rhythm and background palette.
 * Centralizes the design tokens so individual components stay clean.
 */
export function Section({
  id,
  className = '',
  children,
  bg = 'white',
  as: Tag = 'section',
  pad = true,
  reveal = false,
  ariaLabel,
}: SectionProps) {
  const ref = useReveal<HTMLDivElement>();
  const baseStyle: CSSProperties = {};
  if (bg === 'dark-1' || bg === 'dark-2') {
    baseStyle.color = '#ffffff';
  }

  const sectionClasses = [
    bgClass[bg],
    pad ? 'section-pad' : '',
    'relative',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <div className="container-x">
      <div ref={reveal ? ref : undefined} className={reveal ? 'reveal' : ''}>
        {children}
      </div>
    </div>
  );

  return (
    <Tag id={id} className={sectionClasses} style={baseStyle} aria-label={ariaLabel}>
      {inner}
    </Tag>
  );
}