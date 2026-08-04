import { ResumeData } from '../types';

export const initialResumeData: ResumeData = {
  id: 'default_sample_resume',
  title: 'Senior Software Engineer Resume',
  personalInfo: {
    fullName: 'Alex Vance',
    jobTitle: 'Senior Full Stack & AI Engineer',
    email: 'alex.vance@example.com',
    phone: '+1 (555) 382-9102',
    location: 'San Francisco, CA',
    website: 'https://alexvance.dev',
    linkedin: 'linkedin.com/in/alexvance',
    github: 'github.com/alexvance',
    summary: 'Results-driven Senior Full Stack Engineer with 7+ years of experience designing high-scale web applications and integrating generative AI workflows. Expert in React, TypeScript, Node.js, and cloud platforms. Proven track record of boosting system performance by 40% and leading cross-functional engineering teams.'
  },
  experience: [
    {
      id: 'exp-1',
      company: 'Apex Cloud Systems',
      position: 'Senior Full Stack Engineer',
      location: 'San Francisco, CA',
      startDate: '2023-01',
      endDate: 'Present',
      isCurrent: true,
      bullets: [
        'Architected and deployed enterprise micro-frontends with React 19 and Vite, reducing page load latency by 38% for 120,000 active daily users.',
        'Engineered an AI-driven automated content pipeline utilizing Gemini API and Node.js, cutting manual processing time by 15 hours per week.',
        'Mentored 6 junior/mid-level software engineers and led sprint planning, code reviews, and architecture design meetings.'
      ]
    },
    {
      id: 'exp-2',
      company: 'DataPulse Analytics',
      position: 'Software Engineer',
      location: 'Austin, TX',
      startDate: '2020-06',
      endDate: '2022-12',
      isCurrent: false,
      bullets: [
        'Developed scalable REST and GraphQL APIs using TypeScript, Express, and PostgreSQL, handling over 2M daily requests with 99.98% uptime.',
        'Implemented real-time data visualization dashboards with Recharts and Tailwind CSS, increasing client user engagement by 28%.',
        'Optimized database queries and Redis caching layer, lowering API response times from 350ms to under 80ms.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      location: 'Berkeley, CA',
      startDate: '2016-08',
      endDate: '2020-05',
      gpa: '3.88 / 4.0',
      highlights: [
        'Dean\'s Honor List (6 Semesters)',
        'President of Computer Science Society'
      ]
    }
  ],
  skills: [
    { id: 'sk-1', name: 'React / Next.js', category: 'Technical', level: 'Expert' },
    { id: 'sk-2', name: 'TypeScript', category: 'Technical', level: 'Expert' },
    { id: 'sk-3', name: 'Node.js / Express', category: 'Technical', level: 'Advanced' },
    { id: 'sk-4', name: 'Generative AI / Gemini API', category: 'Technical', level: 'Advanced' },
    { id: 'sk-5', name: 'Tailwind CSS', category: 'Technical', level: 'Expert' },
    { id: 'sk-6', name: 'PostgreSQL / Firebase', category: 'Technical', level: 'Advanced' },
    { id: 'sk-7', name: 'Docker & Cloud Deployment', category: 'Tools', level: 'Intermediate' },
    { id: 'sk-8', name: 'System Architecture & Design', category: 'Soft', level: 'Advanced' }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'AI Resume Builder & ATS Scorer',
      description: 'Full-stack application allowing job seekers to craft ATS-optimized resumes with real-time AI bullet points enhancement and instant PDF/Word downloads.',
      techStack: ['React', 'TypeScript', 'Gemini API', 'Tailwind CSS', 'Firebase'],
      link: 'https://github.com/alexvance/ai-resume-builder',
      bullets: [
        'Integrated Gemini 3.6 Flash for intelligent resume bullet enhancement and ATS scoring.',
        'Built custom PDF & Docx export engines supporting 4 distinct professional templates.'
      ]
    },
    {
      id: 'proj-2',
      title: 'DevFlow - Real-time Kanban Collaboration',
      description: 'Collaborative task management board featuring drag-and-drop workflow and WebSockets.',
      techStack: ['React', 'Node.js', 'Socket.io', 'Tailwind CSS'],
      link: 'https://devflow.example.app',
      bullets: [
        'Handled real-time state synchronization across concurrent user sessions with sub-50ms latency.'
      ]
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      issueDate: '2022-11',
      expirationDate: '2025-11',
      credentialUrl: 'https://aws.amazon.com/verify'
    }
  ],
  languages: [
    { id: 'lang-1', name: 'English', proficiency: 'Native' },
    { id: 'lang-2', name: 'Spanish', proficiency: 'Intermediate' }
  ],
  theme: {
    templateId: 'modern',
    primaryColor: '#2563eb', // Indigo / Royal Blue
    fontFamily: 'sans',
    fontSize: 'md',
    showIcons: true
  }
};
