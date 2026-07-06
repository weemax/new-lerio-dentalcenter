import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import { Section } from './Section';
import { SectionIntro } from './SectionIntro';

const contactItems = [
  { Icon: MapPin, title: 'Visit Us', value: '2486 Maple Avenue, Suite 204, Brookfield, NY 11201' },
  { Icon: Phone, title: 'Call Us', value: '+1 (123) 456-789' },
  { Icon: Mail, title: 'Email Us', value: 'contact@dentiaclinic.com' },
  { Icon: Clock, title: 'Opening Hours', value: 'Mon – Sat: 08:00 – 20:00' },
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
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          heading="We’d Love to Hear From You"
          description="Send a message or give us a call. We’ll get back within one business day, and we’re often faster."
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
                2486 Maple Avenue
              </p>
              <p className="text-[13px] text-body">Brookfield, NY 11201</p>
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
                    placeholder="+1 (555) 000-0000"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="c-subject">
                    Subject
                  </label>
                  <input
                    id="c-subject"
                    className="input"
                    type="text"
                    value={form.subject}
                    onChange={update('subject')}
                    placeholder="How can we help?"
                  />
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
                    placeholder="Tell us a bit about what you’d like to discuss…"
                  />
                </div>
                <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[13px] text-body" style={{ marginBottom: 0 }}>
                    We typically reply within one business day.
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
        Thanks for reaching out. A member of our team will follow up within one
        business day.
      </p>
      <button type="button" className="btn btn-outline" onClick={onReset}>
        Send Another Message
      </button>
    </div>
  );
}