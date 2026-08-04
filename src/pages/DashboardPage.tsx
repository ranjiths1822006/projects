import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  getUserResumesFromFirestore, 
  deleteResumeFromFirestore, 
  duplicateResumeInFirestore, 
  logoutUser, 
  auth 
} from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { ResumeData } from '../types';
import { exportToPdf } from '../services/pdfExport';
import { ResumeTemplateRenderer } from '../components/ResumeTemplateRenderer';
import { 
  Plus, 
  FileText, 
  Edit3, 
  Copy, 
  Trash2, 
  Sparkles, 
  LogOut, 
  Clock, 
  Palette, 
  Check, 
  AlertTriangle,
  Loader2,
  FolderOpen,
  Sun,
  Moon,
  CheckCircle2,
  Circle,
  ArrowRight,
  TrendingUp,
  Layers,
  ListFilter,
  Download
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export interface ProgressStep {
  label: string;
  done: boolean;
  weight: number;
}

export const calculateResumeProgress = (resume: ResumeData) => {
  const steps: ProgressStep[] = [
    { label: 'Contact Info', done: Boolean(resume.personalInfo?.fullName && resume.personalInfo?.email && resume.personalInfo?.jobTitle), weight: 20 },
    { label: 'Summary', done: Boolean(resume.personalInfo?.summary && resume.personalInfo.summary.trim().length > 15), weight: 15 },
    { label: 'Experience', done: Boolean(resume.experience && resume.experience.length > 0), weight: 25 },
    { label: 'Education', done: Boolean(resume.education && resume.education.length > 0), weight: 20 },
    { label: 'Skills', done: Boolean(resume.skills && resume.skills.length > 0), weight: 20 },
  ];

  let score = 0;
  steps.forEach(step => {
    if (step.done) score += step.weight;
  });

  const status = score === 100 ? 'Completed' : score >= 20 ? 'In Progress' : 'Draft';

  return { score, steps, status };
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [pdfExportingId, setPdfExportingId] = useState<string | null>(null);
  const [exportingResumeData, setExportingResumeData] = useState<ResumeData | null>(null);

  const filteredResumes = resumes.filter((r) => {
    const { status } = calculateResumeProgress(r);
    
    // Status filter
    if (statusFilter === 'in_progress' && status === 'Completed') return false;
    if (statusFilter === 'completed' && status !== 'Completed') return false;

    // Search term
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const titleMatch = r.title?.toLowerCase().includes(term);
    const jobMatch = r.personalInfo?.jobTitle?.toLowerCase().includes(term);
    const nameMatch = r.personalInfo?.fullName?.toLowerCase().includes(term);
    const templateMatch = r.theme?.templateId?.toLowerCase().includes(term);
    return titleMatch || jobMatch || nameMatch || templateMatch;
  });

  // Calculate Dashboard Overview Stats
  const totalResumes = resumes.length;
  const inProgressResumes = resumes.filter(r => calculateResumeProgress(r).score < 100);
  const completedResumes = resumes.filter(r => calculateResumeProgress(r).score === 100);
  const avgProgress = totalResumes > 0 
    ? Math.round(resumes.reduce((acc, r) => acc + calculateResumeProgress(r).score, 0) / totalResumes) 
    : 0;

  // Primary active/ongoing resume to highlight
  const activeOngoingResume = inProgressResumes.length > 0 ? inProgressResumes[0] : resumes[0];

  // Auth listener & Fetch Resumes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate('/login', { replace: true });
        return;
      }
      setUser(currentUser);

      try {
        setLoading(true);
        const data = await getUserResumesFromFirestore(currentUser.uid);
        setResumes(data);
      } catch (err) {
        console.error('Failed to load user resumes:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Handle Duplicate Resume
  const handleDuplicate = async (resume: ResumeData) => {
    if (!user) return;
    try {
      setActionLoadingId(resume.id);
      const dup = await duplicateResumeInFirestore(user.uid, resume);
      setResumes((prev) => [dup, ...prev]);
    } catch (err) {
      console.error('Failed to duplicate resume:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Delete Resume
  const handleDelete = async (resumeId: string) => {
    try {
      setActionLoadingId(resumeId);
      await deleteResumeFromFirestore(resumeId);
      setResumes((prev) => prev.filter((r) => r.id !== resumeId));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete resume:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Direct PDF Export from Dashboard
  const handleDownloadPdfFromDashboard = async (resume: ResumeData) => {
    setPdfExportingId(resume.id);
    setExportingResumeData(resume);

    // Give DOM time to render the hidden container
    await new Promise((resolve) => setTimeout(resolve, 150));

    try {
      await exportToPdf('dashboard-export-pdf-target', resume);
    } catch (err) {
      console.error('Failed to export PDF from dashboard:', err);
      alert('Could not export PDF document. Please try again.');
    } finally {
      setPdfExportingId(null);
      setExportingResumeData(null);
    }
  };

  // Format Date String
  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Recently edited';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col font-sans text-slate-800 dark:text-slate-100 transition-colors">
      {/* Header Bar */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-xs">
              R
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-slate-100">
              ResumeAI
            </span>
          </Link>

          {/* User, Theme Toggle & Sign Out */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {user && (
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-5 h-5 rounded-full" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                    {user.displayName?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <span className="font-semibold text-slate-700 dark:text-slate-200 hidden sm:inline-block">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline-block">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title & Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Resume Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Track ongoing resume progress, complete missing sections, and export ATS-ready documents.
            </p>
          </div>

          <button
            onClick={() => navigate('/builder')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-xs flex items-center justify-center gap-2 transition-all self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create New Resume
          </button>
        </div>

        {/* Dashboard Overview Cards */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Resumes</p>
                <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{totalResumes}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ongoing / Drafts</p>
                <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{inProgressResumes.length}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed</p>
                <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{completedResumes.length}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg Completion</p>
                <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{avgProgress}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Featured Ongoing Resume Process Banner */}
        {!loading && activeOngoingResume && (
          <div className="mb-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            
            {(() => {
              const { score, steps, status } = calculateResumeProgress(activeOngoingResume);
              const missingCount = steps.filter(s => !s.done).length;

              return (
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Ongoing Resume Process</span>
                        <span className="bg-white text-blue-800 font-bold px-2 py-0.2 text-[10px] rounded-full">
                          {score}% Completed
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                        {activeOngoingResume.title || 'Untitled Resume'}
                      </h2>
                      <p className="text-blue-100 text-xs sm:text-sm mt-0.5">
                        {activeOngoingResume.personalInfo?.jobTitle || 'Target Position Not Set'} • Updated {formatDate(activeOngoingResume.updatedAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
                      <button
                        onClick={() => handleDownloadPdfFromDashboard(activeOngoingResume)}
                        disabled={pdfExportingId === activeOngoingResume.id}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl shadow-md inline-flex items-center justify-center gap-2 transition-all cursor-pointer text-xs sm:text-sm disabled:opacity-50"
                        title="Download PDF Document"
                      >
                        {pdfExportingId === activeOngoingResume.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        <span>Download PDF</span>
                      </button>

                      <button
                        onClick={() => navigate(`/builder/${activeOngoingResume.id}`)}
                        className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-5 py-2.5 rounded-xl shadow-md inline-flex items-center justify-center gap-2 transition-all cursor-pointer text-xs sm:text-sm"
                      >
                        <span>Continue Resume Process</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Overall Progress Bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between items-center text-xs font-semibold text-blue-100">
                      <span>Overall Process Progress</span>
                      <span>{score}% Complete ({missingCount > 0 ? `${missingCount} sections remaining` : 'Ready to export!'})</span>
                    </div>
                    <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden p-0.5 backdrop-blur-xs">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-amber-300 h-full rounded-full transition-all duration-500"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>

                  {/* Section Steps Checklist */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-white/15">
                    {steps.map((step, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium ${
                          step.done ? 'bg-white/15 text-white' : 'bg-black/15 text-blue-200 opacity-80'
                        }`}
                      >
                        {step.done ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-blue-300 shrink-0" />
                        )}
                        <span className="truncate">{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Filter & Search Bar */}
        {!loading && resumes.length > 0 && (
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                All ({resumes.length})
              </button>
              <button
                onClick={() => setStatusFilter('in_progress')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === 'in_progress'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                In Progress ({inProgressResumes.length})
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === 'completed'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Completed ({completedResumes.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search resumes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs pl-3 pr-8 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        )}

        {/* Loading State Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs animate-pulse space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-12 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-100 dark:border-slate-800"></div>
                <div className="flex justify-between pt-2">
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
                  <div className="h-8 bg-slate-100 dark:bg-slate-800/60 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && resumes.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center max-w-xl mx-auto my-8">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">No resumes created yet</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-6 max-w-md mx-auto">
              Start your first resume process with AI assistance, custom templates, and real-time ATS optimization!
            </p>
            <button
              onClick={() => navigate('/builder')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow-xs inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Start First Resume
            </button>
          </div>
        )}

        {/* Resume Grid */}
        {!loading && resumes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create Card Prompt */}
            <div
              onClick={() => navigate('/builder')}
              className="bg-white dark:bg-slate-900 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group min-h-[250px]"
            >
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/60 group-hover:bg-blue-600 text-blue-600 dark:text-blue-400 group-hover:text-white rounded-full flex items-center justify-center mb-3 transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                + Create New Resume
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                Start from scratch with step-by-step guidance
              </p>
            </div>

            {/* Resume Cards */}
            {filteredResumes.map((resume) => {
              const isActioning = actionLoadingId === resume.id;
              const { score, steps, status } = calculateResumeProgress(resume);

              return (
                <div
                  key={resume.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden"
                >
                  {/* Top Header Section */}
                  <div className="p-5 flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm line-clamp-1">
                            {resume.title || 'Untitled Resume'}
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-1">
                            {resume.personalInfo?.jobTitle || 'No Job Title specified'}
                          </p>
                        </div>
                      </div>

                      {/* Status Pill */}
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 border ${
                          status === 'Completed'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    {/* Individual Resume Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        <span>Process Completion</span>
                        <span>{score}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            score === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>

                    {/* Section Step Badges */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {steps.map((step, idx) => (
                        <span
                          key={idx}
                          className={`text-[9px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1 ${
                            step.done
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              : 'bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 line-through'
                          }`}
                        >
                          {step.done ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Circle className="w-2.5 h-2.5 text-slate-300" />}
                          {step.label}
                        </span>
                      ))}
                    </div>

                    {/* Metadata tags */}
                    <div className="flex items-center justify-between gap-2 pt-2 text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/60">
                      <span className="font-semibold flex items-center gap-1 text-slate-600 dark:text-slate-400">
                        <Palette className="w-3 h-3 text-slate-400" />
                        <span className="capitalize">{resume.theme?.templateId || 'Modern'}</span>
                      </span>

                      <span className="flex items-center gap-1 font-mono text-[10px]">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {formatDate(resume.updatedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => navigate(`/builder/${resume.id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        {score === 100 ? 'Edit' : 'Continue'}
                      </button>

                      <button
                        onClick={() => handleDownloadPdfFromDashboard(resume)}
                        disabled={pdfExportingId === resume.id}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                        title="Download PDF"
                      >
                        {pdfExportingId === resume.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                        <span className="hidden sm:inline-block">PDF</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDuplicate(resume)}
                        disabled={isActioning}
                        className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded font-medium flex items-center gap-1 transition-all cursor-pointer"
                        title="Duplicate Resume"
                      >
                        {isActioning ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                        )}
                        <span className="hidden sm:inline-block">Duplicate</span>
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(resume.id)}
                        disabled={isActioning}
                        className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors cursor-pointer"
                        title="Delete Resume"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-sm w-full p-6 shadow-2xl relative text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Delete Resume</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-5">
              Are you sure you want to delete this resume? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Hidden Offscreen Target Container for Direct PDF Export from Dashboard */}
      {exportingResumeData && (
        <div className="fixed -left-[9999px] top-0 pointer-events-none opacity-0 overflow-hidden">
          <div
            id="dashboard-export-pdf-target"
            style={{ width: '794px' }}
            className="bg-white"
          >
            <ResumeTemplateRenderer data={exportingResumeData} />
          </div>
        </div>
      )}
    </div>
  );
};
