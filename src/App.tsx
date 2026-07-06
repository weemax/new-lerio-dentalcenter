import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { InfoStrip } from './components/InfoStrip';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { StatsBand } from './components/StatsBand';
import { WhyChooseSection } from './components/WhyChooseSection';
import { TeamSection } from './components/TeamSection';
import { FAQAccordion } from './components/FAQAccordion';
import { TestimonialsSection } from './components/TestimonialsSection';
import { BookingCTA } from './components/BookingCTA';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

/**
 * Home page composition — top-level sections in the order specified in the brief.
 * Default route renders this page.
 */
function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <InfoStrip />
        <AboutSection />
        <ServicesSection />
        <StatsBand />
        <WhyChooseSection />
        <TeamSection />
        <FAQAccordion />
        <TestimonialsSection />
        <BookingCTA />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return <HomePage />;
}