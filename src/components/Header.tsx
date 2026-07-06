import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Logo } from './Logo';
import { NavMenu } from './NavMenu';
import { MobileMenu } from './MobileMenu';
import { useScrolledPast } from '../hooks/useScrolledPast';
import { navItems } from '../data/content';

/**
 * Sticky site header with three zones (logo / nav / CTA).
 * Starts transparent over the hero and transitions to a solid white bar
 * once the user scrolls past the hero.
 */
export function Header() {
  const scrolled = useScrolledPast({ threshold: 30 });
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        id="top"
        className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? '#ffffff' : 'transparent',
          boxShadow: scrolled
            ? '0 6px 20px -12px rgba(15, 28, 65, 0.18)'
            : '0 0 0 rgba(0,0,0,0)',
          borderBottom: scrolled
            ? '1px solid rgba(15, 28, 65, 0.06)'
            : '1px solid transparent',
        }}
      >
        <div className="container-x flex h-[88px] items-center justify-between gap-4">
          <Logo variant={scrolled ? 'dark' : 'light'} />

          <nav
            aria-label="Primary"
            className="hidden lg:flex flex-1 justify-center"
          >
            <NavMenu items={navItems} />
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href="#booking"
              className={`btn ${scrolled ? 'btn-primary' : 'btn-white'}`}
            >
              Book Appointment
            </a>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            style={{
              background: scrolled ? 'var(--bg-light)' : 'rgba(255,255,255,0.15)',
              color: scrolled ? 'var(--heading-font-color)' : '#ffffff',
              border: scrolled
                ? '1px solid var(--border-color)'
                : '1px solid rgba(255,255,255,0.4)',
            }}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={navItems}
      />
    </>
  );
}