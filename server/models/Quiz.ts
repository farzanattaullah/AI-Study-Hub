export interface IQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface IQuiz {
  _id: string;
  id?: string;
  userId: string;
  documentId: string;
  documentTitle: string;
  title: string;
  questions: IQuizQuestion[];
  score: number | null;
  totalQuestions: number;
  percentage: number | null;
  userAnswers: number[];
  completedAt: string | Date | null;
  createdAt: string | Date;
}
