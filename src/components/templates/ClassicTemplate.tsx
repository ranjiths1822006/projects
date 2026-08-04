import React from 'react';
import { ResumeData } from '../../types';

interface TemplateProps {
  data: ResumeData;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experience, education, skills, projects, certifications, languages } = data;

  return (
    <div 
      className="w-full bg-white text-gray-900 p-8 shadow-sm font-serif leading-relaxed"
      style={{ minHeight: '1123px' }}
    >
      {/* Centered Header */}
      <header className="text-center border-b border-gray-400 pb-4 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wider text-gray-900">
          {personalInfo.fullName || 'Your Full Name'}
        </h1>
        {personalInfo.jobTitle && (
          <p className="text-sm italic text-gray-700 mt-1">
            {personalInfo.jobTitle}
          </p>
        )}

        {/* Contact info row */}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-gray-700 mt-3 font-sans">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.email && personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.phone && personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-xs text-gray-800 leading-relaxed text-justify">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-3">
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm text-gray-900">
                    {exp.position} <span className="font-normal italic">| {exp.company}</span>
                  </h3>
                  <span className="text-xs font-sans text-gray-600">
                    {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.location && <p className="text-xs italic text-gray-600">{exp.location}</p>}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="mt-1.5 space-y-1 text-xs text-gray-800 list-disc list-outside pl-4">
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

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-3">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-xs">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
                  <span className="text-xs text-gray-700 italic"> — {edu.institution}</span>
                </div>
                <span className="text-xs font-sans text-gray-600">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-2">
            Key Skills
          </h2>
          <p className="text-xs text-gray-800">
            {skills.map((s) => s.name).join('  •  ')}
          </p>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-3">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <span className="font-bold text-xs">{proj.title}</span>
                {proj.description && <p className="text-xs text-gray-800 italic mt-0.5">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages & Certifications */}
      {(certifications?.length > 0 || languages?.length > 0) && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-2">
            Additional Information
          </h2>
          <div className="text-xs text-gray-800 space-y-1">
            {certifications && certifications.length > 0 && (
              <p><strong>Certifications:</strong> {certifications.map((c) => c.name).join(', ')}</p>
            )}
            {languages && languages.length > 0 && (
              <p><strong>Languages:</strong> {languages.map((l) => `${l.name} (${l.proficiency})`).join(', ')}</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
