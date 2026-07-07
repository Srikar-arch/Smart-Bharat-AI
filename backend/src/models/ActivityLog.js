import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  details: { type: String, required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

ActivityLogSchema.index({ timestamp: -1 });

export const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);
