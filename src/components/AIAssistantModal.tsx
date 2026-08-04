import React, { useState } from 'react';
import { ResumeData, ATSAnalysisResult } from '../types';
import { analyzeATSResume } from '../services/aiService';
import { Sparkles, X, CheckCircle, AlertTriangle, Key, Loader2 } from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
  onAddKeyword: (keyword: string) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  data,
  onAddKeyword,
}) => {
  const [targetJobDesc, setTargetJobDesc] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ATSAnalysisResult | null>(null);

  if (!isOpen) return null;

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    try {
      const analysis = await analyzeATSResume(data, targetJobDesc);
      setResult(analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            <div>
              <h2 className="text-lg font-bold">AI Resume ATS Optimization Scanner</h2>
              <p className="text-xs text-blue-100">Analyze keyword match & ATS formatting compatibility</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          <div>
            <label className="block font-semibold text-gray-800 mb-1">
              Target Job Description (Optional)
            </label>
            <textarea
              rows={3}
              value={targetJobDesc}
              onChange={(e) => setTargetJobDesc(e.target.value)}
              placeholder="Paste the job posting text here to evaluate specific keyword matching..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Resume against ATS Algorithms...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Run AI ATS Scanner
              </>
            )}
          </button>

          {/* Results Display */}
          {result && (
            <div className="space-y-4 pt-2 border-t border-gray-200">
              {/* Score Metric */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="relative flex items-center justify-center">
                  <div className={`text-3xl font-black ${result.score >= 80 ? 'text-emerald-600' : result.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                    {result.score}%
                  </div>
                </div>
                <div className="flex-1">
                  <span className="font-bold text-gray-900 block text-sm">ATS Readiness Score</span>
                  <p className="text-gray-600 text-xs mt-0.5">{result.summaryFeedback}</p>
                </div>
              </div>

              {/* Strengths */}
              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 space-y-1.5">
                <span className="font-bold text-emerald-900 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Key Resume Strengths
                </span>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {result.strengths.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              </div>

              {/* Actionable Improvements */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-100 space-y-1.5">
                <span className="font-bold text-amber-900 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Recommended Improvements
                </span>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {result.improvements.map((imp, idx) => (
                    <li key={idx}>{imp}</li>
                  ))}
                </ul>
              </div>

              {/* Keywords */}
              <div className="space-y-2">
                <span className="font-bold text-gray-800 flex items-center gap-1">
                  <Key className="w-4 h-4 text-blue-600" />
                  Recommended Keywords (Click to add to skills):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.recommendedKeywords.map((kw, idx) => (
                    <button
                      key={idx}
                      onClick={() => onAddKeyword(kw)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-800 font-medium px-2.5 py-1 rounded-lg border border-blue-200 transition-colors flex items-center gap-1"
                    >
                      + {kw}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
