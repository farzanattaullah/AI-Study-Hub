export interface IDocument {
  _id: string;
  id?: string;
  userId: string;
  title: string;
  fileName: string;
  fileType: 'PDF' | 'TXT';
  fileSize: number;
  extractedText: string;
  summary: {
    shortSummary: string;
    detailedSummary: string;
    keyPoints: string[];
    formulas: { name: string; formula: string; description: string }[];
    examples: string[];
  };
  importantTopics: {
    name: string;
    explanation: string;
    importance: 'High' | 'Medium' | 'Foundational';
  }[];
  importantDefinitions: {
    term: string;
    definition: string;
    context?: string;
  }[];
  importantQuestions: {
    shortAnswer: { question: string; answerHint: string }[];
    longAnswer: { question: string; keyPointsToInclude: string[] }[];
    examOriented: { question: string; marks: string; frequency: string }[];
  };
  savedQuestions: string[];
  explanationsCache: Record<
    string,
    {
      topic: string;
      simpleExplanation: string;
      example: string;
      keyPoints: string[];
      importantTerms: { term: string; meaning: string }[];
      sourceLabel: string;
    }
  >;
  sourcePreference: 'pdf_only' | 'pdf_and_external';
  processingStatus: 'processing' | 'ready' | 'failed';
  createdAt: string | Date;
  updatedAt: string | Date;
}
