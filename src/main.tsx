import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './App';
import './index.css';

export const createRoot = ViteReactSSG(
  { routes },
  () => {
    // Setup: wrap every route in HelmetProvider
    // (vite-react-ssg renders the App shell; HelmetProvider goes inside)
  },
);
