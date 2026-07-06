import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Logo } from './Logo';
import { footerColumns } from '../data/content';

/**
 * Dark footer for Lerio Dental Center.
 * Includes brand block, link columns, contact info, and a legal/subfooter bar.
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="bg-dark-2 text-white"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="container-x py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          {/* Brand block */}
          <div className="lg:col-span-4">
            <Logo variant="light" />
            <p
              className="mt-5 max-w-sm text-[15px] leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              Gentle, comprehensive dental care for the whole family in
              Dumaguete City — led by Dr. Myrine Lerio, Dr. Francine Nicole
              Lerio, and Dr. Yumi Sayade Alquisalas.
            </p>
            <ul className="mt-6 flex items-center gap-3">
              {[
                { Icon: Facebook, label: 'Facebook' },
                { Icon: Instagram, label: 'Instagram' },
                { Icon: MessageCircle, label: 'Messenger' },
              ].map(({ Icon, label }) => (
                <li key={label}>
                  <span
                    aria-label={`Lerio Dental Center on ${label}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.75)',
                    }}
                  >
                    <Icon size={16} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h4
                className="mb-5 text-[15px] font-semibold uppercase tracking-[0.14em]"
                style={{ color: '#ffffff' }}
              >
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-[14.5px] font-medium transition-colors duration-300 hover:text-white"
                      style={{ color: 'rgba(255,255,255,0.65)' }}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="lg:col-span-4">
            <h4
              className="mb-5 text-[15px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: '#ffffff' }}
            >
              Visit · Call · Email
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <span
                  className="mt-0.5 inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    color: 'var(--secondary-color)',
                  }}
                  aria-hidden="true"
                >
                  <MapPin size={16} />
                </span>
                <span
                  className="text-[14.5px] leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.75)' }}
                >
                  Dr. V. Locsin Street<br />
                  Dumaguete City, Negros Oriental
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="mt-0.5 inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    color: 'var(--secondary-color)',
                  }}
                  aria-hidden="true"
                >
                  <Phone size={16} />
                </span>
                <div className="flex flex-col gap-0.5">
                  <a
                    href="tel:+639365422515"
                    className="text-[14.5px] font-medium transition-colors hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.75)' }}
                  >
                    TM · 0936-542-2515
                  </a>
                  <a
                    href="tel:+639924744274"
                    className="text-[14.5px] font-medium transition-colors hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.75)' }}
                  >
                    DITO · 0992-474-4274
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className="mt-0.5 inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    color: 'var(--secondary-color)',
                  }}
                  aria-hidden="true"
                >
                  <Mail size={16} />
                </span>
                <a
                  href="mailto:contact.leriodentalcenter@gmail.com"
                  className="text-[14.5px] font-medium transition-colors hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.75)' }}
                >
                  contact.leriodentalcenter@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Subfooter / legal bar */}
      <div
        className="border-t"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className="container-x py-6 text-center text-[13px]">
          <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 0 }}>
            © {year} Lerio Dental Center · Dumaguete City, Negros Oriental. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}