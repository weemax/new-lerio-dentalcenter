import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { Logo } from './Logo';
import { footerColumns } from '../data/content';

/**
 * Dark footer with brand block, link columns, contact info and a
 * legal/subfooter bar.
 */
export function Footer() {
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
              Premium family dental care that feels calm, modern, and personal.
              We’re proud to serve our community with the same standard of
              gentle dentistry we’d want for our own families.
            </p>
            <ul className="mt-6 flex items-center gap-3">
              {[
                { Icon: Facebook, label: 'Facebook' },
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Linkedin, label: 'LinkedIn' },
              ].map(({ Icon, label }) => (
                <li key={label}>
                  <a
                    href="#"
                    aria-label={`Dentia on ${label}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.75)',
                    }}
                  >
                    <Icon size={16} />
                  </a>
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
              Contact
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
                  2486 Maple Avenue, Suite 204<br />
                  Brookfield, NY 11201
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
                <a
                  href="tel:+1123456789"
                  className="text-[14.5px] font-medium transition-colors hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.75)' }}
                >
                  +1 (123) 456-789
                </a>
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
                  href="mailto:contact@dentiaclinic.com"
                  className="text-[14.5px] font-medium transition-colors hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.75)' }}
                >
                  contact@dentiaclinic.com
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
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-[13px] sm:flex-row sm:gap-0">
          <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 0 }}>
            © {new Date().getFullYear()} Dentia Dental Clinic. All rights reserved.
          </p>
          <ul className="flex items-center gap-6">
            <li>
              <a
                href="#"
                className="transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                Terms &amp; Conditions
              </a>
            </li>
            <li>
              <a
                href="#"
                className="transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}