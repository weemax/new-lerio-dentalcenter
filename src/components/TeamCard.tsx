import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import type { TeamMember } from '../data/content';
import { useReveal } from '../hooks/useReveal';

interface TeamCardProps {
  member: TeamMember;
  index: number;
}

/**
 * Doctor profile card with portrait image and a bottom overlay panel
 * containing the name and role. Subtle hover interaction.
 */
export function TeamCard({ member, index }: TeamCardProps) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <article
      ref={ref}
      className="reveal group relative overflow-hidden rounded-[20px] bg-white shadow-lg"
      style={{
        boxShadow: '0 20px 40px -22px rgba(15, 28, 65, 0.28)',
        transitionDelay: `${index * 90}ms`,
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={member.image}
          alt={`${member.name}, ${member.role}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Soft gradient for legibility */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5"
          style={{
            background:
              'linear-gradient(180deg, rgba(7,22,48,0) 0%, rgba(7,22,48,0.85) 100%)',
          }}
        />

        {/* Socials — appear on hover */}
        <ul className="absolute right-4 top-4 flex translate-y-2 flex-col gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {[
            { Icon: Facebook, label: 'Facebook' },
            { Icon: Instagram, label: 'Instagram' },
            { Icon: Linkedin, label: 'LinkedIn' },
            { Icon: Twitter, label: 'Twitter' },
          ].map(({ Icon, label }) => (
            <li key={label}>
              <a
                href="#"
                aria-label={`${member.name} on ${label}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-heading transition-colors hover:bg-primary hover:text-white"
              >
                <Icon size={16} />
              </a>
            </li>
          ))}
        </ul>

        {/* Bottom overlay panel */}
        <div className="absolute inset-x-4 bottom-4 z-10 rounded-xl bg-white/95 px-4 py-3 backdrop-blur-sm">
          <h4
            className="text-[16px] font-semibold"
            style={{ marginBottom: 2, color: 'var(--heading-font-color)' }}
          >
            {member.name}
          </h4>
          <p
            className="text-[12.5px] font-medium"
            style={{ color: 'var(--primary-color)', marginBottom: 2 }}
          >
            {member.role}
          </p>
          {member.credentials ? (
            <p
              className="text-[11.5px] font-normal"
              style={{
                color: 'var(--body-font-color)',
                marginBottom: 0,
              }}
            >
              {member.credentials}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}