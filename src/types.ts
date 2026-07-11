export interface GeneralInfo {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  logoText: string;
  logoImage: string; // Base64 or URL
  profileImage: string; // Base64 or URL
  email: string;
  phone: string;
  address: string;
  github: string;
  linkedin: string;
  twitter: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  tags: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
  description: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  category: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}

export interface PortfolioData {
  general: GeneralInfo;
  work: WorkExperience[];
  education: Education[];
  gallery: GalleryItem[];
  messages: ContactMessage[];
}
