import React, { useState } from 'react';
import { ResumeData, TemplateId, FontFamily, SkillCategory, WorkExperience, Education, Skill, Project, Certification, Language } from '../types';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  FolderGit2, 
  Award, 
  Languages, 
  Sparkles, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Palette,
  Check,
  RefreshCw
} from 'lucide-react';
import { enhanceBulletPoint, generateSummaries } from '../services/aiService';

interface FormEditorProps {
  data: ResumeData;
  onChange: (updatedData: ResumeData) => void;
  onOpenATSModal: () => void;
}

export const FormEditor: React.FC<FormEditorProps> = ({ data, onChange, onOpenATSModal }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'more' | 'design'>('personal');
  const [enhancingBullet, setEnhancingBullet] = useState<{ expId: string; bulletIdx: number } | null>(null);
  const [bulletSuggestions, setBulletSuggestions] = useState<{ expId: string; bulletIdx: number; suggestions: string[] } | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [summaryOptions, setSummaryOptions] = useState<string[] | null>(null);

  // Colors for picker
  const colorPresets = [
    { name: 'Indigo', hex: '#2563eb' },
    { name: 'Emerald', hex: '#059669' },
    { name: 'Violet', hex: '#7c3aed' },
    { name: 'Slate', hex: '#334155' },
    { name: 'Rose', hex: '#e11d48' },
    { name: 'Amber', hex: '#d97706' },
    { name: 'Teal', hex: '#0d9488' },
  ];

  // Handler helpers
  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const updateTheme = (field: string, value: any) => {
    onChange({
      ...data,
      theme: { ...data.theme, [field]: value }
    });
  };

  // Work Experience Helpers
  const addExperience = () => {
    const newExp: WorkExperience = {
      id: `exp_${Date.now()}`,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      bullets: ['Spearheaded project initiatives to drive measurable business outcome.']
    };
    onChange({ ...data, experience: [...data.experience, newExp] });
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: any) => {
    const updated = data.experience.map((exp) => exp.id === id ? { ...exp, [field]: value } : exp);
    onChange({ ...data, experience: updated });
  };

  const deleteExperience = (id: string) => {
    onChange({ ...data, experience: data.experience.filter((exp) => exp.id !== id) });
  };

  const addBullet = (expId: string) => {
    const updated = data.experience.map((exp) => {
      if (exp.id === expId) {
        return { ...exp, bullets: [...exp.bullets, ''] };
      }
      return exp;
    });
    onChange({ ...data, experience: updated });
  };

  const updateBullet = (expId: string, idx: number, value: string) => {
    const updated = data.experience.map((exp) => {
      if (exp.id === expId) {
        const bullets = [...exp.bullets];
        bullets[idx] = value;
        return { ...exp, bullets };
      }
      return exp;
    });
    onChange({ ...data, experience: updated });
  };

  const deleteBullet = (expId: string, idx: number) => {
    const updated = data.experience.map((exp) => {
      if (exp.id === expId) {
        const bullets = exp.bullets.filter((_, i) => i !== idx);
        return { ...exp, bullets };
      }
      return exp;
    });
    onChange({ ...data, experience: updated });
  };

  // AI Bullet Enhancer
  const handleEnhanceBullet = async (expId: string, bulletIdx: number, text: string, jobTitle: string) => {
    if (!text || text.trim().length < 5) return;
    setEnhancingBullet({ expId, bulletIdx });
    setBulletSuggestions(null);
    try {
      const suggestions = await enhanceBulletPoint(text, jobTitle);
      setBulletSuggestions({ expId, bulletIdx, suggestions });
    } catch (err) {
      console.error(err);
    } finally {
      setEnhancingBullet(null);
    }
  };

  // AI Summary Generator
  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);
    setSummaryOptions(null);
    try {
      const skillsList = data.skills.map(s => s.name);
      const suggestions = await generateSummaries(
        data.personalInfo.fullName,
        data.personalInfo.jobTitle,
        skillsList
      );
      setSummaryOptions(suggestions);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingSummary(false);
    }
  };

  // Education Helpers
  const addEducation = () => {
    const newEdu: Education = {
      id: `edu_${Date.now()}`,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: ''
    };
    onChange({ ...data, education: [...data.education, newEdu] });
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    const updated = data.education.map((edu) => edu.id === id ? { ...edu, [field]: value } : edu);
    onChange({ ...data, education: updated });
  };

  const deleteEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter((edu) => edu.id !== id) });
  };

  // Skill Helpers
  const addSkill = (name: string = '', category: SkillCategory = 'Technical') => {
    const newSkill: Skill = {
      id: `sk_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name,
      category,
      level: 'Advanced'
    };
    onChange({ ...data, skills: [...data.skills, newSkill] });
  };

  const deleteSkill = (id: string) => {
    onChange({ ...data, skills: data.skills.filter((s) => s.id !== id) });
  };

  // Project Helpers
  const addProject = () => {
    const newProj: Project = {
      id: `proj_${Date.now()}`,
      title: '',
      description: '',
      techStack: [],
      bullets: ['Built scalable architecture using React and Tailwind.']
    };
    onChange({ ...data, projects: [...data.projects, newProj] });
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    const updated = data.projects.map((p) => p.id === id ? { ...p, [field]: value } : p);
    onChange({ ...data, projects: updated });
  };

  const deleteProject = (id: string) => {
    onChange({ ...data, projects: data.projects.filter((p) => p.id !== id) });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full text-slate-800 dark:text-slate-100 transition-colors">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 pt-2 gap-1 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-md transition-colors whitespace-nowrap font-semibold cursor-pointer ${
            activeTab === 'personal'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-slate-50 dark:bg-slate-800'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Personal Info
        </button>
        <button
          onClick={() => setActiveTab('experience')}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-md transition-colors whitespace-nowrap font-semibold cursor-pointer ${
            activeTab === 'experience'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-slate-50 dark:bg-slate-800'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Experience ({data.experience.length})
        </button>
        <button
          onClick={() => setActiveTab('education')}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-md transition-colors whitespace-nowrap font-semibold cursor-pointer ${
            activeTab === 'education'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-slate-50 dark:bg-slate-800'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          Education ({data.education.length})
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-md transition-colors whitespace-nowrap font-semibold cursor-pointer ${
            activeTab === 'skills'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-slate-50 dark:bg-slate-800'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          Skills ({data.skills.length})
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-md transition-colors whitespace-nowrap font-semibold cursor-pointer ${
            activeTab === 'projects'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-slate-50 dark:bg-slate-800'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5" />
          Projects
        </button>
        <button
          onClick={() => setActiveTab('design')}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-md transition-colors whitespace-nowrap font-semibold cursor-pointer ${
            activeTab === 'design'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-slate-50 dark:bg-slate-800'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Design
        </button>
      </div>

      {/* Action Banner for AI ATS Analysis */}
      <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-slate-600 font-medium">Scan resume against ATS job descriptions</span>
        </div>
        <button
          onClick={onOpenATSModal}
          className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 px-3 py-1 rounded font-semibold text-xs flex items-center gap-1 transition-all"
        >
          <Sparkles className="w-3 h-3 text-blue-600" />
          ATS Check
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="p-6 overflow-y-auto flex-1 space-y-6">
        {/* TAB 1: PERSONAL INFO */}
        {activeTab === 'personal' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  value={data.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Alex Vance"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Target Job Title *</label>
                <input
                  type="text"
                  value={data.personalInfo.jobTitle}
                  onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Senior Full-Stack Developer"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  value={data.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="alex@example.com"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={data.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Location / City</label>
                <input
                  type="text"
                  value={data.personalInfo.location}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Austin, TX"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Portfolio / Website</label>
                <input
                  type="text"
                  value={data.personalInfo.website || ''}
                  onChange={(e) => updatePersonalInfo('website', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="https://alexvance.dev"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">LinkedIn Profile</label>
                <input
                  type="text"
                  value={data.personalInfo.linkedin || ''}
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="linkedin.com/in/alexvance"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">GitHub / Code Link</label>
                <input
                  type="text"
                  value={data.personalInfo.github || ''}
                  onChange={(e) => updatePersonalInfo('github', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="github.com/alexvance"
                />
              </div>
            </div>

            {/* Professional Summary */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-600 font-semibold">Professional Summary</label>
                <button
                  type="button"
                  onClick={handleGenerateSummary}
                  disabled={generatingSummary}
                  className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded"
                >
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  {generatingSummary ? 'AI Generating...' : '✨ AI Summary'}
                </button>
              </div>
              <textarea
                rows={4}
                value={data.personalInfo.summary}
                onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
                placeholder="Write a brief overview of your background, experience, and top achievements..."
              />

              {/* AI Generated Summary Options */}
              {summaryOptions && summaryOptions.length > 0 && (
                <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
                  <span className="font-bold text-slate-800 block">Select AI Suggested Summary:</span>
                  {summaryOptions.map((opt, i) => (
                    <div 
                      key={i} 
                      onClick={() => {
                        updatePersonalInfo('summary', opt);
                        setSummaryOptions(null);
                      }}
                      className="p-2 bg-white rounded border border-slate-200 text-slate-700 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: WORK EXPERIENCE */}
        {activeTab === 'experience' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Work Experience
              </h3>
              <button
                onClick={addExperience}
                className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1"
              >
                + Add Experience
              </button>
            </div>

            {data.experience.length === 0 && (
              <p className="text-slate-400 italic text-center py-6">No experience added yet. Click above to add your first role.</p>
            )}

            {data.experience.map((exp, expIdx) => (
              <div key={exp.id} className="p-4 bg-slate-50 rounded border border-slate-200 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-700 text-xs">Role #{expIdx + 1}</span>
                  <button
                    onClick={() => deleteExperience(exp.id)}
                    className="text-slate-400 hover:text-red-600 p-0.5"
                    title="Remove Experience"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Position / Job Title</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Company Name</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="e.g. Meta Platforms"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Start Date</label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="e.g. 2021"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">End Date</label>
                    <input
                      type="text"
                      disabled={exp.isCurrent}
                      value={exp.isCurrent ? 'Present' : exp.endDate}
                      onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded bg-white disabled:bg-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="e.g. Present"
                    />
                    <label className="inline-flex items-center mt-1 text-slate-600">
                      <input
                        type="checkbox"
                        checked={exp.isCurrent}
                        onChange={(e) => updateExperience(exp.id, 'isCurrent', e.target.checked)}
                        className="mr-1.5 rounded"
                      />
                      Current Role
                    </label>
                  </div>
                </div>

                {/* Bullets */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <label className="block font-semibold text-slate-700">Key Bullet Points</label>
                    <button
                      type="button"
                      onClick={() => addBullet(exp.id)}
                      className="text-blue-600 font-bold hover:underline text-xs flex items-center gap-1"
                    >
                      + Add Bullet
                    </button>
                  </div>

                  {exp.bullets.map((b, bIdx) => (
                    <div key={bIdx} className="space-y-1">
                      <div className="flex gap-2 items-start">
                        <textarea
                          rows={2}
                          value={b}
                          onChange={(e) => updateBullet(exp.id, bIdx, e.target.value)}
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded bg-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="Describe a key achievement using action metrics..."
                        />
                        <button
                          type="button"
                          onClick={() => handleEnhanceBullet(exp.id, bIdx, b, exp.position)}
                          disabled={enhancingBullet?.expId === exp.id && enhancingBullet?.bulletIdx === bIdx}
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 border border-blue-200 shrink-0"
                          title="Improve this bullet using AI"
                        >
                          <Sparkles className="w-3 h-3 text-blue-600" />
                          ✨ AI Rewrite
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteBullet(exp.id, bIdx)}
                          className="text-slate-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* AI Suggestions Dropdown */}
                      {bulletSuggestions?.expId === exp.id && bulletSuggestions?.bulletIdx === bIdx && (
                        <div className="p-3 bg-white border border-slate-200 rounded space-y-1.5 shadow-sm">
                          <span className="font-bold text-slate-800 block text-[11px]">Click suggestion to apply:</span>
                          {bulletSuggestions.suggestions.map((sug, sIdx) => (
                            <div
                              key={sIdx}
                              onClick={() => {
                                updateBullet(exp.id, bIdx, sug);
                                setBulletSuggestions(null);
                              }}
                              className="p-2 bg-slate-50 hover:bg-blue-50 rounded border border-slate-200 text-slate-700 cursor-pointer text-xs"
                            >
                              • {sug}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: EDUCATION */}
        {activeTab === 'education' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Education
              </h3>
              <button
                onClick={addEducation}
                className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1"
              >
                + Add Education
              </button>
            </div>

            {data.education.map((edu, idx) => (
              <div key={edu.id} className="p-4 bg-slate-50 rounded border border-slate-200 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-700">Education #{idx + 1}</span>
                  <button onClick={() => deleteEducation(edu.id)} className="text-slate-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Degree / Qualification</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="e.g. B.S. Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Institution / University</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="e.g. UT Austin"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Start Date</label>
                    <input
                      type="text"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="e.g. 2017"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">End Date</label>
                    <input
                      type="text"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="e.g. 2021"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: SKILLS */}
        {activeTab === 'skills' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Skills & Expertise
            </h3>

            <div className="flex gap-2">
              <input
                id="newSkillInput"
                type="text"
                placeholder="Type skill (e.g. React.js, Node.js, Cloud Architecture) and press Enter"
                className="flex-1 px-3 py-2 border border-slate-200 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    addSkill(e.currentTarget.value.trim());
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('newSkillInput') as HTMLInputElement;
                  if (input && input.value.trim()) {
                    addSkill(input.value.trim());
                    input.value = '';
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {data.skills.map((s) => (
                <span key={s.id} className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium rounded flex items-center gap-1.5">
                  {s.name}
                  <button onClick={() => deleteSkill(s.id)} className="text-slate-400 hover:text-red-600 font-bold ml-1">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Key Projects
              </h3>
              <button
                onClick={addProject}
                className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1"
              >
                + Add Project
              </button>
            </div>

            {data.projects.map((proj) => (
              <div key={proj.id} className="p-4 bg-slate-50 rounded border border-slate-200 space-y-3">
                <div className="flex justify-between items-start">
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => updateProject(proj.id, 'title', e.target.value)}
                    className="font-bold text-slate-800 border-b border-slate-300 focus:outline-none bg-transparent"
                    placeholder="Project Name"
                  />
                  <button onClick={() => deleteProject(proj.id)} className="text-slate-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <textarea
                  rows={2}
                  value={proj.description}
                  onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Brief description of project scope and tech stack..."
                />
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: TEMPLATE & DESIGN */}
        {activeTab === 'design' && (
          <div className="space-y-6 text-xs">
            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                Choose Resume Template
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'modern', name: 'Modern', desc: 'Sidebar layout, blue header bar, ATS optimized' },
                  { id: 'classic', name: 'Classic', desc: 'Formal serif, centered title, clean rules' },
                  { id: 'minimal', name: 'Minimal', desc: 'High negative space, monospace accents' },
                  { id: 'executive', name: 'Executive', desc: 'Slate navy banner, executive summary' },
                  { id: 'creative', name: 'Creative', desc: 'Vibrant sidebar, timeline dots, skill pills' },
                  { id: 'clean_ats', name: 'Clean ATS', desc: 'Single-column scannable layout, 100% ATS score' },
                ].map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() => updateTheme('templateId', tpl.id as TemplateId)}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      data.theme.templateId === tpl.id
                        ? 'border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 shadow-xs ring-1 ring-blue-600 dark:ring-blue-500'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-800 dark:text-slate-100">{tpl.name}</span>
                      {data.theme.templateId === tpl.id && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{tpl.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Accent Color */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Accent Theme Color
              </h3>
              <div className="flex flex-wrap gap-3">
                {colorPresets.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => updateTheme('primaryColor', c.hex)}
                    className={`w-8 h-8 rounded border-2 flex items-center justify-center transition-transform ${
                      data.theme.primaryColor === c.hex ? 'scale-110 border-slate-800 shadow-md' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {data.theme.primaryColor === c.hex && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Font Family
              </h3>
              <div className="flex gap-3">
                {[
                  { id: 'sans', name: 'Sans-Serif' },
                  { id: 'serif', name: 'Serif' },
                  { id: 'mono', name: 'Monospace' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => updateTheme('fontFamily', f.id as FontFamily)}
                    className={`px-3 py-2 rounded border font-semibold text-xs ${
                      data.theme.fontFamily === f.id
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
