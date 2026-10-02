import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, StudyDocument, Quiz } from '../types/study';
import { api, getStoredToken, setStoredToken } from '../services/api';

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
    const token = getStoredToken();
    if (!token) return;
    setIsLoadingData(true);
    try {
      const [docsRes, quizzesRes] = await Promise.all([
        api.getDocuments(),
        api.getQuizzes(),
      ]);
      const validDocs = Array.isArray(docsRes?.documents)
        ? docsRes.documents.filter((d) => d && typeof d === 'object' && d._id)
        : [];
      const validQuizzes = Array.isArray(quizzesRes?.quizzes)
        ? quizzesRes.quizzes.filter((q) => q && typeof q === 'object' && q._id)
        : [];
      setDocuments(validDocs);
      setQuizzes(validQuizzes);
    } catch (err) {
      console.warn('Could not refresh user documents/quizzes:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setIsLoadingAuth(false);
      return;
    }

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
  }, [refreshUserData]);

  const loginWithToken = async (token: string, loggedInUser: User) => {
    setStoredToken(token);
    setUser(loggedInUser);
    await refreshUserData();
  };

  const logout = () => {
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
