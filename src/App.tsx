import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { RouteRecord } from 'vite-react-ssg';
import { HomePage } from './pages/HomePage';
import { DesignSystem } from './pages/DesignSystem';
import { ServiceArticlePage } from './pages/ServiceArticlePage';

// Service slugs — must match src/data/content.ts
const SERVICE_SLUGS = [
  'general-family-dentistry',
  'cosmetic-esthetic-dentistry',
  'pediatric-dentistry',
  'orthodontics-invisalign',
  'dental-implants-surgery',
  'root-canal-therapy',
  'prosthodontics',
  'geriatric-dentistry',
];

/** Scrolls to top on every route change */
function ScrollToTop() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash || hash === '#top') {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    } else {
      const el = document.querySelector(hash);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash]);
  return null;
}

export const routes: RouteRecord[] = [
  {
    path: '/',
    Component: HomePage,
  },
  {
    path: '/services/:slug',
    // Use Component (not lazy) so SSG can find the module and render it
    Component: ServiceArticlePage,
    getStaticPaths: () => SERVICE_SLUGS.map((slug) => `/services/${slug}`),
  },
  {
    path: '/design',
    Component: DesignSystem,
  },
];

// Root layout wrapper rendered for every route
export default function App() {
  return <ScrollToTop />;
}
