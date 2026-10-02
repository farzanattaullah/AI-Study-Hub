import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppRoute, StudyDocument, Quiz } from './types/study';
import { api } from './services/api';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import MyDocumentsPage from './pages/MyDocumentsPage';
import DocumentDetailsPage from './pages/DocumentDetailsPage';
import AITutorPage from './pages/AITutorPage';
import QuizzesPage from './pages/QuizzesPage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import ToastContainer from './components/ui/ToastContainer';

function MainAppRouter() {
  const { user, isLoadingAuth, documents, setDocuments, quizzes, setQuizzes, showToast } =
    useAuth();

  const [route, setRoute] = useState<AppRoute>('landing');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [selectedDocTab, setSelectedDocTab] = useState<string>('summary');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  // Automatically direct authenticated users away from landing/login/signup to dashboard
  useEffect(() => {
    if (!isLoadingAuth) {
      if (user && (route === 'landing' || route === 'login' || route === 'signup')) {
        setRoute('dashboard');
      } else if (!user && route !== 'landing' && route !== 'login' && route !== 'signup') {
        setRoute('landing');
      }
    }
  }, [user, isLoadingAuth, route]);

  const validDocuments = Array.isArray(documents) ? documents.filter(Boolean) : [];
  const validQuizzes = Array.isArray(quizzes) ? quizzes.filter(Boolean) : [];

  const activeDocument =
    validDocuments.find((d) => d._id === selectedDocId) || validDocuments[0] || null;

  const handleOpenDocument = (doc: StudyDocument, tab = 'summary') => {
    if (!doc?._id) return;
    setSelectedDocId(doc._id);
    setSelectedDocTab(tab);
    setRoute('document-detail');
  };

  const handleStartQuizForDocument = async (doc: StudyDocument) => {
    if (!doc?._id) return;
    const existingQuiz = validQuizzes.find((q) => q.documentId === doc._id);
    if (existingQuiz) {
      setSelectedQuiz(existingQuiz);
      setRoute('quizzes');
      return;
    }

    try {
      showToast(`Generating AI MCQ Quiz for "${doc.title || 'Study Material'}"...`, 'info');
      const res = await api.generateQuiz(doc._id, 5);
      if (res?.quiz) {
        setQuizzes((prev) => [res.quiz, ...(Array.isArray(prev) ? prev.filter(Boolean) : [])]);
        setSelectedQuiz(res.quiz);
        setRoute('quizzes');
      }
    } catch (err: any) {
      showToast(err.message || 'Could not generate quiz.', 'error');
    }
  };

  const handleOpenTutorForDocument = (doc: StudyDocument) => {
    if (!doc?._id) return;
    setSelectedDocId(doc._id);
    setRoute('tutor');
  };

  const handleDocumentUpdated = (updatedDoc: StudyDocument) => {
    if (!updatedDoc?._id) return;
    setDocuments((prev) =>
      (Array.isArray(prev) ? prev.filter(Boolean) : []).map((d) =>
        d._id === updatedDoc._id ? updatedDoc : d
      )
    );
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen w-full bg-[#050811] flex flex-col items-center justify-center gap-3 text-slate-300">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono tracking-wider text-slate-400">
          Loading AI Study Assistant...
        </p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />

      {!user ? (
        route === 'login' ? (
          <LoginPage
            onSuccess={() => setRoute('dashboard')}
            onNavigateSignup={() => setRoute('signup')}
            onNavigateLanding={() => setRoute('landing')}
          />
        ) : route === 'signup' ? (
          <SignupPage
            onSuccess={() => setRoute('dashboard')}
            onNavigateLogin={() => setRoute('login')}
            onNavigateLanding={() => setRoute('landing')}
          />
        ) : (
          <LandingPage
            onNavigateLogin={() => setRoute('login')}
            onNavigateSignup={() => setRoute('signup')}
          />
        )
      ) : (
        <DashboardLayout
          activeRoute={route}
          onNavigate={(nextRoute) => {
            if (nextRoute === 'quizzes') {
              setSelectedQuiz(null);
            }
            setRoute(nextRoute);
          }}
        >
          {route === 'dashboard' && (
            <DashboardPage
              onNavigate={(r) => {
                if (r === 'quizzes') setSelectedQuiz(null);
                setRoute(r);
              }}
              onOpenDocument={handleOpenDocument}
              onStartQuizForDocument={handleStartQuizForDocument}
              onOpenTutorForDocument={handleOpenTutorForDocument}
              onSelectQuiz={(quiz) => {
                setSelectedQuiz(quiz);
                setRoute('quizzes');
              }}
            />
          )}

          {route === 'upload' && (
            <UploadPage
              onOpenDocumentTab={handleOpenDocument}
              onStartQuiz={(quiz) => {
                setSelectedQuiz(quiz);
                setRoute('quizzes');
              }}
              onOpenTutor={handleOpenTutorForDocument}
            />
          )}

          {route === 'documents' && (
            <MyDocumentsPage
              onOpenDocumentTab={handleOpenDocument}
              onStartQuizForDocument={handleStartQuizForDocument}
              onOpenTutorForDocument={handleOpenTutorForDocument}
              onNavigateUpload={() => setRoute('upload')}
            />
          )}

          {route === 'document-detail' && activeDocument && (
            <DocumentDetailsPage
              document={activeDocument}
              initialTab={selectedDocTab}
              onBack={() => setRoute('documents')}
              onStartQuiz={(quiz) => {
                setSelectedQuiz(quiz);
                setRoute('quizzes');
              }}
              onDocumentUpdated={handleDocumentUpdated}
            />
          )}

          {route === 'tutor' && <AITutorPage initialDocument={activeDocument} />}

          {route === 'quizzes' && (
            <QuizzesPage
              initialQuiz={selectedQuiz}
              onOpenDocument={(docId) => {
                setSelectedDocId(docId);
                setSelectedDocTab('summary');
                setRoute('document-detail');
              }}
            />
          )}

          {route === 'progress' && (
            <ProgressPage
              onSelectQuiz={(quiz) => {
                setSelectedQuiz(quiz);
                setRoute('quizzes');
              }}
            />
          )}

          {route === 'profile' && <ProfilePage />}
        </DashboardLayout>
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppRouter />
    </AuthProvider>
  );
}
