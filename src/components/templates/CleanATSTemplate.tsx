import React from 'react';
import { ResumeData } from '../../types';

interface CleanATSTemplateProps {
  data: ResumeData;
}

export const CleanATSTemplate: React.FC<CleanATSTemplateProps> = ({ data }) => {
  const { personalInfo, experience, education, skills, projects, certifications, languages, theme } = data;
  const primaryColor = theme?.primaryColor || '#1e293b'; // Standard Dark Slate / Navy

  return (
    <div 
      className="w-full bg-white text-slate-900 p-8 shadow-sm font-sans max-w-4xl mx-auto space-y-5"
      style={{ minHeight: '1123px' }}
    >
      {/* ATS Header: Centered & Clean Text */}
      <header className="text-center border-b-2 pb-4" style={{ borderColor: primaryColor }}>
        <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-900 mb-1">
          {personalInfo.fullName || 'Your Full Name'}
        </h1>
        <p className="text-sm font-semibold text-slate-700 mb-2">
          {personalInfo.jobTitle || 'Professional Title'}
        </p>

        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-slate-700">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.location && personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.phone && personalInfo.email && <span>•</span>}
          {personalInfo.email && <span className="font-medium">{personalInfo.email}</span>}
          {personalInfo.linkedin && (
            <>
              <span>•</span>
              <span>{personalInfo.linkedin}</span>
            </>
          )}
          {personalInfo.github && (
            <>
              <span>•</span>
              <span>{personalInfo.github}</span>
            </>
          )}
          {personalInfo.website && (
            <>
              <span>•</span>
              <span>{personalInfo.website}</span>
            </>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <section className="space-y-1">
          <h2 
            className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-slate-900"
            style={{ color: primaryColor }}
          >
            Professional Summary
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed font-normal">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Skills & Core Competencies Section (High ranking for ATS parsers) */}
      {skills && skills.length > 0 && (
        <section className="space-y-1">
          <h2 
            className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-slate-900"
            style={{ color: primaryColor }}
          >
            Core Competencies & Technical Skills
          </h2>
          <div className="text-xs text-slate-800">
            <p className="leading-normal">
              <span className="font-bold">Skills: </span>
              {skills.map((s) => s.name).join(' • ')}
            </p>
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {experience && experience.length > 0 && (
        <section className="space-y-3">
          <h2 
            className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-slate-900"
            style={{ color: primaryColor }}
          >
            Professional Experience
          </h2>

          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                  <span>{exp.position} — <span className="font-semibold text-slate-700">{exp.company}</span></span>
                  <span className="font-mono text-[11px] text-slate-600 shrink-0">
                    {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.location && (
                  <p className="text-[11px] italic text-slate-600">{exp.location}</p>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-800">
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
        <section className="space-y-2">
          <h2 
            className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-slate-900"
            style={{ color: primaryColor }}
          >
            Key Projects
          </h2>

          <div className="space-y-2">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs text-slate-800 space-y-0.5">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{proj.title}</span>
                  {proj.techStack && proj.techStack.length > 0 && (
                    <span className="font-mono text-[10px] text-slate-600 font-normal">
                      [{proj.techStack.join(', ')}]
                    </span>
                  )}
                </div>
                {proj.description && <p className="text-slate-700">{proj.description}</p>}
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-800">
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

      {/* Education */}
      {education && education.length > 0 && (
        <section className="space-y-2">
          <h2 
            className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-slate-900"
            style={{ color: primaryColor }}
          >
            Education
          </h2>

          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
                  <span className="text-slate-700">, {edu.institution} {edu.location ? `(${edu.location})` : ''}</span>
                  {edu.gpa && <span className="text-slate-500 font-mono text-[11px]"> • GPA: {edu.gpa}</span>}
                </div>
                <span className="font-mono text-[11px] text-slate-600 shrink-0">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Languages */}
      {((certifications && certifications.length > 0) || (languages && languages.length > 0)) && (
        <section className="grid grid-cols-2 gap-4 text-xs pt-1">
          {certifications && certifications.length > 0 && (
            <div>
              <h2 
                className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-slate-900 mb-1"
                style={{ color: primaryColor }}
              >
                Certifications
              </h2>
              <ul className="list-disc list-outside pl-4 space-y-0.5">
                {certifications.map((cert, idx) => (
                  <li key={cert.id || idx}>
                    <span className="font-semibold">{cert.name}</span> — {cert.issuer} {cert.issueDate ? `(${cert.issueDate})` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {languages && languages.length > 0 && (
            <div>
              <h2 
                className="text-xs font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5 text-slate-900 mb-1"
                style={{ color: primaryColor }}
              >
                Languages
              </h2>
              <p className="text-slate-800">
                {languages.map((l) => `${l.name} (${l.proficiency})`).join(' • ')}
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
