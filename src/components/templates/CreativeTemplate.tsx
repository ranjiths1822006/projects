import React from 'react';
import { ResumeData } from '../../types';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  Github, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  FolderGit2, 
  Award,
  User
} from 'lucide-react';

interface CreativeTemplateProps {
  data: ResumeData;
}

export const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ data }) => {
  const { personalInfo, experience, education, skills, projects, certifications, languages, theme } = data;
  const primaryColor = theme?.primaryColor || '#7c3aed'; // Creative Violet / Indigo default

  // Helper for initials
  const initials = personalInfo.fullName
    ? personalInfo.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'RA';

  return (
    <div 
      className="w-full bg-white text-slate-800 shadow-sm font-sans flex flex-col md:flex-row overflow-hidden"
      style={{ minHeight: '1123px' }}
    >
      {/* Sidebar / Left Panel */}
      <aside 
        className="w-full md:w-1/3 p-6 text-white flex flex-col justify-between shrink-0"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="space-y-6">
          {/* Avatar / Photo */}
          <div className="flex flex-col items-center text-center">
            {personalInfo.photoUrl ? (
              <img 
                src={personalInfo.photoUrl} 
                alt={personalInfo.fullName} 
                className="w-28 h-28 rounded-full object-cover border-4 border-white/30 shadow-md mb-3"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-black text-2xl shadow-inner mb-3">
                {initials}
              </div>
            )}
            <h1 className="text-xl font-black tracking-tight text-white leading-snug">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            <p className="text-xs font-semibold text-white/80 mt-1 uppercase tracking-wider">
              {personalInfo.jobTitle || 'Creative Professional'}
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-2.5 pt-4 border-t border-white/20 text-xs">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-white/60 mb-2">
              Contact
            </h2>
            {personalInfo.email && (
              <div className="flex items-center gap-2 text-white/90 break-all">
                <Mail className="w-3.5 h-3.5 shrink-0 text-white/70" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2 text-white/90">
                <Phone className="w-3.5 h-3.5 shrink-0 text-white/70" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-white/70" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2 text-white/90 break-all">
                <Linkedin className="w-3.5 h-3.5 shrink-0 text-white/70" />
                <span>{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center gap-2 text-white/90 break-all">
                <Github className="w-3.5 h-3.5 shrink-0 text-white/70" />
                <span>{personalInfo.github}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-2 text-white/90 break-all">
                <Globe className="w-3.5 h-3.5 shrink-0 text-white/70" />
                <span>{personalInfo.website}</span>
              </div>
            )}
          </div>

          {/* Skills Badges */}
          {skills && skills.length > 0 && (
            <div className="pt-4 border-t border-white/20">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-white/60 mb-3 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                Expertise & Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span 
                    key={s.id} 
                    className="text-[11px] bg-white/15 hover:bg-white/25 text-white font-medium px-2.5 py-1 rounded-full border border-white/25 backdrop-blur-xs transition-colors"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="pt-4 border-t border-white/20">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-white/60 mb-2">
                Languages
              </h2>
              <ul className="space-y-1 text-xs text-white/90">
                {languages.map((lang, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <span className="font-semibold">{lang.name}</span>
                    <span className="text-[10px] text-white/70 uppercase">{lang.proficiency}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div className="pt-4 border-t border-white/20">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-white/60 mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                Certifications
              </h2>
              <ul className="space-y-1.5 text-xs text-white/90">
                {certifications.map((cert, idx) => (
                  <li key={cert.id || idx}>
                    <p className="font-bold">{cert.name}</p>
                    <p className="text-[10px] text-white/70">{cert.issuer} {cert.issueDate ? `• ${cert.issueDate}` : ''}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer branding element */}
        <div className="pt-6 text-[10px] text-white/50 text-center font-mono">
          Creative Design Portfolio Resume
        </div>
      </aside>

      {/* Main Body Content / Right Panel */}
      <main className="flex-1 p-8 space-y-6 bg-white text-slate-800">
        {/* About / Summary */}
        {personalInfo.summary && (
          <section className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h2 
              className="text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-2"
              style={{ color: primaryColor }}
            >
              <User className="w-4 h-4" />
              About Me
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience with Timeline Dots */}
        {experience && experience.length > 0 && (
          <section>
            <h2 
              className="text-sm font-black uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-200 pb-2"
              style={{ color: primaryColor }}
            >
              <Briefcase className="w-4 h-4" />
              Work Experience
            </h2>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {experience.map((exp) => (
                <div key={exp.id} className="relative group">
                  {/* Timeline Dot */}
                  <div 
                    className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs"
                    style={{ backgroundColor: primaryColor }}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="font-bold text-sm text-slate-900">{exp.position}</h3>
                    <span 
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white shrink-0 self-start sm:self-auto"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-600 mt-0.5 mb-2">
                    {exp.company} {exp.location ? `• ${exp.location}` : ''}
                  </p>

                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-outside pl-4">
                      {exp.bullets.map((bullet, idx) => (
                        bullet.trim() ? <li key={idx}>{bullet.replace(/^[•\s-]+/, '')}</li> : null
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section>
            <h2 
              className="text-sm font-black uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-200 pb-2"
              style={{ color: primaryColor }}
            >
              <FolderGit2 className="w-4 h-4" />
              Featured Projects
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {projects.map((proj) => (
                <div key={proj.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-xs text-slate-900">{proj.title}</h3>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 underline font-mono">
                        View Project
                      </a>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-xs text-slate-600 mb-2">{proj.description}</p>
                  )}
                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {proj.techStack.map((tech, idx) => (
                        <span key={idx} className="text-[10px] bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section>
            <h2 
              className="text-sm font-black uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-slate-200 pb-2"
              style={{ color: primaryColor }}
            >
              <GraduationCap className="w-4 h-4" />
              Education
            </h2>

            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xs text-slate-900">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</h3>
                    <p className="text-xs text-slate-600">{edu.institution} {edu.location ? `• ${edu.location}` : ''}</p>
                    {edu.gpa && <p className="text-[11px] text-slate-500 font-mono">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold shrink-0">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
