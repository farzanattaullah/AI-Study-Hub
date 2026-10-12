import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'ai_study_assistant_firebase_session_token_key_2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

/**
 * Generate a secure signed session token for local/demo accounts using native Node.js crypto.
 * No external JWT library is used.
 */
export function generateToken(user: { _id?: string; id?: string; email: string; name: string }): string {
  const userId = String(user.id || user._id);
  const payload = JSON.stringify({
    id: userId,
    email: user.email,
    name: user.name,
    timestamp: Date.now(),
  });
  const encodedPayload = Buffer.from(payload).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(encodedPayload).digest('base64url');
  return `fb_${encodedPayload}.${signature}`;
}

/**
 * Parses Google Firebase ID Token payload safely without any JWT library.
 */
function decodeFirebaseToken(token: string): { id: string; email: string; name: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const jsonStr = Buffer.from(parts[1], 'base64url').toString('utf8');
    const payload = JSON.parse(jsonStr);

    // Verify token has Firebase user identifiers
    const uid = payload.sub || payload.user_id;
    if (uid) {
      return {
        id: String(uid),
        email: String(payload.email || ''),
        name: String(payload.name || payload.email?.split('@')[0] || 'Student'),
      };
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Verifies local signed session tokens.
 */
function verifySessionToken(token: string): { id: string; email: string; name: string } | null {
  if (!token.startsWith('fb_')) return null;
  const parts = token.slice(3).split('.');
  if (parts.length !== 2) return null;
  const [encodedPayload, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(encodedPayload).digest('base64url');

  if (signature !== expectedSignature) return null;

  try {
    const jsonStr = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    const data = JSON.parse(jsonStr);
    if (data.id) {
      return {
        id: String(data.id),
        email: String(data.email || ''),
        name: String(data.name || 'Student'),
      };
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Authenticates incoming requests using Firebase ID Tokens or signed session tokens.
 */
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please log in with Firebase to continue.' });
  }

  // 1. Try Firebase ID Token
  const fbUser = decodeFirebaseToken(token);
  if (fbUser) {
    req.user = fbUser;
    return next();
  }

  // 2. Try native session token
  const sessionUser = verifySessionToken(token);
  if (sessionUser) {
    req.user = sessionUser;
    return next();
  }

  return res.status(401).json({ error: 'Your session has expired or is invalid. Please log in again.' });
}
