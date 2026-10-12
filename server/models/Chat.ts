export interface IChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sourceType: 'pdf' | 'external' | 'not_found' | 'system';
  sourceLabel?: string;
  relevantSection?: string;
  requiresExternalPermission?: boolean;
  pendingQuestion?: string;
  permissionResolved?: boolean;
  sources?: { title: string; url: string; domain: string }[];
  timestamp: string;
}

export interface IChat {
  _id: string;
  id?: string;
  userId: string;
  documentId: string;
  messages: IChatMessage[];
  sourceMode: 'pdf_only' | 'pdf_and_external';
  createdAt: string | Date;
  updatedAt: string | Date;
}
