import { Section } from './Section';
import { stats } from '../data/content';
import { useCountUp, useInView } from '../hooks/useCountUp';

function formatNumber(n: number) {
  if (n >= 1000) return n.toLocaleString('en-US');
  return String(n);
}

/**
 * Dark band with animated stat counters. Counts trigger when the section enters view.
 */
export function StatsBand() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <Section bg="dark-2" pad={false}>
      <div ref={ref} className="py-16 md:py-20">
        <ul className="grid grid-cols-2 gap-y-10 md:grid-cols-4">
          {stats.map((s, i) => (
            <StatCell
              key={s.label}
              index={i}
              value={s.value}
              suffix={s.suffix}
              label={s.label}
              start={inView}
            />
          ))}
        </ul>
      </div>
    </Section>
  );
}

interface StatCellProps {
  value: number;
  suffix: string;
  label: string;
  start: boolean;
  index: number;
}

function StatCell({ value, suffix, label, start, index }: StatCellProps) {
  const n = useCountUp(value, start);
  return (
    <li
      className="flex flex-col items-center text-center transition-opacity duration-700"
      style={{
        opacity: start ? 1 : 0,
        transform: start ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <span
        className="flex items-baseline"
        style={{
          color: '#ffffff',
          fontFamily: 'var(--heading-font)',
          fontWeight: 700,
          fontSize: 'clamp(36px, 5vw, 56px)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        {formatNumber(n)}
        <span style={{ color: 'var(--secondary-color)' }}>{suffix}</span>
      </span>
      <span
        className="mt-3 text-[13px] font-semibold uppercase tracking-[0.16em]"
        style={{ color: 'rgba(255,255,255,0.65)' }}
      >
        {label}
      </span>
    </li>
  );
}