import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { NavItem } from '../data/content';

interface NavMenuProps {
  items: NavItem[];
}

/**
 * Desktop navigation row with hover-open dropdowns.
 * Anchors receive keyboard support (Enter/Space) and ARIA-expanded state.
 */
export function NavMenu({ items }: NavMenuProps) {
  return (
    <ul className="flex items-center gap-2 lg:gap-4">
      {items.map((item) => (
        <NavMenuItem key={item.label} item={item} />
      ))}
    </ul>
  );
}

function NavMenuItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLLIElement | null>(null);
  const hasDropdown = !!item.dropdown?.length;

  useEffect(() => {
    if (!hasDropdown) return;
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [hasDropdown]);

  const onLinkClick = () => setOpen(false);

  return (
    <li
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => hasDropdown && setOpen(true)}
      onMouseLeave={() => hasDropdown && setOpen(false)}
    >
      <a
        href={item.href ?? '#'}
        className="inline-flex items-center gap-1 px-3 py-2 text-[15px] font-semibold text-heading transition-colors duration-300 hover:text-primary"
        style={{
          fontFamily: 'var(--mainmenu-font)',
          fontWeight: 'var(--mainmenu-font-weight)',
          padding: 'var(--mainmenu-item-padding-hover)',
        }}
        aria-expanded={hasDropdown ? open : undefined}
        aria-haspopup={hasDropdown ? 'menu' : undefined}
        onClick={onLinkClick}
      >
        {item.label}
        {hasDropdown && (
          <ChevronDown
            size={14}
            aria-hidden="true"
            style={{
              transition: 'transform 0.25s ease',
              transform: open ? 'rotate(180deg)' : 'rotate(0)',
            }}
          />
        )}
      </a>

      {hasDropdown && open && (
        <div
          role="menu"
          className="absolute left-0 top-full pt-2 z-50"
          style={{ minWidth: 220 }}
        >
          <ul
            className="rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/5"
            style={{
              boxShadow: '0 25px 50px -20px rgba(15, 28, 65, 0.25)',
            }}
          >
            {item.dropdown!.map((sub) => (
              <li key={sub.label} role="none">
                <a
                  role="menuitem"
                  href={sub.href}
                  onClick={onLinkClick}
                  className="block rounded-xl px-4 py-2.5 text-[14px] font-medium text-heading transition-colors duration-200 hover:bg-bg-light hover:text-primary"
                >
                  {sub.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}