import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  uid: { type: String, unique: true, sparse: true }, // Firebase UID
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  displayName: { type: String, required: true, trim: true },
  photoURL: { type: String },
  phoneNumber: { type: String },
  role: { type: String, enum: ['user', 'admin', 'moderator', 'official', 'citizen'], default: 'user' },
  state: { type: String },
  district: { type: String },
  category: { type: String, enum: ['General', 'OBC', 'SC', 'ST', 'EWS'], default: 'General' },
  aadhaarVerified: { type: Boolean, default: false },
  language: { type: String, default: 'en' },
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true },
  },
  savedSchemes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' }],
  savedComplaints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' }],
  savedChats: [{
    chatId: { type: String, required: true },
    title: { type: String },
    messages: [{
      role: { type: String, enum: ['user', 'model'], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
  }],
  recommendedSchemes: [{
    name: { type: String },
    description: { type: String },
    benefits: { type: String },
    eligibility: { type: String },
    documentsRequired: [{ type: String }],
    howToApply: { type: String },
    applicationLink: { type: String },
    deadline: { type: String }
  }],
  bookmarks: [{ type: String }], // General bookmark labels/links
  recentSearches: [{ type: String }],
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
}, { timestamps: true });

UserSchema.index({ email: 1 });
UserSchema.index({ uid: 1 });
UserSchema.index({ state: 1 });

export const User = mongoose.model('User', UserSchema);
