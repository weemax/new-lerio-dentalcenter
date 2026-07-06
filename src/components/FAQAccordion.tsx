import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Section } from './Section';
import { SectionIntro } from './SectionIntro';
import { faqs } from '../data/content';
import { useRevealAll } from '../hooks/useReveal';

/**
 * Two-column FAQ section: heading on the left, accordion on the right.
 * One item is open by default; accordion items support keyboard interaction.
 */
export function FAQAccordion() {
  return (
    <Section id="faq" bg="white" reveal>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionIntro
            eyebrow="Everything You Need to Know"
            heading="Frequently Asked Questions"
            align="left"
          />
          <p className="mt-4 text-[15.5px] leading-relaxed text-body">
            Can’t find what you’re looking for? Our team is happy to answer any
            question about treatments, insurance, scheduling, or what to expect
            on your first visit.
          </p>
          <a href="#contact" className="btn btn-primary mt-6">
            Contact Our Team
          </a>
        </div>

        <div className="lg:col-span-7">
          <Accordion />
        </div>
      </div>
    </Section>
  );
}

function Accordion() {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const refs = useRevealAll<HTMLLIElement>();

  return (
    <ul className="flex flex-col gap-3">
      {faqs.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `faq-panel-${i}`;
        const buttonId = `faq-button-${i}`;
        return (
          <li
            key={item.question}
            ref={refs(i)}
            className="reveal overflow-hidden rounded-2xl border border-bg-grey bg-white"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <h3 style={{ margin: 0 }}>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-bg-light"
              >
                <span
                  className="text-[16px] font-semibold sm:text-[17px]"
                  style={{ color: 'var(--heading-font-color)' }}
                >
                  {item.question}
                </span>
                <span
                  className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    background: isOpen
                      ? 'var(--primary-color)'
                      : 'rgba(74, 124, 210, 0.1)',
                    color: isOpen ? '#ffffff' : 'var(--primary-color)',
                  }}
                  aria-hidden="true"
                >
                  {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              style={{
                display: 'grid',
                gridTemplateRows: isOpen ? '1fr' : '0fr',
                transition: 'grid-template-rows 0.35s ease',
              }}
            >
              <div className="overflow-hidden">
                <p
                  className="px-6 pb-5 text-[15px] leading-relaxed text-body"
                  style={{ marginBottom: 0 }}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}