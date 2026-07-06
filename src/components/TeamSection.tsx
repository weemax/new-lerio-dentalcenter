import { Section } from './Section';
import { SectionIntro } from './SectionIntro';
import { TeamCard } from './TeamCard';
import { team } from '../data/content';

/**
 * Light tinted section that introduces the dental team.
 * Responsive 1 → 2 → 4 column grid.
 */
export function TeamSection() {
  return (
    <Section id="team" bg="light">
      <div className="mb-12 flex flex-col items-center text-center lg:mb-16">
        <SectionIntro
          eyebrow="Meet Our Dental Team"
          heading="Committed to Your Smile"
          description="A team of experienced clinicians who treat every patient like family — calm hands, clear explanations, and care that lasts well beyond the appointment."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {team.map((member, i) => (
          <TeamCard key={member.name} member={member} index={i} />
        ))}
      </div>
    </Section>
  );
}