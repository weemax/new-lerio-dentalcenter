/**
 * Centralized typed content for the Dentia marketing site.
 * All repeated copy and structured data lives here so components stay
 * presentation-focused and the site stays easy to maintain.
 */

import type { LucideIcon } from 'lucide-react';
import {
  Sparkles,
  Stethoscope,
  Baby,
  HeartPulse,
  Activity,
  AlignCenter,
  ShieldCheck,
  Wrench,
  Smile,
  Microscope,
  HeartHandshake,
  Users,
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
    dropdown: [
      { label: 'Homepage 1', href: '#' },
      { label: 'Homepage 2', href: '#' },
      { label: 'Homepage 3', href: '#' },
      { label: 'Homepage 4', href: '#' },
      { label: 'Homepage 5', href: '#' },
      { label: 'Homepage 6', href: '#' },
      { label: 'Homepage 7', href: '#' },
    ],
  },
  {
    label: 'Services',
    dropdown: [
      { label: 'General Dentistry', href: '#services' },
      { label: 'Cosmetic Dentistry', href: '#services' },
      { label: 'Pediatric Dentistry', href: '#services' },
      { label: 'Restorative Dentistry', href: '#services' },
      { label: 'Preventive Dentistry', href: '#services' },
      { label: 'Orthodontics', href: '#services' },
      { label: 'All Services', href: '#services' },
    ],
  },
  {
    label: 'Dentists',
    href: '#team',
  },
  {
    label: 'Pages',
    dropdown: [
      { label: 'About Us', href: '#about' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Gallery', href: '#' },
      { label: 'Testimonials', href: '#testimonials' },
    ],
  },
  {
    label: 'Blog',
    href: '#blog',
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
    eyebrow: 'Family Dental Care',
    headline: 'Elevating Smiles with Expert Care and a Gentle Touch',
    image:
      'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1400&q=80',
  },
  {
    eyebrow: 'Modern Cosmetic Dentistry',
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
}> = [
  { icon: 'phone', title: 'Need Dental Services?', value: 'Call: +1 123 456 789' },
  { icon: 'clock', title: 'Opening Hours', value: 'Mon to Sat 08:00 - 20:00' },
  { icon: 'mail', title: 'Email Us', value: 'contact@dentiaclinic.com' },
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
    title: 'General Dentistry',
    description:
      'Comprehensive exams, cleanings, and preventive treatments to keep your smile healthy year-round.',
    icon: Stethoscope,
  },
  {
    title: 'Cosmetic Dentistry',
    description:
      'Whitening, veneers, and smile makeovers crafted to highlight the best version of you.',
    icon: Sparkles,
  },
  {
    title: 'Pediatric Dentistry',
    description:
      'A gentle, playful environment where children build healthy habits and fearless dental visits.',
    icon: Baby,
  },
  {
    title: 'Restorative Dentistry',
    description:
      'Crowns, bridges, and implants that restore comfort, function, and natural appearance.',
    icon: Wrench,
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
  { value: 10000, suffix: '+', label: 'Happy Patients' },
  { value: 2500, suffix: '+', label: 'Teeth Whitened' },
  { value: 800, suffix: '+', label: 'Dental Implants' },
  { value: 15, suffix: '+', label: 'Years of Experience' },
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
    title: 'Experienced Dental',
    description: 'Skilled care backed by years of trusted dental experience.',
    icon: ShieldCheck,
  },
  {
    title: 'Advanced Technology',
    description: 'Modern tools ensure accurate and efficient treatments.',
    icon: Microscope,
  },
  {
    title: 'Personalized Treatment',
    description: 'Custom care plans made to fit your smile and lifestyle.',
    icon: HeartHandshake,
  },
  {
    title: 'Family-Friendly',
    description: 'Welcoming space for kids, teens, adults, and seniors.',
    icon: Users,
  },
];

/* ------------------------------------------------------------------------- */
/* Team                                                                       */
/* ------------------------------------------------------------------------- */

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export const team: TeamMember[] = [
  {
    name: 'Dr. Sarah Bennett',
    role: 'Lead Dentist',
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Dr. Maya Lin',
    role: 'Cosmetic Dentist',
    image:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Dr. Ethan Brooks',
    role: 'Orthodontist',
    image:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Dr. Olivia Carter',
    role: 'Pediatric Dentist',
    image:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80',
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
    question: 'How often should I visit the dentist?',
    answer:
      'It’s recommended to see your dentist every 6 months for a routine check-up and cleaning, unless advised otherwise.',
  },
  {
    question: 'What should I do in a dental emergency?',
    answer:
      'Call our office immediately. We offer same-day emergency care for issues like severe pain, broken teeth, or swelling.',
  },
  {
    question: 'Do you offer services for kids?',
    answer:
      'Absolutely. We provide gentle, friendly pediatric dental care for children of all ages.',
  },
  {
    question: 'What are my options for replacing missing teeth?',
    answer:
      'We offer dental implants, bridges, and dentures depending on your needs and preferences.',
  },
  {
    question: 'Is teeth whitening safe?',
    answer:
      'Yes, when performed by a dental professional, teeth whitening is safe and effective with long-lasting results.',
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
    name: 'Jessica Harmon',
    role: 'Patient',
    quote:
      'From the moment I walked in, I felt cared for. The team explained every step and the results of my cosmetic work exceeded what I imagined.',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Marcus O’Connell',
    role: 'Patient',
    quote:
      'I avoided dentists for years out of fear. Dentia changed that. Calm room, gentle hands, and a clear plan I could actually trust.',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Priya Raman',
    role: 'Patient',
    quote:
      'My kids actually look forward to their visits. The pediatric team is patient, kind, and brilliant at what they do.',
    avatar:
      'https://images.unsplash.com/photo-1573497019418-b400bb3ab074?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Daniel Whitfield',
    role: 'Patient',
    quote:
      'My implant treatment was smoother than I expected. Modern equipment, transparent pricing, and real follow-up care afterwards.',
    avatar:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Amelia Cruz',
    role: 'Patient',
    quote:
      'Booking was easy, the office is beautiful, and my smile makeover feels like a quiet confidence boost every single day.',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
  },
];

/* ------------------------------------------------------------------------- */
/* Footer                                                                     */
/* ------------------------------------------------------------------------- */

export const footerColumns: Array<{ title: string; links: NavDropdownItem[] }> = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#about' },
      { label: 'Our Team', href: '#team' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  {
    title: 'Our Services',
    links: [
      { label: 'General Dentistry', href: '#services' },
      { label: 'Cosmetic Dentistry', href: '#services' },
      { label: 'Pediatric Dentistry', href: '#services' },
      { label: 'Restorative Dentistry', href: '#services' },
      { label: 'Orthodontics', href: '#services' },
    ],
  },
];

/* ------------------------------------------------------------------------- */
/* About checklist                                                            */
/* ------------------------------------------------------------------------- */

export const aboutChecklist: string[] = [
  'Personalized Treatment Plans',
  'Gentle Care for Kids and Adults',
  'State-of-the-Art Technology',
  'Flexible Appointment Scheduling',
];

/* ------------------------------------------------------------------------- */
/* Why Choose — image composition labels (for alt text)                      */
/* ------------------------------------------------------------------------- */

export const whyChooseImages = {
  primary: 'Dentist reviewing a patient scan',
  secondary: 'Modern dental treatment room',
  tertiary: 'Smiling patient after treatment',
};

/* ------------------------------------------------------------------------- */
/* Testimonial / generic icons exposed for re-use                             */
/* ------------------------------------------------------------------------- */

export { Smile, HeartPulse, Activity, AlignCenter };