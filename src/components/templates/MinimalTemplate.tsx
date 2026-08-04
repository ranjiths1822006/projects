import React from 'react';
import { ResumeData } from '../../types';

interface TemplateProps {
  data: ResumeData;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div 
      className="w-full bg-white text-gray-900 p-8 shadow-sm font-sans tracking-tight"
      style={{ minHeight: '1123px' }}
    >
      {/* Top Header Minimalist */}
      <div className="mb-8 border-b pb-6 border-gray-200">
        <h1 className="text-3xl font-black tracking-tighter text-black uppercase">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-widest">
          {personalInfo.jobTitle}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-4 font-mono">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>

        {personalInfo.summary && (
          <p className="mt-4 text-xs text-gray-600 leading-relaxed max-w-3xl">
            {personalInfo.summary}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Experience & Projects */}
        <div className="md:col-span-2 space-y-6">
          {experience && experience.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-widest text-black mb-4">
                01 // Experience
              </h2>
              <div className="space-y-5">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-sm text-black">{exp.position}</span>
                      <span className="text-[10px] font-mono text-gray-400">
                        {exp.startDate} — {exp.isCurrent ? 'NOW' : exp.endDate}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-700">{exp.company}</p>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="mt-2 space-y-1 text-xs text-gray-600 list-disc list-inside">
                        {exp.bullets.map((b, idx) => (
                          b.trim() ? <li key={idx}>{b.replace(/^[•\s-]+/, '')}</li> : null
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects && projects.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-widest text-black mb-4">
                02 // Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <span className="font-bold text-xs text-black">{proj.title}</span>
                    <p className="text-xs text-gray-600">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Skills & Education */}
        <div className="space-y-6 border-l border-gray-100 pl-4">
          {skills && skills.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-widest text-black mb-3">
                03 // Skills
              </h2>
              <div className="flex flex-wrap gap-1">
                {skills.map((s) => (
                  <span key={s.id} className="text-[11px] font-mono bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {education && education.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-widest text-black mb-3">
                04 // Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="font-bold text-xs text-black">{edu.degree}</p>
                    <p className="text-xs text-gray-500">{edu.institution}</p>
                    <p className="text-[10px] font-mono text-gray-400">{edu.startDate} – {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
