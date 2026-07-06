import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import { Section } from './Section';
import { SectionIntro } from './SectionIntro';

const contactItems = [
  {
    Icon: MapPin,
    title: 'Visit Us',
    value: 'Dr. V. Locsin Street, Dumaguete City, Negros Oriental',
  },
  {
    Icon: Phone,
    title: 'Call or Text',
    value: 'TM 0936-542-2515 · DITO 0992-474-4274',
  },
  {
    Icon: Mail,
    title: 'Email Us',
    value: 'contact.leriodentaleenter@gmail.com',
  },
  {
    Icon: Clock,
    title: 'Clinic Hours',
    value: 'Mon – Sat · Sunday by appointment',
  },
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const emptyForm: FormState = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

/**
 * Contact section with info card on the left, contact form on the right.
 * Form is fully client-side: shows a confirmation state on submit.
 */
export function ContactSection() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitted, setSubmitted] = useState(false);

  const update =
    <K extends keyof FormState>(key: K) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // No backend — surface a confirmation state so the UX feels complete.
    setSubmitted(true);
  };

  return (
    <Section id="contact" bg="white" reveal>
      <div className="mb-10 lg:mb-12">
        <SectionIntro
          eyebrow="Get in Touch"
          heading="Book Your Visit to Lerio Dental Center"
          description="Send us a message or give us a call — we'll confirm your visit and send everything you need to feel prepared."
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Contact info */}
        <div className="lg:col-span-5">
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {contactItems.map(({ Icon, title, value }) => (
              <li
                key={title}
                className="card-surface flex items-start gap-4 p-6"
              >
                <span
                  className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(74,124,210,0.12) 0%, rgba(234,166,56,0.12) 100%)',
                    color: 'var(--primary-color)',
                  }}
                  aria-hidden="true"
                >
                  <Icon size={22} strokeWidth={1.8} />
                </span>
                <div>
                  <h4
                    className="mb-1 text-[16px]"
                    style={{ marginBottom: 4 }}
                  >
                    {title}
                  </h4>
                  <p
                    className="text-[14.5px] leading-relaxed text-body"
                    style={{ marginBottom: 0 }}
                  >
                    {value}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Map placeholder */}
          <div
            className="card-surface mt-6 flex h-64 items-center justify-center overflow-hidden p-0"
            aria-label="Map placeholder"
            role="img"
          >
            <div
              className="flex h-full w-full flex-col items-center justify-center text-center"
              style={{
                background:
                  'repeating-linear-gradient(45deg, rgba(74,124,210,0.04) 0 12px, transparent 12px 24px)',
              }}
            >
              <MapPin size={28} color="var(--primary-color)" />
              <p
                className="mt-3 text-[14px] font-semibold"
                style={{ color: 'var(--heading-font-color)' }}
              >
                Dr. V. Locsin Street
              </p>
              <p className="text-[13px] text-body">
                Dumaguete City, Negros Oriental
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7">
          <div className="card-surface p-6 sm:p-8 lg:p-10">
            {submitted ? (
              <ConfirmationState onReset={() => { setSubmitted(false); setForm(emptyForm); }} />
            ) : (
              <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label className="field-label" htmlFor="c-name">
                    Full Name
                  </label>
                  <input
                    id="c-name"
                    className="input"
                    type="text"
                    required
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="c-email">
                    Email
                  </label>
                  <input
                    id="c-email"
                    className="input"
                    type="email"
                    required
                    value={form.email}
                    onChange={update('email')}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="c-phone">
                    Phone
                  </label>
                  <input
                    id="c-phone"
                    className="input"
                    type="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder="0917-000-0000"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="c-subject">
                    Service of Interest
                  </label>
                  <select
                    id="c-subject"
                    className="input"
                    value={form.subject}
                    onChange={update('subject')}
                  >
                    <option value="">Select a service...</option>
                    <option value="General & Family Dentistry">General & Family Dentistry</option>
                    <option value="Cosmetic & Esthetic Dentistry">Cosmetic & Esthetic Dentistry</option>
                    <option value="Pediatric Dentistry">Pediatric Dentistry</option>
                    <option value="Orthodontics & Invisalign">Orthodontics & Invisalign</option>
                    <option value="Dental Implants & Surgery">Dental Implants & Surgery</option>
                    <option value="Root Canal Therapy">Root Canal Therapy</option>
                    <option value="Prosthodontics">Prosthodontics</option>
                    <option value="Geriatric Dentistry">Geriatric Dentistry</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="field-label" htmlFor="c-message">
                    Message
                  </label>
                  <textarea
                    id="c-message"
                    className="input"
                    required
                    rows={5}
                    value={form.message}
                    onChange={update('message')}
                    placeholder="Tell us when you'd like to come in and any concerns we should know about…"
                  />
                </div>
                <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[13px] text-body" style={{ marginBottom: 0 }}>
                    Or call us directly at{' '}
                    <a
                      href="tel:+639365422515"
                      className="font-semibold"
                      style={{ color: 'var(--primary-color)' }}
                    >
                      0936-542-2515
                    </a>
                    .
                  </p>
                  <button type="submit" className="btn btn-primary btn-lg">
                    Send Message <Send size={16} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}

function ConfirmationState({ onReset }: { onReset: () => void }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <span
        className="inline-flex h-16 w-16 items-center justify-center rounded-full"
        style={{
          background:
            'linear-gradient(135deg, rgba(74,124,210,0.12) 0%, rgba(234,166,56,0.18) 100%)',
        }}
        aria-hidden="true"
      >
        <Send size={28} color="var(--primary-color)" />
      </span>
      <h3 className="mt-5" style={{ marginBottom: 8 }}>
        Message sent!
      </h3>
      <p
        className="max-w-md text-[15px] leading-relaxed text-body"
        style={{ marginBottom: 20 }}
      >
        Thanks for reaching out to Lerio Dental Center. Our team will follow up
        within one business day to confirm your visit.
      </p>
      <button type="button" className="btn btn-outline" onClick={onReset}>
        Send Another Message
      </button>
    </div>
  );
}