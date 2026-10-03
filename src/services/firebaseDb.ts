import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from '../config/firebase';
import { StudyDocument, Quiz, ChatSession } from '../types/study';

export interface FirebaseUserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  photoURL?: string;
}

export const firebaseDb = {
  // USER PROFILE
  async syncUserProfile(profile: { id: string; name: string; email: string; photoURL?: string }) {
    const path = `users/${profile.id}`;
    try {
      const userRef = doc(db, 'users', profile.id);
      const existing = await getDoc(userRef);
      const payload: FirebaseUserProfile = {
        id: profile.id,
        name: profile.name || profile.email.split('@')[0] || 'Student',
        email: profile.email,
        createdAt: existing.exists() ? existing.data()?.createdAt : new Date().toISOString(),
        ...(profile.photoURL ? { photoURL: profile.photoURL } : {}),
      };
      await setDoc(userRef, payload, { merge: true });
      return payload;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async getUserProfile(userId: string): Promise<FirebaseUserProfile | null> {
    const path = `users/${userId}`;
    try {
      const userRef = doc(db, 'users', userId);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return snap.data() as FirebaseUserProfile;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  // DOCUMENTS (/users/{userId}/documents/{documentId})
  async saveDocument(userId: string, document: StudyDocument): Promise<StudyDocument> {
    const docId = document._id || `doc_${Date.now()}`;
    const path = `users/${userId}/documents/${docId}`;
    try {
      const docRef = doc(db, 'users', userId, 'documents', docId);
      const payload = {
        id: docId,
        _id: docId,
        userId,
        title: document.title || 'Untitled Document',
        fileName: document.fileName || 'document.pdf',
        fileType: document.fileType || 'PDF',
        fileSize: document.fileSize || 0,
        extractedText: document.extractedText || '',
        summary: document.summary || {
          shortSummary: '',
          detailedSummary: '',
          keyPoints: [],
          formulas: [],
          examples: [],
        },
        importantTopics: document.importantTopics || [],
        importantDefinitions: document.importantDefinitions || [],
        importantQuestions: document.importantQuestions || { shortAnswer: [], longAnswer: [] },
        savedQuestions: document.savedQuestions || [],
        explanationsCache: document.explanationsCache || {},
        sourcePreference: document.sourcePreference || 'pdf_only',
        processingStatus: document.processingStatus || 'ready',
        createdAt: document.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(docRef, payload, { merge: true });
      return payload as unknown as StudyDocument;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async getDocuments(userId: string): Promise<StudyDocument[]> {
    const path = `users/${userId}/documents`;
    try {
      const colRef = collection(db, 'users', userId, 'documents');
      const q = query(colRef, orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({
        ...d.data(),
        _id: d.id,
      })) as unknown as StudyDocument[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  listenDocuments(
    userId: string,
    onNext: (docs: StudyDocument[]) => void,
    onError?: (error: any) => void
  ): Unsubscribe {
    const path = `users/${userId}/documents`;
    const colRef = collection(db, 'users', userId, 'documents');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({
          ...d.data(),
          _id: d.id,
        })) as unknown as StudyDocument[];
        onNext(docs);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  },

  async updateDocument(userId: string, docId: string, updates: Partial<StudyDocument>) {
    const path = `users/${userId}/documents/${docId}`;
    try {
      const docRef = doc(db, 'users', userId, 'documents', docId);
      const payload = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      await updateDoc(docRef, payload);
      return payload;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteDocument(userId: string, docId: string): Promise<boolean> {
    const path = `users/${userId}/documents/${docId}`;
    try {
      const docRef = doc(db, 'users', userId, 'documents', docId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  // QUIZZES (/users/{userId}/quizzes/{quizId})
  async saveQuiz(userId: string, quiz: Quiz): Promise<Quiz> {
    const quizId = quiz._id || `quiz_${Date.now()}`;
    const path = `users/${userId}/quizzes/${quizId}`;
    try {
      const quizRef = doc(db, 'users', userId, 'quizzes', quizId);
      const payload = {
        id: quizId,
        _id: quizId,
        userId,
        documentId: quiz.documentId,
        documentTitle: quiz.documentTitle || 'Study Document',
        title: quiz.title || 'Practice Quiz',
        questions: quiz.questions || [],
        totalQuestions: quiz.totalQuestions || quiz.questions?.length || 0,
        score: quiz.score ?? null,
        percentage: quiz.percentage ?? null,
        userAnswers: quiz.userAnswers || [],
        completedAt: quiz.completedAt || null,
        createdAt: quiz.createdAt || new Date().toISOString(),
      };
      await setDoc(quizRef, payload, { merge: true });
      return payload as unknown as Quiz;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async getQuizzes(userId: string): Promise<Quiz[]> {
    const path = `users/${userId}/quizzes`;
    try {
      const colRef = collection(db, 'users', userId, 'quizzes');
      const q = query(colRef, orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({
        ...d.data(),
        _id: d.id,
      })) as unknown as Quiz[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  listenQuizzes(
    userId: string,
    onNext: (quizzes: Quiz[]) => void,
    onError?: (error: any) => void
  ): Unsubscribe {
    const path = `users/${userId}/quizzes`;
    const colRef = collection(db, 'users', userId, 'quizzes');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snap) => {
        const quizzes = snap.docs.map((d) => ({
          ...d.data(),
          _id: d.id,
        })) as unknown as Quiz[];
        onNext(quizzes);
      },
      (error) => {
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  },

  async updateQuiz(userId: string, quizId: string, updates: Partial<Quiz>) {
    const path = `users/${userId}/quizzes/${quizId}`;
    try {
      const quizRef = doc(db, 'users', userId, 'quizzes', quizId);
      await updateDoc(quizRef, updates);
      return updates;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  // CHATS (/users/{userId}/chats/{chatId})
  async saveChat(userId: string, chat: ChatSession): Promise<ChatSession> {
    const chatId = chat._id || chat.documentId;
    const path = `users/${userId}/chats/${chatId}`;
    try {
      const chatRef = doc(db, 'users', userId, 'chats', chatId);
      const payload = {
        id: chatId,
        _id: chatId,
        userId,
        documentId: chat.documentId,
        messages: chat.messages || [],
        sourceMode: chat.sourceMode || 'pdf_only',
        createdAt: chat.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(chatRef, payload, { merge: true });
      return payload as unknown as ChatSession;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async getChat(userId: string, documentId: string): Promise<ChatSession | null> {
    const path = `users/${userId}/chats/${documentId}`;
    try {
      const chatRef = doc(db, 'users', userId, 'chats', documentId);
      const snap = await getDoc(chatRef);
      if (snap.exists()) {
        return { ...snap.data(), _id: snap.id } as unknown as ChatSession;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },
};
