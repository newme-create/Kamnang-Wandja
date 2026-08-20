export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  metric: string;
  image: string;
  gallery: string[];
  description: string;
  location: string;
  client: string;
  beforeAfter?: {
    before: string;
    after: string;
    beforeLabel: string;
    afterLabel: string;
  };
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  location: string;
  tag: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconType: 'construction' | 'genie-civil' | 'travaux-publics' | 'renovation' | 'etudes' | 'gestion';
  highlights: string[];
}

export interface StatItem {
  value: string;
  number: number;
  suffix: string;
  label: string;
  description: string;
  iconType: 'experience' | 'projects' | 'experts' | 'satisfaction';
}

export interface NewsItem {
  id: string;
  day: string;
  monthYear: string;
  title: string;
  subtitle: string;
  fullContent: string;
  image: string;
  category: string;
  readTime: string;
}

export interface MilestoneSection {
  num: string;
  label: string;
  targetId: string;
}
