import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ResumeData, UserProfile } from '../types';
import { initialResumeData } from '../data/initialData';
import { Navbar } from '../components/Navbar';
import { FormEditor } from '../components/FormEditor';
import { LivePreview } from '../components/LivePreview';
import { AIAssistantModal } from '../components/AIAssistantModal';
import { AuthModal } from '../components/AuthModal';
import { 
  auth, 
  saveResumeToFirestore, 
  getResumeByIdFromFirestore, 
  logoutUser 
} from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { LayoutDashboard, ArrowLeft, Loader2 } from 'lucide-react';

export const ResumeBuilderPage: React.FC = () => {
  const { resumeId } = useParams<{ resumeId?: string }>();
  const navigate = useNavigate();

  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingResume, setLoadingResume] = useState<boolean>(!!resumeId);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSavedText, setLastSavedText] = useState<string>('Saved locally');
  const [isATSModalOpen, setIsATSModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          isGuest: false,
        });
      } else {
        setUser({
          uid: 'guest_user_123',
          email: 'guest@demo.local',
          displayName: 'Guest User',
          photoURL: null,
          isGuest: true,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Fetch specific resume if resumeId param is provided
  useEffect(() => {
    if (!resumeId) {
      setLoadingResume(false);
      // Fallback to local storage if available
      const saved = localStorage.getItem('ai_resume_builder_data');
      if (saved) {
        try {
          setResumeData(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse local resume data:', e);
        }
      } else {
        setResumeData({
          ...initialResumeData,
          id: `resume_${Date.now()}`,
        });
      }
      return;
    }

    async function loadResume() {
      setLoadingResume(true);
      const fetched = await getResumeByIdFromFirestore(resumeId!);
      if (fetched) {
        setResumeData(fetched);
      } else {
        // Resume not found, fallback
        setResumeData({
          ...initialResumeData,
          id: resumeId!,
        });
      }
      setLoadingResume(false);
    }

    loadResume();
  }, [resumeId]);

  // 3. Auto-save Effect
  useEffect(() => {
    if (loadingResume) return;

    setIsSaving(true);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      // LocalStorage backup
      localStorage.setItem('ai_resume_builder_data', JSON.stringify(resumeData));

      // Firestore save if user logged in
      if (user && !user.isGuest && user.uid) {
        try {
          await saveResumeToFirestore(user.uid, resumeData);
          setLastSavedText(`Saved to Firebase at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
        } catch (err) {
          console.warn('Auto-save to Firestore failed:', err);
          setLastSavedText('Saved locally');
        }
      } else {
        setLastSavedText('Saved locally');
      }

      setIsSaving(false);
    }, 800);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [resumeData, user, loadingResume]);

  const handleLogout = async () => {
    await logoutUser();
    setUser({
      uid: 'guest_user_123',
      email: 'guest@demo.local',
      displayName: 'Guest User',
      photoURL: null,
      isGuest: true,
    });
    navigate('/login');
  };

  const handleAddKeywordToSkills = (keyword: string) => {
    if (!keyword) return;
    const exists = resumeData.skills.some((s) => s.name.toLowerCase() === keyword.toLowerCase());
    if (!exists) {
      const newSkill = {
        id: `sk_${Date.now()}`,
        name: keyword,
        category: 'Technical' as const,
        level: 'Advanced' as const,
      };
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
    }
  };

  if (loadingResume) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center text-slate-600 font-sans">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
        <p className="text-xs font-semibold">Loading resume document...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col font-sans text-slate-800 dark:text-slate-100 transition-colors">
      {/* Navbar with back to Dashboard button */}
      <div className="bg-slate-800 dark:bg-slate-900 text-slate-200 px-4 py-1.5 flex items-center justify-between text-xs font-medium border-b border-slate-700 dark:border-slate-800">
        <Link
          to="/dashboard"
          className="hover:text-white flex items-center gap-1.5 transition-colors font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
        <span className="text-slate-400 text-[11px] font-mono">
          Document ID: {resumeData.id}
        </span>
      </div>

      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        isSaving={isSaving}
        lastSavedText={lastSavedText}
        onOpenATS={() => setIsATSModalOpen(true)}
      />

      {/* Mobile Toggle Bar */}
      <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-2 flex justify-center gap-2 text-xs font-semibold">
        <button
          onClick={() => setMobileView('editor')}
          className={`flex-1 py-2 rounded text-center transition-colors ${
            mobileView === 'editor' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Form Editor
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-2 rounded text-center transition-colors ${
            mobileView === 'preview' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Live Preview & Export
        </button>
      </div>

      {/* Workspace Grid */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className={`lg:col-span-6 flex flex-col ${mobileView === 'preview' ? 'hidden lg:flex' : 'flex'}`}>
          <FormEditor
            data={resumeData}
            onChange={setResumeData}
            onOpenATSModal={() => setIsATSModalOpen(true)}
          />
        </div>

        <div className={`lg:col-span-6 flex flex-col ${mobileView === 'editor' ? 'hidden lg:flex' : 'flex'}`}>
          <LivePreview
            data={resumeData}
            onOpenATSModal={() => setIsATSModalOpen(true)}
          />
        </div>
      </main>

      {/* Modals */}
      <AIAssistantModal
        isOpen={isATSModalOpen}
        onClose={() => setIsATSModalOpen(false)}
        data={resumeData}
        onAddKeyword={handleAddKeywordToSkills}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onGuestMode={() => {
          setUser({
            uid: 'guest_user_123',
            email: 'guest@demo.local',
            displayName: 'Guest User',
            photoURL: null,
            isGuest: true,
          });
        }}
      />
    </div>
  );
};
