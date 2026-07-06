/**
 * Centralized typed content for the Lerio Dental Center marketing site.
 * All repeated copy and structured data lives here so components stay
 * presentation-focused and the site stays easy to maintain.
 *
 * Brand: Lerio Dental Center
 * Tagline: Gentle, comprehensive dental care in Dumaguete City
 * Lead doctors: Dr. Myrine Lerio, Dr. Francine Nicole Lerio, Dr. Yumi Sayade Alquisalas
 */

import type { LucideIcon } from 'lucide-react';
import {
  Sparkles,
  Stethoscope,
  Baby,
  ShieldCheck,
  Wrench,
  Smile,
  Microscope,
  HeartHandshake,
  Users,
  Syringe,
  ScanLine,
} from 'lucide-react';

/* ------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* ------------------------------------------------------------------------- */

export interface NavDropdownItem {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href?: string;
  dropdown?: NavDropdownItem[];
}

export const navItems: NavItem[] = [
  {
    label: 'Home',
    href: '#top',
  },
  {
    label: 'Services',
    dropdown: [
      { label: 'General & Family Dentistry', href: '#services' },
      { label: 'Pediatric Dentistry', href: '#services' },
      { label: 'Cosmetic & Esthetic Dentistry', href: '#services' },
      { label: 'Orthodontics & Invisalign', href: '#services' },
      { label: 'Dental Implants & Surgery', href: '#services' },
      { label: 'Root Canal Therapy', href: '#services' },
      { label: 'Prosthodontics', href: '#services' },
      { label: 'All Services', href: '#services' },
    ],
  },
  {
    label: 'Dentists',
    href: '#team',
  },
  {
    label: 'About',
    dropdown: [
      { label: 'About Us', href: '#about' },
      { label: 'Why Choose Us', href: '#why' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Testimonials', href: '#testimonials' },
    ],
  },
  {
    label: 'Contact',
    href: '#contact',
  },
];

/* ------------------------------------------------------------------------- */
/* Hero slides                                                                */
/* ------------------------------------------------------------------------- */

export interface HeroSlide {
  eyebrow: string;
  headline: string;
  image: string;
}

export const heroSlides: HeroSlide[] = [
  {
    eyebrow: 'Lerio Dental Center · Dumaguete City',
    headline: 'Gentle, Comprehensive Dental Care for the Whole Family',
    image:
      'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1400&q=80',
  },
  {
    eyebrow: 'Invisalign Provider · Esthetic Dentistry',
    headline: 'Confidence Begins With a Smile You Love to Share',
    image:
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1400&q=80',
  },
];

/* ------------------------------------------------------------------------- */
/* Contact info strip                                                         */
/* ------------------------------------------------------------------------- */

export const infoStrip: Array<{
  title: string;
  value: string;
  icon: 'phone' | 'clock' | 'mail';
  href?: string;
}> = [
  { icon: 'phone', title: 'Book an Appointment', value: '0936-542-2515 · 0992-474-4274', href: 'tel:+639365422515' },
  { icon: 'clock', title: 'Clinic Hours', value: 'Mon – Sat · Sunday by appointment' },
  { icon: 'mail', title: 'Email Us', value: 'contact.leriodentaleenter@gmail.com', href: 'mailto:contact.leriodentaleenter@gmail.com' },
];

/* ------------------------------------------------------------------------- */
/* Services                                                                   */
/* ------------------------------------------------------------------------- */

export interface Service {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const services: Service[] = [
  {
    title: 'General & Family Dentistry',
    description:
      'Routine check-ups, cleanings, fillings, and preventive care for every member of the family — from first tooth to senior care.',
    icon: Stethoscope,
  },
  {
    title: 'Cosmetic & Esthetic Dentistry',
    description:
      'Whitening, veneers, and esthetic restorations designed to bring out the natural beauty of your smile.',
    icon: Sparkles,
  },
  {
    title: 'Pediatric Dentistry',
    description:
      'A calm, kid-friendly environment where children build healthy habits and fearless dental visits from the very start.',
    icon: Baby,
  },
  {
    title: 'Orthodontics & Invisalign',
    description:
      'Certified Invisalign provider — clear aligners and traditional braces that straighten teeth comfortably and discreetly.',
    icon: Smile,
  },
  {
    title: 'Dental Implants & Surgery',
    description:
      'Implantology and oral surgery performed with precision, using modern techniques for predictable, lasting results.',
    icon: Wrench,
  },
  {
    title: 'Root Canal Therapy',
    description:
      'Gentle endodontic treatment to relieve pain and save natural teeth — usually completed in a single visit.',
    icon: Syringe,
  },
  {
    title: 'Prosthodontics',
    description:
      'Crowns, bridges, and dentures crafted to restore comfort, function, and a natural-looking smile.',
    icon: ScanLine,
  },
  {
    title: 'Geriatric Dentistry',
    description:
      'Specialized, patient-focused care for seniors — gentle treatment plans adapted to long-term comfort and health.',
    icon: HeartHandshake,
  },
];

/* ------------------------------------------------------------------------- */
/* Stats                                                                      */
/* ------------------------------------------------------------------------- */

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const stats: Stat[] = [
  { value: 10000, suffix: '+', label: 'Patients Served' },
  { value: 15, suffix: '+', label: 'Years of Practice' },
  { value: 100, suffix: '%', label: 'Autoclave-Sterilized Instruments' },
  { value: 6, suffix: '/7', label: 'Days Open · Mon to Sat' },
];

/* ------------------------------------------------------------------------- */
/* Why Choose Us — benefits                                                   */
/* ------------------------------------------------------------------------- */

export interface Benefit {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const benefits: Benefit[] = [
  {
    title: 'Complete Dental Services',
    description:
      'From pediatric and geriatric care to orthodontics, implants, endodontics, and prosthodontics — all under one roof.',
    icon: ShieldCheck,
  },
  {
    title: 'Safety First',
    description:
      '100% of our instruments undergo rigorous autoclave sterilization, meeting the highest standards of hygiene.',
    icon: Microscope,
  },
  {
    title: 'Transparent Care',
    description:
      'Clear communication about your treatment plan, financing options, and the path to long-term oral health.',
    icon: HeartHandshake,
  },
  {
    title: 'Convenient Scheduling',
    description:
      'Open Monday through Saturday, with Sunday appointments available. We respect your time and your smile.',
    icon: Users,
  },
];

/* ------------------------------------------------------------------------- */
/* Team                                                                       */
/* ------------------------------------------------------------------------- */

export interface TeamMember {
  name: string;
  role: string;
  credentials?: string;
  image: string;
}

export const team: TeamMember[] = [
  {
    name: 'Dr. Myrine Lerio',
    role: 'Lead Dentist · Clinic Director',
    credentials: 'General, Cosmetic & Family Dentistry',
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Dr. Francine Nicole Lerio',
    role: 'Associate Dentist',
    credentials: 'Orthodontics · Invisalign Provider',
    image:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Dr. Yumi Sayade Alquisalas',
    role: 'Associate Dentist',
    credentials: 'Pediatric · Restorative Dentistry',
    image:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Dr. Andrea Reyes',
    role: 'Associate Dentist',
    credentials: 'Endodontics · Prosthodontics',
    image:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
  },
];

/* ------------------------------------------------------------------------- */
/* FAQ                                                                        */
/* ------------------------------------------------------------------------- */

export interface FAQ {
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    question: 'Where is Lerio Dental Center located?',
    answer:
      'We are conveniently located on Dr. V. Locsin Street, Dumaguete City, Negros Oriental — easy to find and accessible from anywhere in the city.',
  },
  {
    question: 'What are your clinic hours?',
    answer:
      'Our clinic is open Monday through Saturday. Sunday appointments are also available for your convenience — just give us a call to schedule.',
  },
  {
    question: 'How do I book an appointment?',
    answer:
      'Call or message us at 0936-542-2515 (TM) or 0992-474-4274 (DITO). You can also email contact.leriodentaleenter@gmail.com and our team will confirm your visit.',
  },
  {
    question: 'Do you offer Invisalign and orthodontics?',
    answer:
      'Yes. We are a certified Invisalign provider and also offer traditional orthodontic treatment. We’ll recommend the option that best fits your smile and lifestyle.',
  },
  {
    question: 'How do you ensure safety and hygiene?',
    answer:
      '100% of our instruments undergo rigorous autoclave sterilization. We follow strict infection-control protocols so every visit is safe and clean.',
  },
  {
    question: 'Do you provide care for children and seniors?',
    answer:
      'Absolutely. Our team is experienced in pediatric dentistry and geriatric dentistry, with calm, patient-focused treatment plans for every age.',
  },
  {
    question: 'Will I understand my treatment plan and costs?',
    answer:
      'Yes. Transparent communication is one of our core values. We walk you through the recommended treatment, the financing options, and what to expect at every step.',
  },
];

/* ------------------------------------------------------------------------- */
/* Testimonials                                                               */
/* ------------------------------------------------------------------------- */

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Maria Santos',
    role: 'Patient · Dumaguete City',
    quote:
      'The team at Lerio made my Invisalign journey easy and actually enjoyable. Every visit felt calm, well-explained, and genuinely caring.',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Jonathan Villanueva',
    role: 'Patient · Dumaguete City',
    quote:
      'I’ve always been nervous at the dentist, but Dr. Myrine and her staff are so gentle. The clinic is spotless and the equipment feels modern.',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Patricia Lim',
    role: 'Parent of Patient',
    quote:
      'My kids actually look forward to their dental visits. The pediatric team is patient, kind, and brilliant with children.',
    avatar:
      'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Roberto Abaño',
    role: 'Patient · Dumaguete City',
    quote:
      'Honest, transparent, and painless. They explained every option clearly and helped me choose what was best — not what was most expensive.',
    avatar:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Andrea Tan',
    role: 'Patient · Negros Oriental',
    quote:
      'From the front desk to the chair, everyone at Lerio Dental Center is warm and professional. Truly the best dental experience I’ve had.',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
  },
];

/* ------------------------------------------------------------------------- */
/* Footer                                                                     */
/* ------------------------------------------------------------------------- */

export const footerColumns: Array<{ title: string; links: NavDropdownItem[] }> = [
  {
    title: 'Clinic',
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'Our Dentists', href: '#team' },
      { label: 'Why Choose Us', href: '#why' },
      { label: 'Testimonials', href: '#testimonials' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'General & Family Dentistry', href: '#services' },
      { label: 'Pediatric Dentistry', href: '#services' },
      { label: 'Cosmetic Dentistry', href: '#services' },
      { label: 'Orthodontics & Invisalign', href: '#services' },
      { label: 'Dental Implants & Surgery', href: '#services' },
      { label: 'Root Canal Therapy', href: '#services' },
      { label: 'Prosthodontics', href: '#services' },
    ],
  },
];

/* ------------------------------------------------------------------------- */
/* About checklist                                                            */
/* ------------------------------------------------------------------------- */

export const aboutChecklist: string[] = [
  'Complete Dental Services for All Ages',
  '100% Autoclave-Sterilized Instruments',
  'Transparent Treatment Plans & Pricing',
  'Open Monday – Saturday, Sunday by Appointment',
];

/* ------------------------------------------------------------------------- */
/* Why Choose — image composition labels (for alt text)                      */
/* ------------------------------------------------------------------------- */

export const whyChooseImages = {
  primary: 'Dentist at Lerio Dental Center reviewing a patient scan',
  secondary: 'Modern dental treatment room in Dumaguete',
  tertiary: 'Smiling patient after treatment at Lerio Dental Center',
};