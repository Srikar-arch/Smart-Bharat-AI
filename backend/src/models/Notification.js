import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['broadcast', 'target'], default: 'broadcast' },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

NotificationSchema.index({ timestamp: -1 });

export const Notification = mongoose.model('Notification', NotificationSchema);
