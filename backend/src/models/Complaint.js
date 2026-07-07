import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema({
  complaintId: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, minlength: 50 },
  category: {
    type: String,
    required: true,
    enum: ['road', 'water', 'electricity', 'garbage', 'corruption', 'scheme', 'police', 'other']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'open', 'in-progress', 'resolved', 'closed', 'rejected'],
    default: 'pending'
  },
  location: {
    address: String,
    state: String,
    district: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number,
    }
  },
  media: [{
    url: String,
    type: { type: String, enum: ['image', 'video', 'document'] },
    filename: String,
  }],
  witness: {
    name: String,
    phone: String,
  },
  authority: {
    name: String,
    department: String,
    email: String,
  },
  updates: [{
    status: String,
    message: String,
    updatedBy: String,
    timestamp: { type: Date, default: Date.now },
  }],
  resolvedAt: Date,
  rating: { type: Number, min: 1, max: 5 },
  feedback: String,
  aiSummary: String,
  aiDraft: String,
}, { timestamps: true });

// Auto-generate complaint ID
ComplaintSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Complaint').countDocuments();
    this.complaintId = `SB-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

ComplaintSchema.index({ user: 1, status: 1 });
ComplaintSchema.index({ complaintId: 1 });
ComplaintSchema.index({ 'location.state': 1 });

export const Complaint = mongoose.model('Complaint', ComplaintSchema);
