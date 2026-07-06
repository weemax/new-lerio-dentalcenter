# Dentia — Premium Dental Clinic Website

A complete React + Vite + Tailwind CSS v4 marketing site for a premium dental
clinic. Single-page composition with a sticky header, hero, info strip,
about, services, stats, why-choose-us, team, FAQ, testimonials, booking CTA,
contact, and footer.

## Stack

- **React 18** + **TypeScript** + **Vite 5**
- **Tailwind CSS v4** (CSS-first config via `@theme inline` in `src/index.css`)
- **lucide-react** for icons
- No additional runtime libraries — animations are CSS + Intersection Observer
- No backend; all content is typed mock data in `src/data/content.ts`

## Design Tokens

All tokens are defined as CSS custom properties in `:root` inside
`src/index.css`, then exposed as Tailwind utilities via `@theme inline`.
Fonts: **Inter** (body / UI) and **Urbanist** (display headings), loaded from
Google Fonts in `index.html`.

## Scripts

```bash
npm install
npm run dev        # start dev server on http://localhost:5173
npm run build      # type-check + production build
npm run preview    # preview the production build
```

## Structure

```
src/
  App.tsx                  # Home page composition
  main.tsx                 # React entry
  index.css                # Tailwind v4 import + design tokens + utilities
  data/content.ts          # Typed mock data (nav, services, team, FAQ, etc.)
  hooks/
    useReveal.ts           # Intersection-Observer reveal animation
    useCountUp.ts          # rAF count-up + in-view gate
    useScrolledPast.ts     # Header transparent→solid transition
  components/
    Section.tsx            # Section wrapper with bg/padding tokens
    SectionIntro.tsx       # Centered intro block (eyebrow + h2 + p)
    Logo.tsx               # Brand wordmark
    Header.tsx             # Sticky transparent→solid header
    NavMenu.tsx            # Desktop dropdown menu
    MobileMenu.tsx         # Full-screen mobile menu with accordions
    HeroSection.tsx        # Auto-rotating hero with dual CTA + trust row
    InfoStrip.tsx          # Dark contact band under the hero
    AboutSection.tsx       # 2-col About with image collage + checklist
    ServicesSection.tsx    # Light tinted, 4-card service grid
    ServiceCard.tsx        # Single service card
    StatsBand.tsx          # Dark band with animated counters
    WhyChooseSection.tsx   # 2-col benefits + image composition
    TeamSection.tsx        # 4-card team grid
    TeamCard.tsx           # Doctor profile card with hover socials
    FAQAccordion.tsx       # 2-col FAQ with accessible accordion
    TestimonialsSection.tsx# Horizontal scroll + grid testimonial cards
    TestimonialCard.tsx    # Single testimonial card
    BookingCTA.tsx         # Primary-colored CTA band
    ContactSection.tsx     # Contact info + working form w/ confirmation
    Footer.tsx             # Dark footer with link columns + legal bar
```

## Accessibility

- Semantic HTML5 (`header`, `nav`, `main`, `section`, `article`, `footer`).
- Keyboard-operable dropdowns, accordion, mobile menu, slider controls.
- ARIA attributes: `aria-expanded`, `aria-controls`, `aria-haspopup`,
  `aria-modal`, `aria-label`, `role="menu"`, `role="region"`, etc.
- Visible focus rings via `:focus-visible`.
- `prefers-reduced-motion` honored — animations disabled for users who opt out.
- All decorative images have `alt=""`; meaningful images have descriptive `alt`.

## Responsive

Mobile-first with breakpoints at 640 / 768 / 1024 / 1280.
Section padding: 60px on mobile, 100px on desktop.
Container max-width: 1240px.