import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ai_study_assistant_jwt_secret_key_2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export function generateToken(user: { _id: string; email: string; name: string }): string {
  return jwt.sign(
    { id: String(user._id), email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please log in to continue.' });
  }

  // 1. Try local application JWT
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; name: string };
    req.user = decoded;
    return next();
  } catch {
    // 2. Try Firebase ID Token decoding
    try {
      const decodedFirebase = jwt.decode(token) as any;
      if (decodedFirebase && (decodedFirebase.sub || decodedFirebase.user_id)) {
        req.user = {
          id: String(decodedFirebase.sub || decodedFirebase.user_id),
          email: decodedFirebase.email || '',
          name: decodedFirebase.name || decodedFirebase.email?.split('@')[0] || 'Student',
        };
        return next();
      }
    } catch {
      // Fall through to error response
    }
    return res.status(401).json({ error: 'Your session has expired or is invalid. Please log in again.' });
  }
}
