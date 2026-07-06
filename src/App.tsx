import { useEffect, useState } from 'react';
import { HomePage } from './pages/HomePage';
import { DesignSystem } from './pages/DesignSystem';

/**
 * Tiny hash-based router.
 *
 * Routes:
 *   #/            → HomePage (default)
 *   #/design      → DesignSystem showcase
 *
 * Keeps the app single-file-deployable without a router dependency,
 * and avoids re-implementing navigation for this static showcase.
 */
export default function App() {
  const [route, setRoute] = useState<string>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Always start scrolled to the top when switching routes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [route]);

  return (
    <>
      <RouteSwitcher route={route} />
      <a
        href="#/design"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 80,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 16px',
          borderRadius: 999,
          background: route === 'design' ? 'var(--primary-color)' : '#ffffff',
          color: route === 'design' ? '#ffffff' : 'var(--heading-font-color)',
          fontFamily: 'var(--btn-font-family)',
          fontSize: 13,
          fontWeight: 600,
          textDecoration: 'none',
          boxShadow: '0 18px 40px -15px rgba(15, 28, 65, 0.35)',
          border: '1px solid rgba(15,28,65,0.08)',
          transition: 'transform 0.3s ease, background-color 0.3s ease',
        }}
        aria-label={
          route === 'design' ? 'Go back to the home page' : 'Open the design system'
        }
      >
        {route === 'design' ? '← Home' : 'Design System →'}
      </a>
    </>
  );
}

function RouteSwitcher({ route }: { route: string }) {
  if (route === 'design') return <DesignSystem />;
  return <HomePage />;
}

function parseHash(hash: string): string {
  const cleaned = hash.replace(/^#\/?/, '').trim();
  return cleaned || 'home';
}