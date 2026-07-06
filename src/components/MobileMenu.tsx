import { useEffect, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import type { NavItem } from '../data/content';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
}

/**
 * Full-screen mobile menu with accordion-style nested dropdowns.
 * Locks body scroll while open; closes on Escape.
 */
export function MobileMenu({ open, onClose, items }: MobileMenuProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-[60] flex flex-col bg-white"
    >
      <div className="container-x flex items-center justify-between py-4 border-b border-bg-grey">
        <span
          className="text-[20px] font-extrabold tracking-tight"
          style={{
            fontFamily: 'var(--heading-font)',
            color: 'var(--heading-font-color)',
          }}
        >
          Menu
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-heading transition-colors hover:bg-bg-light"
        >
          <X size={22} />
        </button>
      </div>

      <nav className="container-x flex-1 overflow-y-auto py-4">
        <ul className="flex flex-col">
          {items.map((item) => {
            const hasDropdown = !!item.dropdown?.length;
            const isOpen = openSection === item.label;
            return (
              <li key={item.label} className="border-b border-bg-grey">
                {hasDropdown ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setOpenSection(isOpen ? null : item.label)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between py-4 text-left text-[16px] font-semibold text-heading"
                    >
                      {item.label}
                      <ChevronDown
                        size={18}
                        style={{
                          transition: 'transform 0.25s ease',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                        }}
                      />
                    </button>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateRows: isOpen ? '1fr' : '0fr',
                        transition: 'grid-template-rows 0.3s ease',
                      }}
                    >
                      <div className="overflow-hidden">
                        <ul className="pb-3">
                          {item.dropdown!.map((sub) => (
                            <li key={sub.label}>
                              <a
                                href={sub.href}
                                onClick={onClose}
                                className="block py-2.5 pl-3 pr-2 text-[15px] font-medium text-body transition-colors hover:text-primary"
                              >
                                {sub.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  <a
                    href={item.href ?? '#'}
                    onClick={onClose}
                    className="block py-4 text-[16px] font-semibold text-heading transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        <a
          href="#booking"
          onClick={onClose}
          className="btn btn-primary mt-6 w-full text-[15px]"
          style={{ padding: '14px 24px' }}
        >
          Book Appointment
        </a>
      </nav>
    </div>
  );
}