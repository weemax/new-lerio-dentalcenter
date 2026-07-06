import { Clock, Mail, Phone } from 'lucide-react';
import { infoStrip } from '../data/content';

const iconMap = {
  phone: Phone,
  clock: Clock,
  mail: Mail,
} as const;

/**
 * Dark contact-info band directly under the hero.
 * Three columns: phone, hours, email.
 */
export function InfoStrip() {
  return (
    <section
      aria-label="Contact info"
      className="relative z-10 bg-dark-1 text-white"
      style={{
        marginTop: '-2px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="container-x">
        <ul className="grid grid-cols-1 divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
          {infoStrip.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <li
                key={item.title}
                className="flex items-center gap-4 py-6 md:py-8 md:px-6"
              >
                <span
                  className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                  aria-hidden="true"
                >
                  <Icon size={20} color="var(--secondary-color)" />
                </span>
                <div className="min-w-0">
                  <p
                    className="text-[13px] font-semibold uppercase tracking-[0.14em]"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="mt-1 truncate text-[16px] font-semibold text-white sm:text-[17px]"
                    style={{ fontFamily: 'var(--heading-font)' }}
                  >
                    {item.value}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}