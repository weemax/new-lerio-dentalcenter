import { Section } from './Section';
import { SectionIntro } from './SectionIntro';
import { ServiceCard } from './ServiceCard';
import { services } from '../data/content';

/**
 * Light tinted section that introduces the clinic's services.
 * Renders a 1 → 2 → 4 column responsive grid of ServiceCards.
 */
export function ServicesSection() {
  return (
    <Section id="services" bg="light">
      <div className="mb-12 flex flex-col items-center text-center lg:mb-16">
        <SectionIntro
          eyebrow="Our Services"
          heading="Complete Care for Every Smile"
          description="From everyday check-ups to advanced cosmetic work, every service is delivered with the same standard of calm, careful, personalized care."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {services.map((service, i) => (
          <ServiceCard key={service.title} service={service} index={i} />
        ))}
      </div>
    </Section>
  );
}