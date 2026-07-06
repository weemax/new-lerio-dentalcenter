import { Plus } from 'lucide-react';
import type { Service } from '../data/content';
import { useReveal } from '../hooks/useReveal';

interface ServiceCardProps {
  service: Service;
  index: number;
}

/**
 * Single service card with icon, title, description, "Read more" link.
 * Used inside a CSS grid by ServicesSection.
 */
export function ServiceCard({ service, index }: ServiceCardProps) {
  const ref = useReveal<HTMLDivElement>();
  const Icon = service.icon;

  return (
    <article
      ref={ref}
      className="reveal card-surface group relative flex h-full flex-col p-8"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Icon disc */}
      <div
        className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
        style={{
          background:
            'linear-gradient(135deg, rgba(74,124,210,0.12) 0%, rgba(234,166,56,0.12) 100%)',
          color: 'var(--primary-color)',
        }}
        aria-hidden="true"
      >
        <Icon size={28} strokeWidth={1.8} />
      </div>

      <h3 className="mb-3 text-[22px]">{service.title}</h3>
      <p className="mb-6 text-[15px] leading-relaxed text-body">
        {service.description}
      </p>

      <a
        href={`/services/${service.slug}`}
        className="mt-auto inline-flex items-center gap-2 text-[14px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 hover:text-secondary"
        style={{ color: 'var(--primary-color)' }}
      >
        Read More
        <span
          className="inline-flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-1"
          style={{ background: 'rgba(74,124,210,0.1)' }}
          aria-hidden="true"
        >
          <Plus size={14} />
        </span>
      </a>
    </article>
  );
}