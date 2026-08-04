import { ResumeData, ATSAnalysisResult } from '../types';

export const enhanceBulletPoint = async (
  bullet: string,
  jobTitle?: string,
  context?: string
): Promise<string[]> => {
  const res = await fetch('/api/ai/enhance-bullet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bullet, jobTitle, context }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to enhance bullet point');
  }

  const data = await res.json();
  return data.enhancedBullets || [];
};

export const generateSummaries = async (
  fullName: string,
  jobTitle: string,
  keySkills: string[],
  yearsOfExperience?: string
): Promise<string[]> => {
  const res = await fetch('/api/ai/generate-summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, jobTitle, keySkills, yearsOfExperience }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate summaries');
  }

  const data = await res.json();
  return data.summaries || [];
};

export const analyzeATSResume = async (
  resumeData: ResumeData,
  targetJobDescription?: string
): Promise<ATSAnalysisResult> => {
  const res = await fetch('/api/ai/ats-score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeData, targetJobDescription }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to analyze ATS compatibility');
  }

  return await res.json();
};
