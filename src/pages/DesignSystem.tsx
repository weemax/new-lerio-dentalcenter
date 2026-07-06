/**
 * Design System showcase page.
 *
 * Renders every token, component, and pattern defined for Lerio Dental
 * Center so the design language can be reviewed, audited, and reused in one
 * place.
 *
 * This is a documentation surface — not part of the production marketing
 * page. Sections are ordered to tell the design story:
 *   tokens → primitives → components → patterns → motion.
 */

import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertCircle,
  AlignCenter,
  ArrowRight,
  Baby,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUser,
  Clock,
  Download,
  Facebook,
  Heart,
  HeartHandshake,
  HeartPulse,
  Info,
  Instagram,
  Lightbulb,
  Link as LinkIcon,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Microscope,
  Minus,
  Phone,
  Plus,
  Quote,
  Search,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Smile,
  Sparkles,
  Star,
  Stethoscope,
  Sun,
  ThumbsUp,
  Twitter,
  User,
  Users,
  Wrench,
  X,
  XCircle,
} from 'lucide-react';
import { Section } from '../components/Section';
import { SectionIntro } from '../components/SectionIntro';
import { Logo } from '../components/Logo';
import { useCountUp, useInView } from '../hooks/useCountUp';
import { useReveal } from '../hooks/useReveal';
import { serviceCardDemoData } from './designSystemDemoData';

/* =========================================================================
   PAGE
   ========================================================================= */

export function DesignSystem() {
  return (
    <>
      <DesignSystemNav />
      <main>
        <DSHero />
        <ColorsSection />
        <TypographySection />
        <ButtonsSection />
        <FormsSection />
        <CardsSection />
        <SectionBackgroundsSection />
        <StatsSection />
        <IconsSection />
        <ListsSection />
        <AccordionExampleSection />
        <AlertsSection />
        <LoadingStatesSection />
        <ComponentsInActionSection />
        <SectionIntroExampleSection />
        <RevealExampleSection />
        <LogoExampleSection />
      </main>
      <DSFooter />
    </>
  );
}

/* =========================================================================
   STICKY NAV
   ========================================================================= */

function DesignSystemNav() {
  const links: Array<{ label: string; href: string }> = [
    { label: 'Colors', href: '#ds-colors' },
    { label: 'Typography', href: '#ds-typography' },
    { label: 'Buttons', href: '#ds-buttons' },
    { label: 'Forms', href: '#ds-forms' },
    { label: 'Cards', href: '#ds-cards' },
    { label: 'Backgrounds', href: '#ds-backgrounds' },
    { label: 'Stats', href: '#ds-stats' },
    { label: 'Icons', href: '#ds-icons' },
    { label: 'Lists', href: '#ds-lists' },
    { label: 'Accordion', href: '#ds-accordion' },
    { label: 'Alerts', href: '#ds-alerts' },
    { label: 'Loading', href: '#ds-loading' },
    { label: 'Components', href: '#ds-components' },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-bg-grey bg-white/95 backdrop-blur">
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Logo variant="dark" />
          <span
            className="hidden rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white sm:inline-block"
            style={{ background: 'var(--secondary-color)' }}
          >
            Design System
          </span>
        </div>
        <nav aria-label="Design system sections" className="hidden lg:block">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] font-semibold text-heading">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="transition-colors hover:text-primary"
                  style={{ color: 'var(--heading-font-color)' }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#ds-top" className="btn btn-primary px-[18px] py-[10px]">
          Back to Top
        </a>
      </div>
    </header>
  );
}

/* =========================================================================
   HERO
   ========================================================================= */

function DSHero() {
  return (
    <section
      id="ds-top"
      className="relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, var(--bg-dark-2) 0%, var(--bg-dark-1) 100%)',
        color: '#fff',
      }}
    >
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full"
        style={{ background: 'rgba(234,166,56,0.16)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full"
        style={{ background: 'rgba(74,124,210,0.18)' }}
        aria-hidden="true"
      />
      <div className="container-x relative py-20 md:py-24">
        <div className="max-w-3xl">
          <p className="eyebrow eyebrow--light">Lerio Dental Center · v1.0</p>
          <h1
            style={{
              color: '#ffffff',
              fontSize: 'clamp(36px, 6vw, 64px)',
              marginBottom: 16,
            }}
          >
            The Lerio Design System
          </h1>
          <p
            className="max-w-2xl text-[17px] leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.78)', marginBottom: 28 }}
          >
            A living reference for every token, primitive, and component used
            across the Lerio Dental Center marketing experience. Each section
            below shows the actual styling applied — the same CSS variables and
            utilities that ship in production.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#ds-colors" className="btn btn-primary">
              Explore Tokens <ArrowRight size={16} />
            </a>
            <a href="#ds-components" className="btn btn-outline-light">
              See Components in Action
            </a>
          </div>

          <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { k: 'Tokens', v: '60+' },
              { k: 'Components', v: '22' },
              { k: 'Icons', v: '48' },
              { k: 'Breakpoints', v: '4' },
            ].map((s) => (
              <div key={s.k}>
                <dt
                  className="text-[12px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  {s.k}
                </dt>
                <dd
                  className="mt-2 text-[28px] font-extrabold leading-none"
                  style={{
                    fontFamily: 'var(--heading-font)',
                    color: '#fff',
                  }}
                >
                  {s.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   COLORS
   ========================================================================= */

interface Swatch {
  name: string;
  cssVar: string;
  hex: string;
  rgb?: string;
  usage: string;
}

const brandSwatches: Swatch[] = [
  {
    name: 'Primary',
    cssVar: '--primary-color',
    hex: '#4A7CD2',
    rgb: '74, 124, 210',
    usage: 'CTAs, links, focus rings, brand accents.',
  },
  {
    name: 'Secondary',
    cssVar: '--secondary-color',
    hex: '#EAA638',
    rgb: '234, 166, 56',
    usage: 'Highlights, swiper dots, decorative accents.',
  },
  {
    name: 'Heading',
    cssVar: '--heading-font-color',
    hex: '#10244B',
    usage: 'All headings, high-emphasis body text.',
  },
  {
    name: 'Body',
    cssVar: '--body-font-color',
    hex: '#93A0AF',
    usage: 'Default body copy, helper text.',
  },
];

const backgroundSwatches: Swatch[] = [
  { name: 'White', cssVar: '--bg-color: #ffffff', hex: '#FFFFFF', usage: 'Default page surface.' },
  { name: 'Light', cssVar: '--bg-light', hex: '#F8F9FA', usage: 'Tinted sections, info cards.' },
  { name: 'Even', cssVar: '--bg-color-even', hex: '#E8E8E8', usage: 'Alternating row backgrounds.' },
  { name: 'Odd', cssVar: '--bg-color-odd', hex: '#F4F4F4', usage: 'Alternating row backgrounds.' },
  { name: 'Grey', cssVar: '--bg-grey', hex: '#EEEEEE', usage: 'Subtle dividers, hairline borders.' },
  {
    name: 'Dark 1',
    cssVar: '--bg-dark-1',
    hex: '#000A5B',
    usage: 'Primary dark band, footer accents.',
  },
  {
    name: 'Dark 2',
    cssVar: '--bg-dark-2',
    hex: '#071630',
    usage: 'Footer, deep contrast backgrounds.',
  },
  {
    name: 'Dark 3',
    cssVar: '--bg-dark-3',
    hex: '#1E1E1E',
    usage: 'Modal surfaces, code blocks.',
  },
];

function ColorsSection() {
  return (
    <Section id="ds-colors" bg="white">
      <SectionIntro
        eyebrow="01 · Foundation"
        heading="Color Tokens"
        description="Every color in the system is declared as a CSS custom property in :root and surfaced as a Tailwind utility via @theme inline."
      />

      <div className="mt-12 space-y-12">
        <ColorGroup title="Brand & text" swatches={brandSwatches} />
        <ColorGroup title="Backgrounds" swatches={backgroundSwatches} />

        <div>
          <h3 className="mb-4" style={{ marginBottom: 16 }}>
            Brand gradient
          </h3>
          <div
            className="flex h-32 items-end justify-between rounded-[20px] p-6"
            style={{ background: 'var(--bg-gradient-1)' }}
          >
            <span
              className="text-[12px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: 'var(--heading-font-color)' }}
            >
              --bg-gradient-1
            </span>
            <span className="text-[12px] font-mono" style={{ color: 'var(--heading-font-color)' }}>
              primary 10% → secondary 20%
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}

function ColorGroup({ title, swatches }: { title: string; swatches: Swatch[] }) {
  return (
    <div>
      <h3 className="mb-5" style={{ marginBottom: 20 }}>
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {swatches.map((s) => (
          <ColorSwatchCard key={s.name} swatch={s} />
        ))}
      </div>
    </div>
  );
}

function ColorSwatchCard({ swatch }: { swatch: Swatch }) {
  const inlineBg =
    swatch.name === 'White'
      ? '#ffffff'
      : swatch.name === 'Gradient'
        ? 'var(--bg-gradient-1)'
        : `var(${swatch.cssVar})`;
  const isLight =
    swatch.name === 'White' ||
    swatch.name === 'Light' ||
    swatch.name === 'Even' ||
    swatch.name === 'Odd' ||
    swatch.name === 'Grey' ||
    swatch.name === 'Body';
  const textColor = isLight ? 'var(--heading-font-color)' : '#ffffff';

  return (
    <div className="overflow-hidden rounded-[20px] border border-bg-grey bg-white">
      <div
        className="flex h-28 items-end justify-between p-4"
        style={{ background: inlineBg, color: textColor }}
      >
        <span
          className="rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em]"
          style={{
            background: isLight ? 'rgba(15,28,65,0.08)' : 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {swatch.name}
        </span>
      </div>
      <div className="space-y-1 p-4">
        <p
          className="text-[14px] font-semibold"
          style={{ color: 'var(--heading-font-color)' }}
        >
          {swatch.hex}
        </p>
        {swatch.rgb ? (
          <p className="text-[12px] text-body">RGB {swatch.rgb}</p>
        ) : null}
        <p className="font-mono text-[12px]" style={{ color: 'var(--primary-color)' }}>
          var({swatch.cssVar})
        </p>
        <p className="text-[12.5px] leading-relaxed text-body">{swatch.usage}</p>
      </div>
    </div>
  );
}

/* =========================================================================
   TYPOGRAPHY
   ========================================================================= */

interface TypeRow {
  label: string;
  sample: string;
  element: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
}

const headingScale: TypeRow[] = [
  {
    label: 'H1 · 60px · Urbanist 600',
    sample: 'Elevating Smiles with Expert Care',
    element: 'h1',
  },
  {
    label: 'H2 · 48px · Urbanist 600',
    sample: 'Complete Care for Every Smile',
    element: 'h2',
  },
  {
    label: 'H3 · 26px · Urbanist 600',
    sample: 'Personalized Treatment Plans',
    element: 'h3',
  },
  {
    label: 'H4 · 20px · Urbanist 600',
    sample: 'Experienced Dental Professionals',
    element: 'h4',
  },
  {
    label: 'H5 · 18px · Urbanist 600',
    sample: 'Gentle Care for Every Age',
    element: 'h5',
  },
  {
    label: 'H6 · 16px · Urbanist 600',
    sample: 'Flexible Appointment Scheduling',
    element: 'h6',
  },
];

function TypographySection() {
  return (
    <Section id="ds-typography" bg="light">
      <SectionIntro
        eyebrow="02 · Type System"
        heading="Typography"
        description="Two type families: Urbanist for display headings, Inter for body copy and UI. The full heading scale is bound to CSS custom properties so a single change ripples through every page."
      />

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
          {headingScale.map((row) => (
            <article key={row.label} className="border-b border-bg-grey pb-8 last:border-0">
              <p
                className="mb-3 font-mono text-[12px] uppercase tracking-[0.12em]"
                style={{ color: 'var(--primary-color)' }}
              >
                {row.label}
              </p>
              {(() => {
                const Tag = row.element;
                return <Tag style={{ marginBottom: 0 }}>{row.sample}</Tag>;
              })()}
            </article>
          ))}
        </div>

        <div className="lg:col-span-5">
          <div className="card-surface p-8">
            <h4 className="mb-4" style={{ marginBottom: 16 }}>
              Body & UI
            </h4>
            <p className="mb-5 text-[16px] leading-relaxed" style={{ color: 'var(--body-font-color)' }}>
              Inter 400 / 16px / 1.6 line height. This is the default paragraph
              style used across the site. Body copy uses a calm, low-contrast
              slate for comfortable reading on long pages.
            </p>
            <p
              className="mb-5 text-[14px] font-medium"
              style={{ color: 'var(--heading-font-color)' }}
            >
              Inter 500 / 14px — used for emphasized inline text and small
              labels.
            </p>
            <p
              className="mb-5 text-[13px]"
              style={{ color: 'var(--body-font-color)' }}
            >
              Inter 400 / 13px — helper text, captions, fine print.
            </p>
            <p
              className="mb-6 text-[12px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: 'var(--primary-color)' }}
            >
              Inter 600 / 12px — Eyebrow / micro-label
            </p>

            <hr className="my-6 border-bg-grey" />

            <h5 className="mb-3">Font stack</h5>
            <p className="font-mono text-[13px]" style={{ color: 'var(--heading-font-color)' }}>
              --heading-font: Urbanist, Helvetica, Arial, sans-serif
            </p>
            <p className="mt-1 font-mono text-[13px]" style={{ color: 'var(--heading-font-color)' }}>
              --body-font: Inter, Helvetica, Arial, sans-serif
            </p>
          </div>

          <div className="card-surface mt-6 p-8">
            <h4 className="mb-4" style={{ marginBottom: 16 }}>
              Text colors
            </h4>
            <ul className="space-y-3 text-[15px]">
              <li className="flex items-center justify-between gap-3">
                <span style={{ color: 'var(--heading-font-color)' }}>Heading high-emphasis</span>
                <span className="font-mono text-[12px]" style={{ color: 'var(--primary-color)' }}>
                  --heading-font-color
                </span>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span style={{ color: 'var(--body-font-color)' }}>Body default copy</span>
                <span className="font-mono text-[12px]" style={{ color: 'var(--primary-color)' }}>
                  --body-font-color
                </span>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span style={{ color: 'var(--body-font-color-dark)', background: 'var(--bg-dark-1)', padding: '4px 8px', borderRadius: 6 }}>
                  Body on dark surfaces
                </span>
                <span className="font-mono text-[12px]" style={{ color: 'var(--primary-color)' }}>
                  --body-font-color-dark
                </span>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span style={{ color: 'var(--primary-color)' }}>Links & accents</span>
                <span className="font-mono text-[12px]" style={{ color: 'var(--primary-color)' }}>
                  --primary-color
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* =========================================================================
   BUTTONS
   ========================================================================= */

function ButtonsSection() {
  return (
    <Section id="ds-buttons" bg="white">
      <SectionIntro
        eyebrow="03 · Interactions"
        heading="Buttons"
        description="Four core button variants defined on the design tokens. Each supports hover elevation, focus rings, and icon affordances."
      />

      <div className="mt-12 space-y-12">
        <ButtonRow
          title="Primary"
          description="High-emphasis CTA — used for the main conversion actions."
          tone="light"
          buttons={
            <>
              <button type="button" className="btn btn-primary">
                Book Appointment
              </button>
              <button type="button" className="btn btn-primary btn-lg">
                Book Appointment <ArrowRight size={16} />
              </button>
              <button type="button" className="btn btn-primary" disabled>
                Disabled
              </button>
            </>
          }
          sample={`.btn {
  padding: var(--btn-padding);
  font-family: var(--btn-font-family);
  font-size: var(--btn-font-size);
  font-weight: var(--btn-font-weight);
  border-radius: var(--btn-rounded);
}
.btn-primary {
  background: var(--primary-color);
  color: var(--btn-color);
}
.btn-primary:hover { background: var(--btn-hover-bg); }`}
        />

        <ButtonRow
          title="Outline"
          description="Medium-emphasis — secondary actions that pair with a primary."
          tone="light"
          buttons={
            <>
              <button type="button" className="btn btn-outline">
                Learn More
              </button>
              <button type="button" className="btn btn-outline btn-lg">
                Explore Services
              </button>
              <button type="button" className="btn btn-outline" disabled>
                Disabled
              </button>
            </>
          }
        />

        <ButtonRow
          title="Outline on dark"
          description="Used on hero and dark band sections where the white surface isn't available."
          tone="dark"
          buttons={
            <>
              <button type="button" className="btn btn-outline-light">
                Explore Services
              </button>
              <button type="button" className="btn btn-outline-light btn-lg">
                Contact Us
              </button>
              <button type="button" className="btn btn-white btn-lg">
                Book Appointment <ArrowRight size={16} />
              </button>
            </>
          }
        />

        <ButtonRow
          title="Icon & utility"
          description="Compact affordances for inline actions and form controls."
          tone="light"
          buttons={
            <>
              <button type="button" className="btn btn-primary" aria-label="Send message">
                <Send size={16} /> Send Message
              </button>
              <button type="button" className="btn btn-outline">
                <Download size={16} /> Download Brochure
              </button>
              <button
                type="button"
                aria-label="Search"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-heading transition-colors hover:bg-bg-light"
                style={{ border: '1px solid var(--border-color)' }}
              >
                <Search size={18} />
              </button>
              <a
                href="#ds-buttons"
                className="inline-flex items-center gap-2 text-[14px] font-semibold uppercase tracking-[0.14em] transition-colors hover:text-secondary"
                style={{ color: 'var(--primary-color)' }}
              >
                Read More
                <span
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full"
                  style={{ background: 'rgba(74,124,210,0.1)' }}
                  aria-hidden="true"
                >
                  <Plus size={14} />
                </span>
              </a>
            </>
          }
        />
      </div>
    </Section>
  );
}

interface ButtonRowProps {
  title: string;
  description: string;
  buttons: React.ReactNode;
  tone?: 'light' | 'dark';
  sample?: string;
}

function ButtonRow({ title, description, buttons, tone = 'light', sample }: ButtonRowProps) {
  return (
    <div>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h3>{title}</h3>
          <p className="mt-1 text-[15px] text-body">{description}</p>
        </div>
      </div>
      <div
        className="flex flex-wrap items-center gap-3 rounded-[20px] p-8"
        style={{
          background: tone === 'dark' ? 'var(--bg-dark-2)' : 'var(--bg-light)',
          color: tone === 'dark' ? '#fff' : undefined,
        }}
      >
        {buttons}
      </div>
      {sample ? (
        <pre
          className="mt-4 overflow-x-auto rounded-2xl p-5 text-[12.5px] leading-relaxed"
          style={{
            background: 'var(--bg-dark-3)',
            color: 'rgba(255,255,255,0.85)',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          }}
        >
          <code>{sample}</code>
        </pre>
      ) : null}
    </div>
  );
}

/* =========================================================================
   FORMS
   ========================================================================= */

function FormsSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [service, setService] = useState('general');
  const [message, setMessage] = useState('');
  const [agree, setAgree] = useState(false);
  const [option, setOption] = useState('email');

  const onText = (setter: (v: string) => void) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setter(e.target.value);

  return (
    <Section id="ds-forms" bg="light">
      <SectionIntro
        eyebrow="04 · Inputs"
        heading="Forms"
        description="Form controls share consistent radius, padding, and focus treatment. Inputs use the border-radius token and gain a primary-colored focus ring."
      />

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Text inputs */}
        <form
          className="card-surface space-y-5 p-8"
          onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}
        >
          <h3>Text inputs</h3>

          <div>
            <label className="field-label" htmlFor="ds-name">
              Full Name
            </label>
            <input
              id="ds-name"
              className="input"
              type="text"
              value={name}
              onChange={onText(setName)}
              placeholder="Jane Doe"
              autoComplete="name"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="ds-email">
              Email
            </label>
            <input
              id="ds-email"
              className="input"
              type="email"
              value={email}
              onChange={onText(setEmail)}
              placeholder="jane@example.com"
              autoComplete="email"
            />
            <p className="mt-2 text-[12.5px] text-body">
              We'll never share your email.
            </p>
          </div>

          <div>
            <label className="field-label" htmlFor="ds-phone">
              Phone
            </label>
            <input
              id="ds-phone"
              className="input"
              type="tel"
              value={phone}
              onChange={onText(setPhone)}
              placeholder="+1 (555) 000-0000"
              autoComplete="tel"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="ds-date">
                Preferred Date
              </label>
              <input
                id="ds-date"
                className="input"
                type="date"
                value={date}
                onChange={onText(setDate)}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="ds-service">
                Service
              </label>
              <select
                id="ds-service"
                className="input"
                value={service}
                onChange={onText(setService)}
              >
                <option value="general">General Dentistry</option>
                <option value="cosmetic">Cosmetic Dentistry</option>
                <option value="pediatric">Pediatric Dentistry</option>
                <option value="orthodontics">Orthodontics</option>
              </select>
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="ds-message">
              Notes
            </label>
            <textarea
              id="ds-message"
              className="input"
              rows={4}
              value={message}
              onChange={onText(setMessage)}
              placeholder="Anything we should know before your visit?"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="ds-disabled">
              Disabled input
            </label>
            <input
              id="ds-disabled"
              className="input"
              type="text"
              disabled
              placeholder="Read-only field"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Save Details
          </button>
        </form>

        {/* With icons, choices, validation */}
        <div className="space-y-6">
          <div className="card-surface space-y-5 p-8">
            <h3>Inputs with icons</h3>

            <div className="relative">
              <label className="field-label" htmlFor="ds-search">
                Search
              </label>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: 38,
                  color: 'var(--body-font-color)',
                }}
                aria-hidden="true"
              />
              <input
                id="ds-search"
                className="input"
                type="search"
                placeholder="Search treatments, services, doctors…"
                style={{ paddingLeft: 40 }}
              />
            </div>

            <div className="relative">
              <label className="field-label" htmlFor="ds-email-icon">
                Email
              </label>
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: 38,
                  color: 'var(--body-font-color)',
                }}
                aria-hidden="true"
              />
              <input
                id="ds-email-icon"
                className="input"
                type="email"
                placeholder="you@leriodentalcenter.com"
                style={{ paddingLeft: 40 }}
              />
            </div>

            <div className="relative">
              <label className="field-label" htmlFor="ds-phone-icon">
                Phone
              </label>
              <Phone
                size={16}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: 38,
                  color: 'var(--body-font-color)',
                }}
                aria-hidden="true"
              />
              <input
                id="ds-phone-icon"
                className="input"
                type="tel"
                placeholder="(555) 123-4567"
                style={{ paddingLeft: 40 }}
              />
            </div>
          </div>

          <div className="card-surface space-y-5 p-8">
            <h3>Selection controls</h3>

            <fieldset className="space-y-3">
              <legend className="field-label">Preferred contact method</legend>
              {[
                { value: 'email', label: 'Email' },
                { value: 'phone', label: 'Phone call' },
                { value: 'sms', label: 'SMS / Text' },
              ].map((o) => (
                <label
                  key={o.value}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-bg-grey px-4 py-3 transition-colors hover:bg-bg-light"
                >
                  <input
                    type="radio"
                    name="ds-contact"
                    value={o.value}
                    checked={option === o.value}
                    onChange={() => setOption(o.value)}
                    style={{ accentColor: 'var(--primary-color)' }}
                  />
                  <span
                    className="text-[15px] font-medium"
                    style={{ color: 'var(--heading-font-color)' }}
                  >
                    {o.label}
                  </span>
                </label>
              ))}
            </fieldset>

            <hr className="border-bg-grey" />

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                style={{ accentColor: 'var(--primary-color)', marginTop: 4 }}
              />
              <span className="text-[14.5px] text-body">
                I agree to receive appointment reminders and occasional care
                tips by email.
              </span>
            </label>
          </div>

          <div className="card-surface space-y-3 p-8">
            <h3>Validation states</h3>
            <div>
              <label className="field-label" htmlFor="ds-success">Success</label>
              <input
                id="ds-success"
                className="input"
                defaultValue="jane@leriodentalcenter.com"
                style={{
                  borderColor: '#22c55e',
                  boxShadow: '0 0 0 4px rgba(34,197,94,0.12)',
                }}
              />
              <p className="mt-2 inline-flex items-center gap-1 text-[12.5px]" style={{ color: '#16a34a' }}>
                <CheckCircle2 size={14} /> Looks great.
              </p>
            </div>
            <div>
              <label className="field-label" htmlFor="ds-error">Error</label>
              <input
                id="ds-error"
                className="input"
                defaultValue="not-an-email"
                style={{
                  borderColor: '#ef4444',
                  boxShadow: '0 0 0 4px rgba(239,68,68,0.12)',
                }}
              />
              <p className="mt-2 inline-flex items-center gap-1 text-[12.5px]" style={{ color: '#dc2626' }}>
                <XCircle size={14} /> Please enter a valid email address.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* =========================================================================
   CARDS
   ========================================================================= */

function CardsSection() {
  return (
    <Section id="ds-cards" bg="white">
      <SectionIntro
        eyebrow="05 · Surfaces"
        heading="Cards"
        description="Cards are the core surface primitive — 20px radius, soft shadow, and a 4px lift on hover. Every service, testimonial, and stat in the production site uses the card-surface base."
      />

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* Bare card */}
        <article className="card-surface p-8">
          <h4 className="mb-2" style={{ marginBottom: 8 }}>
            Bare card
          </h4>
          <p className="text-[15px] text-body">
            The base card-surface primitive. Padding, radius, and shadow are
            defined once and reused everywhere.
          </p>
        </article>

        {/* Stat card */}
        <article className="card-surface p-8">
          <span
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: 'rgba(74,124,210,0.12)', color: 'var(--primary-color)' }}
            aria-hidden="true"
          >
            <Heart size={20} />
          </span>
          <p
            className="mt-5 text-[34px] font-extrabold leading-none"
            style={{
              fontFamily: 'var(--heading-font)',
              color: 'var(--heading-font-color)',
            }}
          >
            10,000+
          </p>
          <p className="mt-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-body">
            Happy Patients
          </p>
        </article>

        {/* Icon card */}
        <article className="card-surface p-8">
          <div
            className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{
              background:
                'linear-gradient(135deg, rgba(74,124,210,0.12) 0%, rgba(234,166,56,0.12) 100%)',
              color: 'var(--primary-color)',
            }}
            aria-hidden="true"
          >
            <Sparkles size={22} strokeWidth={1.8} />
          </div>
          <h4 className="mb-2" style={{ marginBottom: 8 }}>
            Cosmetic Dentistry
          </h4>
          <p className="text-[15px] text-body">
            Whitening, veneers, and smile makeovers crafted to highlight the
            best version of you.
          </p>
          <a
            href="#ds-cards"
            className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] transition-colors hover:text-secondary"
            style={{ color: 'var(--primary-color)' }}
          >
            Read more
            <ArrowRight size={14} />
          </a>
        </article>

        {/* Testimonial-like card */}
        <article className="card-surface flex flex-col justify-between p-8">
          <Quote size={28} color="var(--secondary-color)" strokeWidth={2} />
          <p
            className="mt-4 text-[16px] leading-relaxed"
            style={{
              color: 'var(--heading-font-color)',
              fontFamily: 'var(--heading-font)',
              fontWeight: 500,
            }}
          >
            “From the moment I walked in, I felt cared for. Calm hands, clear
            explanations, and real results.”
          </p>
          <div className="mt-6 flex items-center gap-3">
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-bold text-white"
              style={{ background: 'var(--primary-color)' }}
              aria-hidden="true"
            >
              JH
            </span>
            <div>
              <p
                className="text-[14.5px] font-semibold"
                style={{ color: 'var(--heading-font-color)' }}
              >
                Jessica Harmon
              </p>
              <p
                className="text-[12.5px]"
                style={{ color: 'var(--primary-color)' }}
              >
                Patient
              </p>
            </div>
          </div>
        </article>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <article className="card-surface flex items-start gap-4 p-7">
          <span
            className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl"
            style={{ background: 'rgba(74,124,210,0.1)', color: 'var(--primary-color)' }}
            aria-hidden="true"
          >
            <ShieldCheck size={22} />
          </span>
          <div>
            <h5 style={{ marginBottom: 4 }}>Experienced Dental</h5>
            <p className="text-[14px] leading-relaxed text-body" style={{ marginBottom: 0 }}>
              Skilled care backed by years of trusted dental experience.
            </p>
          </div>
        </article>
        <article className="card-surface flex items-start gap-4 p-7">
          <span
            className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl"
            style={{ background: 'rgba(74,124,210,0.1)', color: 'var(--primary-color)' }}
            aria-hidden="true"
          >
            <Microscope size={22} />
          </span>
          <div>
            <h5 style={{ marginBottom: 4 }}>Advanced Technology</h5>
            <p className="text-[14px] leading-relaxed text-body" style={{ marginBottom: 0 }}>
              Modern tools ensure accurate and efficient treatments.
            </p>
          </div>
        </article>
        <article className="card-surface flex items-start gap-4 p-7">
          <span
            className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl"
            style={{ background: 'rgba(74,124,210,0.1)', color: 'var(--primary-color)' }}
            aria-hidden="true"
          >
            <HeartHandshake size={22} />
          </span>
          <div>
            <h5 style={{ marginBottom: 4 }}>Personalized Treatment</h5>
            <p className="text-[14px] leading-relaxed text-body" style={{ marginBottom: 0 }}>
              Custom care plans made to fit your smile and lifestyle.
            </p>
          </div>
        </article>
      </div>
    </Section>
  );
}

/* =========================================================================
   SECTION BACKGROUNDS
   ========================================================================= */

function SectionBackgroundsSection() {
  const tones: Array<{ token: string; bg: string; text: string; title: string; usage: string }> = [
    { token: 'white', bg: '#ffffff', text: 'var(--heading-font-color)', title: 'White', usage: 'Default page surface.' },
    { token: '--bg-light', bg: 'var(--bg-light)', text: 'var(--heading-font-color)', title: 'Light', usage: 'Tinted sections, info panels.' },
    { token: '--bg-color-even', bg: 'var(--bg-color-even)', text: 'var(--heading-font-color)', title: 'Even', usage: 'Alternating row backgrounds.' },
    { token: '--bg-color-odd', bg: 'var(--bg-color-odd)', text: 'var(--heading-font-color)', title: 'Odd', usage: 'Alternating row backgrounds.' },
    { token: '--bg-grey', bg: 'var(--bg-grey)', text: 'var(--heading-font-color)', title: 'Grey', usage: 'Subtle dividers, hairline borders.' },
    { token: '--bg-dark-1', bg: 'var(--bg-dark-1)', text: '#ffffff', title: 'Dark 1', usage: 'Primary dark band, footers.' },
    { token: '--bg-dark-2', bg: 'var(--bg-dark-2)', text: '#ffffff', title: 'Dark 2', usage: 'Deep contrast backgrounds.' },
    { token: '--bg-dark-3', bg: 'var(--bg-dark-3)', text: '#ffffff', title: 'Dark 3', usage: 'Modal surfaces, code blocks.' },
    { token: '--bg-gradient-1', bg: 'var(--bg-gradient-1)', text: 'var(--heading-font-color)', title: 'Gradient', usage: 'Hero overlays, brand washes.' },
  ];

  return (
    <Section id="ds-backgrounds" bg="white" pad>
      <SectionIntro
        eyebrow="06 · Surface tones"
        heading="Section Backgrounds"
        description="Sections alternate between light and dark tones for visual rhythm. Each token is documented below with its intended usage."
      />

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tones.map((t) => (
          <div
            key={t.token}
            className="overflow-hidden rounded-[20px] border border-bg-grey"
          >
            <div
              className="flex h-40 items-end justify-between p-5"
              style={{
                background: t.bg,
                color: t.text,
              }}
            >
              <span
                className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
                style={{
                  background:
                    t.title.startsWith('Dark') || t.title === 'Dark 3'
                      ? 'rgba(255,255,255,0.18)'
                      : 'rgba(15,28,65,0.08)',
                }}
              >
                {t.title}
              </span>
            </div>
            <div className="bg-white p-5">
              <p
                className="font-mono text-[12.5px]"
                style={{ color: 'var(--primary-color)' }}
              >
                {t.token}
              </p>
              <p
                className="mt-2 text-[14px] font-semibold"
                style={{ color: 'var(--heading-font-color)' }}
              >
                {t.title}
              </p>
              <p className="mt-1 text-[13px] text-body">{t.usage}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card-surface p-6">
          <p
            className="font-mono text-[12px] uppercase tracking-[0.12em]"
            style={{ color: 'var(--primary-color)' }}
          >
            Section padding
          </p>
          <p className="mt-2 text-[15px] text-body">
            100px vertical on desktop · 60px on mobile.
          </p>
        </div>
        <div className="card-surface p-6">
          <p
            className="font-mono text-[12px] uppercase tracking-[0.12em]"
            style={{ color: 'var(--primary-color)' }}
          >
            Container
          </p>
          <p className="mt-2 text-[15px] text-body">
            max-width 1240px, centered, 24px horizontal padding.
          </p>
        </div>
        <div className="card-surface p-6">
          <p
            className="font-mono text-[12px] uppercase tracking-[0.12em]"
            style={{ color: 'var(--primary-color)' }}
          >
            Grid gap
          </p>
          <p className="mt-2 text-[15px] text-body">
            30px desktop · 24px tablet · 20px mobile.
          </p>
        </div>
      </div>
    </Section>
  );
}

/* =========================================================================
   STATS / COUNTERS
   ========================================================================= */

function StatsSection() {
  const stats = [
    { value: 10000, suffix: '+', label: 'Happy Patients' },
    { value: 2500, suffix: '+', label: 'Teeth Whitened' },
    { value: 800, suffix: '+', label: 'Dental Implants' },
    { value: 15, suffix: '+', label: 'Years of Experience' },
  ];
  return (
    <Section id="ds-stats" bg="dark-2" pad>
      <SectionIntro
        eyebrow="07 · Animated counters"
        heading="Stats & Counters"
        description="Animated counters that ease into view when the section enters the viewport. Powered by the useCountUp hook — respects prefers-reduced-motion."
        tone="dark"
      />

      <div className="mt-12 grid grid-cols-2 gap-y-10 md:grid-cols-4">
        {stats.map((s, i) => (
          <DemoStat key={s.label} {...s} delay={i * 100} />
        ))}
      </div>
    </Section>
  );
}

function DemoStat({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const n = useCountUp(value, inView);
  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
        transitionDelay: `${delay}ms`,
      }}
    >
      <span
        className="flex items-baseline"
        style={{
          color: '#fff',
          fontFamily: 'var(--heading-font)',
          fontWeight: 700,
          fontSize: 'clamp(36px, 5vw, 56px)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        {n.toLocaleString('en-US')}
        <span style={{ color: 'var(--secondary-color)' }}>{suffix}</span>
      </span>
      <span
        className="mt-3 text-[13px] font-semibold uppercase tracking-[0.16em]"
        style={{ color: 'rgba(255,255,255,0.65)' }}
      >
        {label}
      </span>
    </div>
  );
}

/* =========================================================================
   ICONS
   ========================================================================= */

const iconGallery: Array<{ label: string; Icon: LucideIcon }> = [
  { label: 'Stethoscope', Icon: Stethoscope },
  { label: 'Sparkles', Icon: Sparkles },
  { label: 'Baby', Icon: Baby },
  { label: 'Wrench', Icon: Wrench },
  { label: 'Shield Check', Icon: ShieldCheck },
  { label: 'Heart Pulse', Icon: HeartPulse },
  { label: 'Heart', Icon: Heart },
  { label: 'Star', Icon: Star },
  { label: 'Users', Icon: Users },
  { label: 'User', Icon: User },
  { label: 'Smile', Icon: Smile },
  { label: 'Thumbs Up', Icon: ThumbsUp },
  { label: 'Calendar', Icon: Calendar },
  { label: 'Clock', Icon: Clock },
  { label: 'Phone', Icon: Phone },
  { label: 'Mail', Icon: Mail },
  { label: 'Map Pin', Icon: MapPin },
  { label: 'Search', Icon: Search },
  { label: 'Send', Icon: Send },
  { label: 'Lightbulb', Icon: Lightbulb },
  { label: 'Microscope', Icon: Microscope },
  { label: 'Activity', Icon: Activity },
  { label: 'Align Center', Icon: AlignCenter },
  { label: 'Message', Icon: MessageSquare },
  { label: 'Settings', Icon: Settings },
  { label: 'Sun', Icon: Sun },
  { label: 'Link', Icon: LinkIcon },
  { label: 'Quote', Icon: Quote },
  { label: 'Check', Icon: Check },
  { label: 'Plus', Icon: Plus },
  { label: 'Minus', Icon: Minus },
  { label: 'Chevron Down', Icon: ChevronDown },
  { label: 'Chevron Right', Icon: ChevronRight },
  { label: 'Chevron Left', Icon: ChevronLeft },
  { label: 'Arrow Right', Icon: ArrowRight },
  { label: 'Menu', Icon: Menu },
  { label: 'X', Icon: X },
  { label: 'Info', Icon: Info },
  { label: 'Check Circle', Icon: CheckCircle2 },
  { label: 'Alert', Icon: AlertCircle },
  { label: 'X Circle', Icon: XCircle },
  { label: 'Loader', Icon: Loader2 },
  { label: 'Heart Handshake', Icon: HeartHandshake },
  { label: 'Shield', Icon: Shield },
  { label: 'Download', Icon: Download },
  { label: 'Circle User', Icon: CircleUser },
  { label: 'Facebook', Icon: Facebook },
  { label: 'Instagram', Icon: Instagram },
  { label: 'Twitter', Icon: Twitter },
  { label: 'LinkedIn', Icon: Linkedin },
];

function IconsSection() {
  return (
    <Section id="ds-icons" bg="light">
      <SectionIntro
        eyebrow="08 · Iconography"
        heading="Icon Library"
        description="Icons are sourced from lucide-react — a consistent, 24px-grid, stroke-based icon family. All icons accept size, color, and strokeWidth props."
      />

      <div className="mt-12 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {iconGallery.map(({ label, Icon }) => (
          <div
            key={label}
            className="card-surface flex flex-col items-center justify-center gap-2 p-4 text-center"
            style={{ aspectRatio: '1 / 1' }}
          >
            <Icon size={22} color="var(--primary-color)" strokeWidth={1.8} />
            <span className="text-[11.5px] font-medium leading-tight text-body">
              {label}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* =========================================================================
   LISTS
   ========================================================================= */

function ListsSection() {
  return (
    <Section id="ds-lists" bg="white">
      <SectionIntro
        eyebrow="09 · Lists"
        heading="Lists & Checklists"
        description="Used for feature lists, FAQ answers, and selection menus. Three core patterns: checklist, bullet, and numbered."
      />

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="card-surface p-8">
          <h4 className="mb-5" style={{ marginBottom: 20 }}>
            Checklist
          </h4>
          <ul className="space-y-3">
            {[
              'Personalized Treatment Plans',
              'Gentle Care for Kids and Adults',
              'State-of-the-Art Technology',
              'Flexible Appointment Scheduling',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span
                  className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ background: 'rgba(74,124,210,0.12)' }}
                  aria-hidden="true"
                >
                  <Check size={14} color="var(--primary-color)" strokeWidth={3} />
                </span>
                <span
                  className="text-[15px] font-medium"
                  style={{ color: 'var(--heading-font-color)' }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-surface p-8">
          <h4 className="mb-5" style={{ marginBottom: 20 }}>
            Bullet list
          </h4>
          <ul className="space-y-3 pl-5" style={{ listStyle: 'disc', color: 'var(--body-font-color)' }}>
            {[
              'Routine cleanings and check-ups',
              'Restorative work — crowns, bridges, fillings',
              'Cosmetic enhancements — whitening, veneers',
              'Orthodontic consultations and clear aligners',
              'Emergency same-day care',
            ].map((item) => (
              <li key={item} className="text-[15px] leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="card-surface p-8">
          <h4 className="mb-5" style={{ marginBottom: 20 }}>
            Numbered steps
          </h4>
          <ol className="space-y-4">
            {[
              { t: 'Book online or by phone', d: 'Pick a date and time that works for you.' },
              { t: 'Confirm your visit', d: 'We send a friendly reminder 24 hours before.' },
              { t: 'Arrive and relax', d: 'Our team will guide you through every step.' },
              { t: 'Follow your care plan', d: 'Personalized reminders keep your smile on track.' },
            ].map((s, i) => (
              <li key={s.t} className="flex gap-4">
                <span
                  className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
                  style={{ background: 'var(--primary-color)' }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <div>
                  <p
                    className="text-[15px] font-semibold"
                    style={{ color: 'var(--heading-font-color)', marginBottom: 2 }}
                  >
                    {s.t}
                  </p>
                  <p className="text-[13.5px] leading-relaxed text-body" style={{ marginBottom: 0 }}>
                    {s.d}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}

/* =========================================================================
   ACCORDION
   ========================================================================= */

const demoFaqs = [
  {
    q: 'How often should I visit the dentist?',
    a: 'It’s recommended to see your dentist every 6 months for a routine check-up and cleaning, unless advised otherwise.',
  },
  {
    q: 'What should I do in a dental emergency?',
    a: 'Call our office immediately. We offer same-day emergency care for severe pain, broken teeth, or swelling.',
  },
  {
    q: 'Do you offer services for kids?',
    a: 'Absolutely. We provide gentle, friendly pediatric dental care for children of all ages.',
  },
];

function AccordionExampleSection() {
  const [open, setOpen] = useState(0);
  return (
    <Section id="ds-accordion" bg="light">
      <SectionIntro
        eyebrow="10 · Disclosure"
        heading="Accordion"
        description="Smooth expand/collapse using CSS grid-template-rows transition. One item open by default, keyboard navigable, with proper aria-expanded / aria-controls wiring."
      />

      <div className="mx-auto mt-12 max-w-3xl">
        <ul className="flex flex-col gap-3">
          {demoFaqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <li
                key={item.q}
                className="overflow-hidden rounded-2xl border border-bg-grey bg-white"
              >
                <h3 style={{ margin: 0 }}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`ds-faq-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-bg-light"
                  >
                    <span
                      className="text-[16px] font-semibold"
                      style={{ color: 'var(--heading-font-color)' }}
                    >
                      {item.q}
                    </span>
                    <span
                      className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300"
                      style={{
                        background: isOpen ? 'var(--primary-color)' : 'rgba(74,124,210,0.1)',
                        color: isOpen ? '#fff' : 'var(--primary-color)',
                      }}
                      aria-hidden="true"
                    >
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>
                </h3>
                <div
                  id={`ds-faq-${i}`}
                  style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.35s ease',
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-[15px] leading-relaxed text-body">
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}

/* =========================================================================
   ALERTS & BANNERS
   ========================================================================= */

function AlertsSection() {
  return (
    <Section id="ds-alerts" bg="white">
      <SectionIntro
        eyebrow="11 · Feedback"
        heading="Alerts & Banners"
        description="Four alert tones for inline feedback, plus the full-width booking CTA banner used near the end of the home page."
      />

      <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Alert
          tone="info"
          icon={<Info size={20} color="#1d4ed8" />}
          title="Heads up"
          body="Our office will be closed Monday for a team training day. Regular hours resume Tuesday."
        />
        <Alert
          tone="success"
          icon={<CheckCircle2 size={20} color="#16a34a" />}
          title="Appointment confirmed"
          body="We've sent your visit details to jane@example.com. Reply to that email to reschedule."
        />
        <Alert
          tone="warning"
          icon={<AlertCircle size={20} color="#d97706" />}
          title="Insurance update needed"
          body="Your provider information expired last month. Please update your profile before your next visit."
        />
        <Alert
          tone="error"
          icon={<XCircle size={20} color="#dc2626" />}
          title="We couldn't save your changes"
          body="Please check your internet connection and try again, or call us at +1 (123) 456-789."
        />
      </div>

      <div className="mt-12">
        <h3 className="mb-5" style={{ marginBottom: 20 }}>
          Full-width booking CTA
        </h3>
        <section
          className="relative overflow-hidden rounded-[20px]"
          style={{
            background: 'linear-gradient(135deg, var(--primary-color) 0%, #2f5fb0 100%)',
            color: '#fff',
          }}
          aria-label="Booking CTA example"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full"
            style={{ background: 'rgba(234,166,56,0.18)' }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full"
            style={{ background: 'rgba(255,255,255,0.08)' }}
            aria-hidden="true"
          />
          <div className="relative flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-12">
            <div className="max-w-2xl">
              <p
                className="mb-3 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em]"
                style={{ color: 'rgba(255,255,255,0.85)' }}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: 'var(--secondary-color)' }}
                  aria-hidden="true"
                />
                Same-day appointments available
              </p>
              <h2
                style={{
                  color: '#fff',
                  fontSize: 'clamp(28px, 4vw, 44px)',
                  marginBottom: 0,
                }}
              >
                Ready to book your dental care session?
              </h2>
            </div>
            <a href="#contact" className="btn btn-white btn-lg">
              Book Appointment <ArrowRight size={18} />
            </a>
          </div>
        </section>
      </div>
    </Section>
  );
}

interface AlertProps {
  tone: 'info' | 'success' | 'warning' | 'error';
  icon: React.ReactNode;
  title: string;
  body: string;
}

const alertStyles: Record<AlertProps['tone'], { bg: string; border: string }> = {
  info: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)' },
  success: { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)' },
  warning: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' },
  error: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' },
};

function Alert({ tone, icon, title, body }: AlertProps) {
  const s = alertStyles[tone];
  return (
    <div
      role="status"
      className="flex items-start gap-4 rounded-2xl p-5"
      style={{ background: s.bg, border: `1px solid ${s.border}` }}
    >
      <span className="mt-0.5 flex-shrink-0" aria-hidden="true">
        {icon}
      </span>
      <div className="min-w-0">
        <p
          className="text-[15px] font-semibold"
          style={{ color: 'var(--heading-font-color)', marginBottom: 4 }}
        >
          {title}
        </p>
        <p className="text-[14px] leading-relaxed text-body" style={{ marginBottom: 0 }}>
          {body}
        </p>
      </div>
    </div>
  );
}

/* =========================================================================
   LOADING STATES
   ========================================================================= */

function LoadingStatesSection() {
  return (
    <Section id="ds-loading" bg="light">
      <SectionIntro
        eyebrow="12 · Asynchrony"
        heading="Loading States"
        description="Skeleton placeholders for content loads, an inline spinner for actions in flight, and a progress bar for deterministic operations."
      />

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="card-surface p-8">
          <h4 className="mb-5" style={{ marginBottom: 20 }}>
            Skeleton lines
          </h4>
          <div className="space-y-3">
            <SkeletonLine width="92%" />
            <SkeletonLine width="78%" />
            <SkeletonLine width="100%" />
            <SkeletonLine width="65%" />
          </div>
        </div>

        <div className="card-surface p-8">
          <h4 className="mb-5" style={{ marginBottom: 20 }}>
            Skeleton card
          </h4>
          <div className="flex items-start gap-4">
            <SkeletonCircle />
            <div className="flex-1 space-y-3">
              <SkeletonLine width="60%" />
              <SkeletonLine width="40%" />
              <SkeletonLine width="90%" />
            </div>
          </div>
        </div>

        <div className="card-surface p-8">
          <h4 className="mb-5" style={{ marginBottom: 20 }}>
            Inline spinner
          </h4>
          <div className="flex items-center gap-3">
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-full"
              style={{ background: 'rgba(74,124,210,0.1)' }}
            >
              <Loader2
                size={18}
                color="var(--primary-color)"
                style={{ animation: 'spin 1s linear infinite' }}
              />
            </span>
            <p className="text-[14px] text-body" style={{ marginBottom: 0 }}>
              Loading appointments…
            </p>
          </div>

          <button type="button" className="btn btn-primary mt-6 w-full" disabled>
            <Loader2
              size={16}
              style={{ animation: 'spin 1s linear infinite' }}
            />
            Submitting
          </button>
        </div>

        <div className="card-surface p-8 lg:col-span-3">
          <h4 className="mb-5" style={{ marginBottom: 20 }}>
            Progress bar
          </h4>
          <ProgressBarDemo />
        </div>
      </div>
    </Section>
  );
}

function SkeletonLine({ width }: { width: string }) {
  return (
    <div
      className="h-3 rounded-full"
      style={{
        width,
        background:
          'linear-gradient(90deg, rgba(15,28,65,0.06) 0%, rgba(15,28,65,0.12) 50%, rgba(15,28,65,0.06) 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s ease-in-out infinite',
      }}
    />
  );
}

function SkeletonCircle() {
  return (
    <div
      className="h-12 w-12 flex-shrink-0 rounded-full"
      style={{
        background:
          'linear-gradient(90deg, rgba(15,28,65,0.06) 0%, rgba(15,28,65,0.12) 50%, rgba(15,28,65,0.06) 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s ease-in-out infinite',
      }}
    />
  );
}

function ProgressBarDemo() {
  const [value, setValue] = useState(62);
  return (
    <div>
      <div
        className="h-2 w-full overflow-hidden rounded-full"
        style={{ background: 'var(--bg-grey)' }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${value}%`,
            background:
              'linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
          }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-[13px]">
        <span style={{ color: 'var(--heading-font-color)' }}>
          <strong>{value}%</strong> complete
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setValue((v) => Math.max(0, v - 10))}
            className="btn btn-outline"
            style={{ padding: '6px 14px' }}
          >
            −10
          </button>
          <button
            type="button"
            onClick={() => setValue((v) => Math.min(100, v + 10))}
            className="btn btn-primary"
            style={{ padding: '6px 14px' }}
          >
            +10
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   COMPONENTS IN ACTION
   ========================================================================= */

function ComponentsInActionSection() {
  return (
    <Section id="ds-components" bg="white">
      <SectionIntro
        eyebrow="13 · Composition"
        heading="Components in Action"
        description="Reusable building blocks composed together to show how the system scales beyond individual primitives."
      />

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {serviceCardDemoData.map((service, i) => {
          const Icon = service.icon;
          return (
            <article
              key={service.title}
              className="card-surface group flex h-full flex-col p-8"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
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
                href="#ds-components"
                className="mt-auto inline-flex items-center gap-2 text-[14px] font-semibold uppercase tracking-[0.14em] transition-colors hover:text-secondary"
                style={{ color: 'var(--primary-color)' }}
              >
                Read More
                <span
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full"
                  style={{ background: 'rgba(74,124,210,0.1)' }}
                  aria-hidden="true"
                >
                  <Plus size={14} />
                </span>
              </a>
            </article>
          );
        })}
      </div>
    </Section>
  );
}

/* =========================================================================
   SECTION INTRO EXAMPLE
   ========================================================================= */

function SectionIntroExampleSection() {
  return (
    <Section bg="light">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="card-surface p-8">
          <h4 className="mb-4" style={{ marginBottom: 16 }}>
            Left aligned
          </h4>
          <SectionIntro
            eyebrow="Eyebrow label"
            heading="Section heading goes here"
            description="Optional supporting copy that sits below the heading and above the content."
            align="left"
          />
        </div>
        <div className="card-surface p-8">
          <h4 className="mb-4" style={{ marginBottom: 16 }}>
            Center aligned
          </h4>
          <SectionIntro
            eyebrow="Eyebrow label"
            heading="Section heading goes here"
            description="Optional supporting copy that sits below the heading and above the content."
            align="center"
          />
        </div>
      </div>

      <div className="mt-8">
        <div className="card-surface p-8">
          <h4 className="mb-4" style={{ marginBottom: 16 }}>
            Dark tone
          </h4>
          <div className="rounded-2xl bg-dark-2 p-8">
            <SectionIntro
              eyebrow="Eyebrow on dark"
              heading="Section heading on a dark surface"
              description="Tone: dark swaps the eyebrow color and forces heading text to white."
              align="left"
              tone="dark"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

/* =========================================================================
   REVEAL EXAMPLE
   ========================================================================= */

function RevealExampleSection() {
  const r1 = useReveal<HTMLDivElement>();
  const r2 = useReveal<HTMLDivElement>();
  const r3 = useReveal<HTMLDivElement>();
  return (
    <Section bg="white">
      <SectionIntro
        eyebrow="14 · Motion"
        heading="Reveal Animation"
        description="All sections opt-in to a soft fade-in-up as they scroll into view, driven by a single useReveal hook + IntersectionObserver. Respects prefers-reduced-motion."
      />

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div ref={r1} className="reveal card-surface p-8">
          <h4 style={{ marginBottom: 8 }}>Fade in once</h4>
          <p className="text-[15px] text-body">
            Default behavior — the element animates in once, then stays visible.
          </p>
        </div>
        <div ref={r2} className="reveal card-surface p-8">
          <h4 style={{ marginBottom: 8 }}>Scroll back &amp; forth</h4>
          <p className="text-[15px] text-body">
            Scroll down to reveal these cards, then scroll back up — they
            remain visible after first reveal.
          </p>
        </div>
        <div ref={r3} className="reveal card-surface p-8">
          <h4 style={{ marginBottom: 8 }}>Reduced motion</h4>
          <p className="text-[15px] text-body">
            If a user has prefers-reduced-motion enabled, the reveal is
            disabled and content appears immediately.
          </p>
        </div>
      </div>
    </Section>
  );
}

/* =========================================================================
   LOGO EXAMPLE
   ========================================================================= */

function LogoExampleSection() {
  return (
    <Section bg="light" pad>
      <SectionIntro
        eyebrow="Brand"
        heading="Logo"
        description="The Lerio Dental Center wordmark with two color modes — dark on light surfaces, light on dark surfaces."
      />

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="card-surface flex items-center justify-center p-10">
          <Logo variant="dark" />
        </div>
        <div
          className="flex items-center justify-center rounded-[20px] p-10"
          style={{ background: 'var(--bg-dark-2)' }}
        >
          <Logo variant="light" />
        </div>
      </div>
    </Section>
  );
}

/* =========================================================================
   FOOTER
   ========================================================================= */

function DSFooter() {
  return (
    <footer className="bg-dark-2 text-white">
      <div className="container-x flex flex-col items-center justify-between gap-3 py-8 text-[13px] sm:flex-row">
        <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 0 }}>
          © {new Date().getFullYear()} Lerio Dental Center Design System · All tokens defined in
          <code
            className="ml-1 rounded px-1.5 py-0.5"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            src/index.css
          </code>
        </p>
        <a
          href="#ds-top"
          className="inline-flex items-center gap-2 font-semibold"
          style={{ color: 'var(--secondary-color)' }}
        >
          Back to top <ArrowRight size={14} style={{ transform: 'rotate(-90deg)' }} />
        </a>
      </div>
    </footer>
  );
}