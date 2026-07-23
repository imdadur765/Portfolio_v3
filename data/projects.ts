export interface Project {
  id: string;
  title: string;
  category: 'E-Commerce' | 'DevTools' | 'SaaS' | 'Publishing';
  tagline: string;
  description: string;
  features: string[];
  techStack: string[];
  liveUrl: string;
  githubUrl?: string;
  badge: string;
  featured: boolean;
  accentColor: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'nexa-store',
    title: 'Nexa Store',
    category: 'E-Commerce',
    tagline: 'Modern Digital Commerce Platform',
    description:
      'A high-performance digital storefront engineered for speed, immersive product discovery, and friction-free checkout workflows.',
    features: [
      'Instant search and fluid collection filtering',
      'Minimalist glassmorphic product showcase cards',
      'Real-time cart synchronization and responsive checkout',
    ],
    techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    liveUrl: 'https://nexa-store-5sosssgue-imdadur765s-projects.vercel.app/',
    badge: 'COMMERCE',
    featured: true,
    accentColor: '#3b82f6',
  },
  {
    id: 'extractor-pro',
    title: 'Extractor Pro',
    category: 'DevTools',
    tagline: 'Data Extraction & Web Intelligence Suite',
    description:
      'An intelligent web extraction tool built to transform unstructured web data into structured JSON datasets in seconds.',
    features: [
      'Automated DOM pattern recognition',
      'Custom schema exporter (JSON / CSV)',
      'High-throughput asynchronous extraction engine',
    ],
    techStack: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
    liveUrl: 'https://extractor-pro-six.vercel.app/',
    badge: 'DEV TOOLS',
    featured: true,
    accentColor: '#10b981',
  },
  {
    id: 'mailforge',
    title: 'MailForge',
    category: 'SaaS',
    tagline: 'High-Deliverability Email Infrastructure',
    description:
      'A lightweight email campaign platform designed for developers and creators to design, send, and analyze transactional emails.',
    features: [
      'Drag-and-drop dynamic template editor',
      'Real-time deliverability & bounce analytics',
      'REST API integration with instant webhook events',
    ],
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'REST API'],
    liveUrl: 'https://mailforge-kappa.vercel.app/',
    badge: 'SAAS PLATFORM',
    featured: true,
    accentColor: '#8b5cf6',
  },
  {
    id: 'valora-journal',
    title: 'Valora Journal',
    category: 'Publishing',
    tagline: 'Editorial & Academic Publication Journal',
    description:
      'A digital publication journal showcasing research, essays, and long-form editorial content with refined typography and layout.',
    features: [
      'Refined editorial typography and reading mode',
      'Category-based article archiving & search',
      'Responsive multi-column magazine grid',
    ],
    techStack: ['Next.js App Router', 'TypeScript', 'Tailwind CSS', 'MDX'],
    liveUrl: 'https://valorajournal.org',
    badge: 'PUBLICATION',
    featured: true,
    accentColor: '#f59e0b',
  },
];
