import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  getDocFromServer,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { StudyDocument, Quiz, ChatSession, User } from '../types/study';

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/* CRITICAL: The app will break without this database ID parameter */
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

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
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on initialization
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Connection offline. Check configuration.');
      return false;
    }
    // Access denied is expected if rules deny /test/connection, but confirms network reachability
    return true;
  }
}

// Google Sign In via popup (preferred in iframe/AI Studio preview)
export async function signInWithGoogle(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Save or update user profile document in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(
      userDocRef,
      {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Student',
        email: user.email || '',
        photoURL: user.photoURL || '',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return user;
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign in popup was closed before completing.');
    }
    throw error;
  }
}

export async function signOutFromFirebase(): Promise<void> {
  await signOut(auth);
}

// Firestore Document operations for authenticated users
export const firestoreService = {
  // Sync document to Firestore
  async saveDocument(userId: string, document: StudyDocument): Promise<void> {
    const docPath = `users/${userId}/documents/${document._id}`;
    try {
      await setDoc(doc(db, 'users', userId, 'documents', document._id), {
        ...document,
        userId,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, docPath);
    }
  },

  // Get all documents for a user from Firestore
  async getDocuments(userId: string): Promise<StudyDocument[]> {
    const colPath = `users/${userId}/documents`;
    try {
      const q = query(collection(db, 'users', userId, 'documents'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => d.data() as StudyDocument);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, colPath);
    }
  },

  // Delete document
  async deleteDocument(userId: string, docId: string): Promise<void> {
    const docPath = `users/${userId}/documents/${docId}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'documents', docId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, docPath);
    }
  },

  // Save Quiz to Firestore
  async saveQuiz(userId: string, quiz: Quiz): Promise<void> {
    const docPath = `users/${userId}/quizzes/${quiz._id}`;
    try {
      await setDoc(doc(db, 'users', userId, 'quizzes', quiz._id), {
        ...quiz,
        userId,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, docPath);
    }
  },

  // Get user Quizzes
  async getQuizzes(userId: string): Promise<Quiz[]> {
    const colPath = `users/${userId}/quizzes`;
    try {
      const q = query(collection(db, 'users', userId, 'quizzes'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => d.data() as Quiz);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, colPath);
    }
  },

  // Save Chat to Firestore
  async saveChat(userId: string, chat: ChatSession): Promise<void> {
    const docPath = `users/${userId}/chats/${chat._id || chat.documentId}`;
    try {
      await setDoc(doc(db, 'users', userId, 'chats', chat._id || chat.documentId), {
        ...chat,
        userId,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, docPath);
    }
  },

  // Get Chat for a document
  async getChat(userId: string, documentId: string): Promise<ChatSession | null> {
    const docPath = `users/${userId}/chats/${documentId}`;
    try {
      const snap = await getDoc(doc(db, 'users', userId, 'chats', documentId));
      if (!snap.exists()) return null;
      return snap.data() as ChatSession;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, docPath);
    }
  },
};
