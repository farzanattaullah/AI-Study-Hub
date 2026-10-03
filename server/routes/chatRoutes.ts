import express, { type Response } from 'express';
import { authenticateToken, type AuthRequest } from '../middleware/auth.ts';
import { dbStore } from '../config/db.ts';

const router = express.Router();

// GET /api/chats/:documentId
router.get('/:documentId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const documentId = String(req.params.documentId);
    const doc = await dbStore.getDocumentById(documentId, req.user!.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    let chat = await dbStore.getChatByDocument(documentId, req.user!.id);
    if (!chat) {
      chat = await dbStore.saveOrUpdateChat(
        documentId,
        req.user!.id,
        [
          {
            id: `msg_init_${Date.now()}`,
            role: 'assistant',
            content: `Hello! I am your Source-First AI Tutor for **${doc.title}**. Ask me any question—I will check your uploaded study material first.`,
            sourceType: 'system',
            sourceLabel: 'Source-First AI Tutor Ready',
            timestamp: new Date().toISOString(),
          },
        ],
        doc.sourcePreference || 'pdf_only'
      );
    }

    return res.json({ chat });
  } catch {
    return res.status(500).json({ error: 'Failed to load chat history.' });
  }
});

// POST /api/chats/:documentId (Sync chat or sourceMode)
router.post('/:documentId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const documentId = String(req.params.documentId);
    const { sourceMode } = req.body;
    const doc = await dbStore.getDocumentById(documentId, req.user!.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    const existing = await dbStore.getChatByDocument(documentId, req.user!.id);
    const mode = sourceMode === 'pdf_and_external' ? 'pdf_and_external' : 'pdf_only';

    await dbStore.updateDocument(documentId, req.user!.id, { sourcePreference: mode });
    const updatedChat = await dbStore.saveOrUpdateChat(
      documentId,
      req.user!.id,
      existing?.messages || [],
      mode
    );

    return res.json({ chat: updatedChat });
  } catch {
    return res.status(500).json({ error: 'Failed to update chat settings.' });
  }
});

// DELETE /api/chats/:documentId
router.delete('/:documentId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const documentId = String(req.params.documentId);
    const doc = await dbStore.getDocumentById(documentId, req.user!.id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    const cleared = await dbStore.clearChat(
      documentId,
      req.user!.id,
      doc.title,
      doc.sourcePreference || 'pdf_only'
    );
    return res.json({ chat: cleared });
  } catch {
    return res.status(500).json({ error: 'Failed to clear conversation.' });
  }
});

export default router;
