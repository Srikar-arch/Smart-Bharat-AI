import express from 'express';
import { User } from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users/profile — Get profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PATCH /api/users/profile — Update general profile details
router.patch('/profile', authenticate, async (req, res) => {
  try {
    const allowedFields = [
      'displayName', 'phoneNumber', 'state', 'district',
      'category', 'language', 'notifications'
    ];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select('-__v');

    res.json({ user });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// POST /api/users/bookmarks — Add a bookmark (e.g. scheme ID)
router.post('/bookmarks', authenticate, async (req, res) => {
  try {
    const { item } = req.body;
    if (!item) return res.status(400).json({ error: 'Item parameter is required' });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { bookmarks: item } },
      { new: true }
    );
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add bookmark' });
  }
});

// DELETE /api/users/bookmarks — Delete a bookmark
router.delete('/bookmarks', authenticate, async (req, res) => {
  try {
    const { item } = req.body;
    if (!item) return res.status(400).json({ error: 'Item parameter is required' });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { bookmarks: item } },
      { new: true }
    );
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove bookmark' });
  }
});

// POST /api/users/searches — Add recent search term
router.post('/searches', authenticate, async (req, res) => {
  try {
    const { query } = req.body;
    if (!query?.trim()) return res.status(400).json({ error: 'Query parameter is required' });

    const user = await User.findById(req.user.id);
    // Keep only last 10 unique searches
    const current = user.recentSearches.filter(s => s !== query);
    current.unshift(query);
    if (current.length > 10) current.pop();

    user.recentSearches = current;
    await user.save();

    res.json({ recentSearches: user.recentSearches });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save search term' });
  }
});

// POST /api/users/chats — Save/update an AI chat session
router.post('/chats', authenticate, async (req, res) => {
  try {
    const { chatId, title, messages } = req.body;
    if (!chatId) return res.status(400).json({ error: 'chatId is required' });

    const user = await User.findById(req.user.id);
    const existingIndex = user.savedChats.findIndex(c => c.chatId === chatId);

    if (existingIndex > -1) {
      user.savedChats[existingIndex].messages = messages;
      if (title) user.savedChats[existingIndex].title = title;
    } else {
      user.savedChats.push({ chatId, title: title || 'New Chat', messages });
    }

    await user.save();
    res.json({ savedChats: user.savedChats });
  } catch (err) {
    console.error("Failed to save chat:", err);
    res.status(500).json({ error: 'Failed to save chat conversation' });
  }
});

export default router;
