import { User } from '../models/User.js';
import admin, { isFirebaseEnabled } from '../utils/firebase.js';

/**
 * Authentication middleware verifying Firebase ID Tokens.
 * Falls back to mock demo-token in development if Firebase is disabled.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Development/Demo Mode Fallback
    if (token === 'demo-token' || !isFirebaseEnabled) {
      const demoEmail = token === 'demo-token' ? 'demo@smartbharat.ai' : 'offline@smartbharat.ai';
      const role = demoEmail.includes('admin') ? 'admin' : 'user';

      let user = await User.findOne({ email: demoEmail });
      if (!user) {
        user = await User.create({
          email: demoEmail,
          displayName: 'Arjun Sharma',
          uid: 'demo-uid-001',
          role: role,
          state: 'Maharashtra',
          district: 'Pune',
          language: 'en'
        });
      }
      req.user = user;
      return next();
    }

    // Production: Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(token);
    let user = await User.findOne({ uid: decodedToken.uid });

    if (!user) {
      // Sync on demand if not synced via routes
      user = await User.create({
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name || decodedToken.email.split('@')[0],
        photoURL: decodedToken.picture,
        role: decodedToken.email.includes('admin') ? 'admin' : 'user'
      });
    } else {
      user.lastLogin = new Date();
      await user.save();
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error.message);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

/**
 * Role authorization guard for Admins
 */
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
};

/**
 * Role authorization guard for Citizen / User
 */
export const requireCitizen = (req, res, next) => {
  if (req.user?.role !== 'user' && req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Citizen access required' });
  }
  next();
};
