import React from 'react';
import { ResumeData } from '../../types';

interface TemplateProps {
  data: ResumeData;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experience, education, skills, projects, certifications, languages, theme } = data;
  const primaryColor = theme?.primaryColor || '#1e293b'; // Slate / Navy

  return (
    <div 
      className="w-full bg-white text-gray-900 p-8 shadow-sm font-sans"
      style={{ minHeight: '1123px' }}
    >
      {/* Executive Header Banner */}
      <div 
        className="p-6 rounded-lg text-white mb-6"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{personalInfo.fullName || 'Your Name'}</h1>
            <p className="text-base text-gray-200 font-medium mt-1">{personalInfo.jobTitle}</p>
          </div>
          <div className="text-xs text-gray-200 space-y-1 md:text-right">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
          </div>
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6 bg-slate-50 p-4 rounded-md border border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
            Executive Summary
          </h2>
          <p className="text-xs text-gray-700 leading-relaxed">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider border-b-2 border-slate-800 pb-1 mb-4 text-slate-900">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm text-slate-900">{exp.position}</h3>
                  <span className="text-xs font-medium text-slate-500">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-xs font-semibold text-slate-700 mb-1.5">{exp.company} {exp.location ? `• ${exp.location}` : ''}</p>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="space-y-1 text-xs text-gray-700 list-disc list-outside pl-4">
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

      {/* Grid for Skills & Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills && skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider border-b-2 border-slate-800 pb-1 mb-2 text-slate-900">
              Core Competencies
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span key={s.id} className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded font-medium border border-slate-200">
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {education && education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider border-b-2 border-slate-800 pb-1 mb-2 text-slate-900">
              Education
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="font-bold text-xs text-slate-900">{edu.degree}</p>
                  <p className="text-xs text-slate-600">{edu.institution} ({edu.startDate} - {edu.endDate})</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
