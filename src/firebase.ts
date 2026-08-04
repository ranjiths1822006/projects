// src/firebase.ts
// Firebase configuration & helper methods for Auth and Firestore CRUD

import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile,
  signOut 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc,
  getDocFromServer
} from "firebase/firestore";
import { ResumeData } from "./types";
import appletConfig from "../firebase-applet-config.json";

// Firebase configuration loaded from project config
const firebaseConfig = {
  apiKey: appletConfig.apiKey || "AIzaSyDSNDsfr1khYClUILoKHRp0SoHxl0DSymQ",
  authDomain: appletConfig.authDomain || "mini-project-3f59c.firebaseapp.com",
  projectId: appletConfig.projectId || "mini-project-3f59c",
  storageBucket: appletConfig.storageBucket || "mini-project-3f59c.firebasestorage.app",
  messagingSenderId: appletConfig.messagingSenderId || "271870788958",
  appId: appletConfig.appId || "1:271870788958:web:5927e54cd7936cf3fd3bcf"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = appletConfig.firestoreDatabaseId && appletConfig.firestoreDatabaseId !== "(default)"
  ? getFirestore(app, appletConfig.firestoreDatabaseId)
  : getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Test connection helper
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.warn("Firestore connection check: offline or config placeholder.");
    }
  }
}

// Convert raw Firebase auth errors to human-readable text
export function getHumanAuthErrorMessage(error: any): string {
  if (!error) return "An unexpected error occurred. Please try again.";
  const code = error.code || error.message || "";

  if (code.includes("auth/configuration-not-found") || code.includes("auth/operation-not-allowed")) {
    return "Google Sign-In is not enabled in your Firebase Console. Please enable 'Google' under Authentication > Sign-in method in your Firebase console, or use Email & Password below.";
  }
  if (code.includes("auth/unauthorized-domain")) {
    const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
    return `This domain (${currentHost}) is not authorized for Google Sign-In in your Firebase Console. Please add "${currentHost}" under Firebase Console > Authentication > Settings > Authorized domains, or use Email & Password below.`;
  }
  if (code.includes("auth/invalid-credential") || code.includes("auth/wrong-password") || code.includes("auth/user-not-found")) {
    return "Incorrect email or password. Please check your credentials and try again.";
  }
  if (code.includes("auth/email-already-in-use")) {
    return "An account with this email address already exists. Please sign in instead.";
  }
  if (code.includes("auth/weak-password")) {
    return "Password is too weak. Please enter at least 6 characters.";
  }
  if (code.includes("auth/invalid-email")) {
    return "Please enter a valid email address.";
  }
  if (code.includes("auth/too-many-requests")) {
    return "Too many unsuccessful attempts. Access disabled temporarily. Please try again later or reset your password.";
  }
  if (code.includes("auth/popup-closed-by-user")) {
    return "Google Sign-In popup was closed before completion. Please try again.";
  }
  if (code.includes("auth/popup-blocked")) {
    return "Sign-In popup was blocked by your browser. Please allow popups for this site and try again.";
  }
  if (code.includes("auth/network-request-failed")) {
    return "Network error. Please check your internet connection.";
  }

  return error.message || "Authentication failed. Please check your details and try again.";
}

// Authentication Helpers
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};

export const registerWithEmail = async (email: string, password: string, displayName?: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && result.user) {
      await updateProfile(result.user, { displayName });
    }
    return result.user;
  } catch (error) {
    console.error("Error registering with email:", error);
    throw error;
  }
};

export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Firestore CRUD Functions for Resumes
export const saveResumeToFirestore = async (userId: string, resumeData: ResumeData): Promise<string> => {
  if (!userId) throw new Error("User ID is required to save resume");
  const resumeId = resumeData.id || `resume_${Date.now()}`;
  const path = `resumes/${resumeId}`;
  const docRef = doc(db, "resumes", resumeId);
  const dataToSave = {
    ...resumeData,
    id: resumeId,
    userId: userId,
    updatedAt: new Date().toISOString()
  };
  try {
    await setDoc(docRef, dataToSave, { merge: true });
    return resumeId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return resumeId;
  }
};

export const getUserResumesFromFirestore = async (userId: string): Promise<ResumeData[]> => {
  if (!userId || !auth.currentUser || auth.currentUser.uid !== userId) return [];
  const path = "resumes";
  try {
    const q = query(collection(db, "resumes"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const resumes: ResumeData[] = [];
    querySnapshot.forEach((docSnap) => {
      resumes.push(docSnap.data() as ResumeData);
    });
    // Sort by updatedAt descending
    resumes.sort((a, b) => {
      const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return timeB - timeA;
    });
    return resumes;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const getResumeByIdFromFirestore = async (resumeId: string): Promise<ResumeData | null> => {
  if (!resumeId || !auth.currentUser) return null;
  const path = `resumes/${resumeId}`;
  try {
    const docRef = doc(db, "resumes", resumeId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as ResumeData;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
};

export const deleteResumeFromFirestore = async (resumeId: string): Promise<void> => {
  if (!resumeId) return;
  const path = `resumes/${resumeId}`;
  try {
    const docRef = doc(db, "resumes", resumeId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const duplicateResumeInFirestore = async (userId: string, originalResume: ResumeData): Promise<ResumeData> => {
  const newId = `resume_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const duplicatedData: ResumeData = {
    ...originalResume,
    id: newId,
    userId,
    title: `Copy of ${originalResume.title || 'Resume'}`,
    updatedAt: new Date().toISOString()
  };
  await saveResumeToFirestore(userId, duplicatedData);
  return duplicatedData;
};

export default app;
