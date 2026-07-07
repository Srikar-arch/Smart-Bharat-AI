import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/sync
 * Syncs the logged-in Firebase user with MongoDB.
 * The token verification happens in the `authenticate` middleware.
 */
router.post('/sync', authenticate, async (req, res) => {
  try {
    const { photoURL, phoneNumber, displayName } = req.body;
    const user = req.user;
    let changed = false;

    if (photoURL && user.photoURL !== photoURL) {
      user.photoURL = photoURL;
      changed = true;
    }
    if (phoneNumber && user.phoneNumber !== phoneNumber) {
      user.phoneNumber = phoneNumber;
      changed = true;
    }
    if (displayName && user.displayName !== displayName) {
      user.displayName = displayName;
      changed = true;
    }

    if (changed) {
      await user.save();
    }

    res.json({ user });
  } catch (error) {
    console.error('Auth sync error:', error);
    res.status(500).json({ error: 'Failed to sync user profile' });
  }
});

/**
 * GET /api/auth/me
 * Retrieves current authenticated user profile
 */
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;
