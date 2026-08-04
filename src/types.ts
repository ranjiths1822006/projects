export type TemplateId = 'modern' | 'classic' | 'minimal' | 'executive' | 'creative' | 'clean_ats';

export type FontFamily = 'sans' | 'serif' | 'mono' | 'display';

export type FontSize = 'sm' | 'md' | 'lg';

export type SkillCategory = 'Technical' | 'Soft' | 'Tools' | 'Frameworks' | 'Other';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  photoUrl?: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights?: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  link?: string;
  bullets: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialUrl?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';
}

export interface ThemeConfig {
  templateId: TemplateId;
  primaryColor: string;
  fontFamily: FontFamily;
  fontSize: FontSize;
  showIcons: boolean;
}

export interface ResumeData {
  id: string;
  userId?: string;
  title: string;
  personalInfo: PersonalInfo;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  theme: ThemeConfig;
  updatedAt?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isGuest?: boolean;
}

export interface ATSAnalysisResult {
  score: number;
  summaryFeedback: string;
  strengths: string[];
  improvements: string[];
  recommendedKeywords: string[];
}
