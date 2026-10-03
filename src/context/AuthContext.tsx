import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, StudyDocument, Quiz } from '../types/study';
import { api, getStoredToken, setStoredToken } from '../services/api';
import {
  auth,
  signInWithGoogle,
  signOutFromFirebase,
  testFirestoreConnection,
  firestoreService,
} from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AuthContextValue {
  user: User | null;
  isLoadingAuth: boolean;
  documents: StudyDocument[];
  quizzes: Quiz[];
  isLoadingData: boolean;
  toasts: ToastItem[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
  loginWithToken: (token: string, user: User) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setDocuments: React.Dispatch<React.SetStateAction<StudyDocument[]>>;
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [documents, setDocuments] = useState<StudyDocument[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Test Firestore connection on application boot
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4200);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshUserData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      // First attempt backend API documents and quizzes
      const [docsRes, quizzesRes] = await Promise.all([
        api.getDocuments().catch(() => ({ documents: [] })),
        api.getQuizzes().catch(() => ({ quizzes: [] })),
      ]);
      let validDocs = Array.isArray(docsRes?.documents)
        ? docsRes.documents.filter((d) => d && typeof d === 'object' && d._id)
        : [];
      let validQuizzes = Array.isArray(quizzesRes?.quizzes)
        ? quizzesRes.quizzes.filter((q) => q && typeof q === 'object' && q._id)
        : [];

      // If Firebase user is active, also merge Firestore documents
      if (auth.currentUser?.uid) {
        try {
          const fsDocs = await firestoreService.getDocuments(auth.currentUser.uid);
          if (fsDocs.length > 0) {
            const map = new Map<string, StudyDocument>();
            validDocs.forEach((d) => map.set(d._id, d));
            fsDocs.forEach((d) => map.set(d._id, d));
            validDocs = Array.from(map.values());
          }
          const fsQuizzes = await firestoreService.getQuizzes(auth.currentUser.uid);
          if (fsQuizzes.length > 0) {
            const qMap = new Map<string, Quiz>();
            validQuizzes.forEach((q) => qMap.set(q._id, q));
            fsQuizzes.forEach((q) => qMap.set(q._id, q));
            validQuizzes = Array.from(qMap.values());
          }
        } catch (fsErr) {
          console.warn('[Firestore] Syncing documents:', fsErr);
        }
      }

      setDocuments(validDocs);
      setQuizzes(validQuizzes);
    } catch (err) {
      console.warn('Could not refresh user documents/quizzes:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const studentUser: User = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Student',
          email: fbUser.email || '',
          createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
        };
        setUser(studentUser);

        // Synchronize with server session token
        try {
          const syncRes = await api.syncFirebaseUser(fbUser.uid, studentUser.name, studentUser.email);
          if (syncRes?.token) {
            setStoredToken(syncRes.token);
          }
        } catch (syncErr) {
          console.warn('[Firebase Sync]', syncErr);
        }

        await refreshUserData();
        setIsLoadingAuth(false);
      } else {
        // Fallback to local token check if no Firebase user
        const token = getStoredToken();
        if (token) {
          api
            .getMe()
            .then(async (res) => {
              if (res?.user && res.user.email) {
                setUser(res.user);
                await refreshUserData();
              } else {
                setStoredToken(null);
                setUser(null);
              }
            })
            .catch(() => {
              setStoredToken(null);
              setUser(null);
            })
            .finally(() => {
              setIsLoadingAuth(false);
            });
        } else {
          setIsLoadingAuth(false);
        }
      }
    });

    return () => unsubscribe();
  }, [refreshUserData]);

  const loginWithGoogle = async () => {
    try {
      const fbUser = await signInWithGoogle();
      const studentUser: User = {
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Student',
        email: fbUser.email || '',
        createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
      };
      setUser(studentUser);
      showToast(`Welcome, ${studentUser.name}! (Connected via Firebase)`, 'success');
      await refreshUserData();
    } catch (err: any) {
      showToast(err.message || 'Firebase Google Sign-In failed.', 'error');
      throw err;
    }
  };

  const loginWithToken = async (token: string, loggedInUser: User) => {
    setStoredToken(token);
    setUser(loggedInUser);
    await refreshUserData();
  };

  const logout = () => {
    signOutFromFirebase().catch(() => {});
    api.logout().catch(() => {});
    setStoredToken(null);
    setUser(null);
    setDocuments([]);
    setQuizzes([]);
    showToast('Signed out of AI Study Assistant.', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingAuth,
        documents,
        quizzes,
        isLoadingData,
        toasts,
        showToast,
        dismissToast,
        loginWithToken,
        loginWithGoogle,
        logout,
        refreshUserData,
        setUser,
        setDocuments,
        setQuizzes,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
