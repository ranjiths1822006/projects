import React from 'react';
import { ResumeData } from '../../types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experience, education, skills, projects, certifications, languages, theme } = data;
  const primaryColor = theme?.primaryColor || '#2563eb';

  return (
    <div 
      className={`w-full bg-white text-gray-800 p-8 shadow-sm transition-all duration-200 ${
        theme?.fontFamily === 'serif' ? 'font-serif' : theme?.fontFamily === 'mono' ? 'font-mono' : 'font-sans'
      }`}
      style={{ minHeight: '1123px' }} // Standard A4 ratio
    >
      {/* Header Banner */}
      <header className="border-b-2 pb-6 mb-6" style={{ borderColor: primaryColor }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.jobTitle && (
              <p className="text-lg font-semibold mt-1" style={{ color: primaryColor }}>
                {personalInfo.jobTitle}
              </p>
            )}
          </div>

          {/* Contact Details Grid */}
          <div className="flex flex-wrap gap-y-1.5 gap-x-4 text-xs sm:text-sm text-gray-600 sm:justify-end">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{personalInfo.phone}</span>
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>{personalInfo.location}</span>
              </span>
            )}
            {personalInfo.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-gray-400" />
                <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">
                  {personalInfo.website.replace(/^https?:\/\//, '')}
                </a>
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5 text-gray-400" />
                <a href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline">
                  LinkedIn
                </a>
              </span>
            )}
            {personalInfo.github && (
              <span className="flex items-center gap-1">
                <Github className="w-3.5 h-3.5 text-gray-400" />
                <a href={`https://${personalInfo.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline">
                  GitHub
                </a>
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <p className="mt-4 text-sm text-gray-700 leading-relaxed border-t border-gray-100 pt-3">
            {personalInfo.summary}
          </p>
        )}
      </header>

      {/* Main Grid */}
      <div className="space-y-6">
        {/* Work Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
              Professional Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-3 border-l-2" style={{ borderColor: `${primaryColor}60` }}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline mb-1">
                    <div>
                      <span className="font-bold text-gray-900 text-base">{exp.position}</span>
                      {exp.company && (
                        <span className="text-gray-700 text-sm font-medium"> — {exp.company}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate} {exp.location ? `| ${exp.location}` : ''}
                    </span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="mt-1.5 space-y-1 text-xs sm:text-sm text-gray-700 list-disc list-outside pl-4">
                      {exp.bullets.map((b, idx) => (
                        b.trim() ? <li key={idx} className="leading-snug">{b.replace(/^[•\s-]+/, '')}</li> : null
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
              Skills & Competencies
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-2.5 py-1 text-xs font-medium rounded-md border text-gray-800"
                  style={{ 
                    backgroundColor: `${primaryColor}0D`, 
                    borderColor: `${primaryColor}30` 
                  }}
                >
                  {skill.name} {skill.level ? <span className="text-gray-500 text-[10px]">({skill.level})</span> : null}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                    </h3>
                    <p className="text-xs text-gray-600">{edu.institution} {edu.location ? `• ${edu.location}` : ''}</p>
                    {edu.gpa && <p className="text-xs text-gray-500 font-medium mt-0.5">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>
              Key Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900 text-sm">
                      {proj.title}
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer" className="ml-2 text-xs font-normal underline text-blue-600">
                          Link ↗
                        </a>
                      )}
                    </h3>
                  </div>
                  {proj.techStack && proj.techStack.length > 0 && (
                    <p className="text-xs text-gray-500 mb-1">
                      Tech: <span className="font-medium text-gray-700">{proj.techStack.join(', ')}</span>
                    </p>
                  )}
                  {proj.description && <p className="text-xs text-gray-700 leading-snug">{proj.description}</p>}
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className="mt-1 space-y-0.5 text-xs text-gray-700 list-disc list-outside pl-4">
                      {proj.bullets.map((b, idx) => (
                        b.trim() ? <li key={idx}>{b.replace(/^[•\s-]+/, '')}</li> : null
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Languages */}
        {(certifications?.length > 0 || languages?.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-3">
            {certifications && certifications.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>
                  Certifications
                </h2>
                <ul className="space-y-1 text-xs text-gray-700">
                  {certifications.map((c) => (
                    <li key={c.id}>
                      <span className="font-semibold">{c.name}</span> {c.issuer ? `— ${c.issuer}` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {languages && languages.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: primaryColor }}>
                  Languages
                </h2>
                <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                  {languages.map((l) => (
                    <span key={l.id} className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                      {l.name} ({l.proficiency})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
