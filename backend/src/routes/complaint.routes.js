import express from 'express';
import { Complaint } from '../models/Complaint.js';
import { authenticate } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

const validateComplaint = [
  body('description').trim().isLength({ min: 50 }).withMessage('Description must be at least 50 characters'),
];

// GET /api/complaints — Get user's complaints
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, page = 1, limit = 15 } = req.query;
    const query = { user: req.user.id };
    if (status) query.status = status;

    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Complaint.countDocuments(query);

    res.json({
      complaints,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// GET /api/complaints/analytics — Get charts summary
router.get('/analytics', authenticate, async (req, res) => {
  try {
    // Aggregation of categories and statuses
    const categories = await Complaint.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const statuses = await Complaint.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({ categories, statuses });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// GET /api/complaints/:id — Get single complaint
router.get('/:id', authenticate, async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      $or: [{ _id: req.params.id }, { complaintId: req.params.id }],
      user: req.user.id,
    });

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json({ complaint });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch complaint' });
  }
});

// POST /api/complaints — File new complaint with Gemini AI classification
router.post('/', authenticate, validateComplaint, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { description, location, media, witness } = req.body;

    let aiClassification = {
      category: 'other',
      priority: 'medium',
      title: 'Civic Complaint',
      summary: description.slice(0, 100) + '...',
      department: 'Concerned Local Municipality Office',
      draft: `Dear Sir/Madam,\n\nI am writing to report an issue regarding: ${description}.\n\nSincerely,\nConcerned Citizen`
    };

    const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY';

    if (hasApiKey) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are an AI civic assistant for the Government of India.
Analyze the following citizen complaint description:
"${description}"

Based on the description, analyze and generate:
1. Category: Must be exactly one of: road, water, electricity, garbage, corruption, scheme, police, other
2. Priority: Predict urgency (exactly one of: low, medium, high, urgent)
3. Title: A short, professional title (under 10 words)
4. Summary: A clear one-sentence summary of the issue
5. Department: Recommend the concerned department to route it to (e.g. Municipal Works Dept, RTO, Pollution Control Board, Electricity Corp)
6. Professional Draft: Generate a formal, professional complaint letter addressed to the concerned department, stating the problem and requesting swift action.

Format the response strictly as a valid JSON object:
{
  "category": "road",
  "priority": "medium",
  "title": "Professional Title",
  "summary": "One sentence summary...",
  "department": "Assigned Department",
  "draft": "Dear Sir/Madam, \\n\\n I am writing to..."
}
Do not include any wrapping markdown formatting like \`\`\`json or text explanation, only return the clean JSON.`;

        const result = await model.generateContent(prompt);
        let textResponse = result.response.text().trim();
        if (textResponse.startsWith('```')) {
          textResponse = textResponse.replace(/^```json\s*/, '').replace(/```$/, '');
        }

        const parsed = JSON.parse(textResponse);
        if (parsed.category) {
          aiClassification = parsed;
        }
      } catch (err) {
        console.error("Gemini complaint classification failed: ", err.message);
      }
    } else {
      // Local offline fallback rules
      const lower = description.toLowerCase();
      if (lower.includes('road') || lower.includes('pothole') || lower.includes('street')) {
        aiClassification.category = 'road';
        aiClassification.department = 'Roads and Municipal Infrastructure Office';
        aiClassification.title = 'Urgent Request for Repair of Road defects';
        aiClassification.priority = 'high';
      } else if (lower.includes('garbage') || lower.includes('trash') || lower.includes('waste')) {
        aiClassification.category = 'garbage';
        aiClassification.department = 'Sanitation & Solid Waste Management';
        aiClassification.title = 'Request for Waste/Garbage Removal';
        aiClassification.priority = 'medium';
      } else if (lower.includes('water') || lower.includes('leak') || lower.includes('drain')) {
        aiClassification.category = 'water';
        aiClassification.department = 'Water Supply and Sanitation Board';
        aiClassification.title = 'Complaint Regarding Drainage / Water Pipeline Leakage';
        aiClassification.priority = 'high';
      }
    }

    const complaint = await Complaint.create({
      title: aiClassification.title,
      description: description,
      category: aiClassification.category,
      priority: aiClassification.priority,
      location: location,
      media: media,
      witness: witness,
      authority: {
        department: aiClassification.department,
        name: 'Chief Grievance Officer'
      },
      aiSummary: aiClassification.summary,
      aiDraft: aiClassification.draft,
      user: req.user.id,
      updates: [{
        status: 'pending',
        message: `Complaint registered. Route assigned to ${aiClassification.department}`,
        updatedBy: 'System',
      }],
    });

    res.status(201).json({
      message: 'Complaint filed successfully',
      complaint,
      complaintId: complaint.complaintId,
    });
  } catch (error) {
    console.error('Complaint creation error:', error);
    res.status(500).json({ error: 'Failed to file complaint' });
  }
});

// PATCH /api/complaints/:id/status — Update complaint status (admin)
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status, message } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status,
        $push: {
          updates: {
            status,
            message: message || `Status updated to ${status}`,
            updatedBy: req.user.displayName || 'Admin',
            timestamp: new Date()
          }
        },
        ...(status === 'resolved' ? { resolvedAt: new Date() } : {}),
      },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json({ message: 'Status updated', complaint });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

export default router;
