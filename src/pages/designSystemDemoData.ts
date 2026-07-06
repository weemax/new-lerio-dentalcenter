/**
 * Local mock data used only by the DesignSystem showcase page.
 * Keeps the showcase self-contained without polluting the main content module.
 */

import {
  Stethoscope,
  Sparkles,
  Baby,
  Wrench,
} from 'lucide-react';

export const serviceCardDemoData = [
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