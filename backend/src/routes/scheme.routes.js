import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// POST /api/schemes/recommend — Generate scheme recommendations using Gemini AI
router.post('/recommend', authenticate, async (req, res) => {
  try {
    const {
      age, gender, income, occupation, education, state, district,
      farmer, student, businessOwner, disability, minority, seniorCitizen, women
    } = req.body;

    let matchedSchemes;
    const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY';

    if (hasApiKey) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are an expert Government Scheme matching engine for India.
Analyze the following citizen profile:
- Age: ${age}
- Gender: ${gender}
- Annual Household Income: ₹${income}
- Occupation: ${occupation}
- Education: ${education}
- State: ${state}
- District: ${district}
- Farmer: ${farmer ? 'Yes' : 'No'}
- Student: ${student ? 'Yes' : 'No'}
- Business Owner: ${businessOwner ? 'Yes' : 'No'}
- Person with Disability: ${disability ? 'Yes' : 'No'}
- Minority Community: ${minority ? 'Yes' : 'No'}
- Senior Citizen: ${seniorCitizen ? 'Yes' : 'No'}
- Women Benefit Focus: ${women ? 'Yes' : 'No'}

Based on this profile, identify 3 to 5 highly relevant central or state government schemes in India.
For EVERY scheme, you MUST provide the following details:
1. name (the title of the scheme)
2. description (a brief overview of the scheme)
3. benefits (what financial or welfare support it gives)
4. eligibility (who can apply)
5. documentsRequired (a list of documents needed to apply, as a JSON array of strings)
6. howToApply (step-by-step application instructions)
7. applicationLink (the official website URL to apply)
8. deadline (the expiry date or 'Ongoing')

Format the response strictly as a valid JSON array of objects, like this:
[
  {
    "name": "Scheme Name",
    "description": "...",
    "benefits": "...",
    "eligibility": "...",
    "documentsRequired": ["Aadhaar Card", "..."],
    "howToApply": "...",
    "applicationLink": "https://...",
    "deadline": "..."
  }
]
Do not include any wrapping markdown formatting like \`\`\`json or text explanation, only return the clean JSON array.`;

        const result = await model.generateContent(prompt);
        let textResponse = result.response.text().trim();
        
        // Clean markdown backticks if Gemini still returned them
        if (textResponse.startsWith('```')) {
          textResponse = textResponse.replace(/^```json\s*/, '').replace(/```$/, '');
        }

        matchedSchemes = JSON.parse(textResponse);
      } catch (err) {
        console.error("Gemini scheme error: ", err);
        matchedSchemes = null;
      }
    }

    if (!matchedSchemes) {
      // Local fallback mock matching based on profile inputs
      matchedSchemes = [];
      
      if (farmer) {
        matchedSchemes.push({
          name: "PM Kisan Samman Nidhi",
          description: "Income support scheme for landholder farmer families to help meet agricultural expenses.",
          benefits: "Direct cash transfer of ₹6,000 per year in three equal installments of ₹2,000.",
          eligibility: "All small and marginal landholding farmer families across India.",
          documentsRequired: ["Aadhaar Card", "Land ownership records/Patta", "Bank Account Details", "Mobile Number"],
          howToApply: "Register online via PM-Kisan portal, or submit application at nearest Common Service Center (CSC) or local agriculture office.",
          applicationLink: "https://pmkisan.gov.in",
          deadline: "Ongoing"
        });
      }

      if (student || age < 25) {
        matchedSchemes.push({
          name: "Post Matric Scholarship Scheme",
          description: "Financial assistance for students belonging to minority, SC, ST, and OBC groups pursuing post-matric courses.",
          benefits: "Full tuition fee reimbursement and maintenance allowance up to ₹1,200/month.",
          eligibility: "Students from SC/ST/OBC/Minority categories with household income below ₹2.5 Lakh/year.",
          documentsRequired: ["Caste Certificate", "Income Certificate", "Marksheet of previous exam", "Aadhaar Card", "Fee Receipt"],
          howToApply: "Apply online through the National Scholarship Portal (NSP). Register, fill application form, upload documents, and submit.",
          applicationLink: "https://scholarships.gov.in",
          deadline: "December 31 annually"
        });
      }

      if (income < 300000 || age > 60) {
        matchedSchemes.push({
          name: "Ayushman Bharat PM-JAY",
          description: "National health insurance scheme offering cashless secondary and tertiary healthcare coverage.",
          benefits: "Health cover of up to ₹5 Lakh per family per year for secondary and tertiary hospitalization.",
          eligibility: "Identified poor and vulnerable families based on SECC 2011 data.",
          documentsRequired: ["Aadhaar Card", "Ration Card", "PMJAY Letter/Golden Card"],
          howToApply: "Check eligibility online. Visit nearest empanelled hospital or Ayushman kiosk to get your Ayushman Golden Card.",
          applicationLink: "https://pmjay.gov.in",
          deadline: "Ongoing"
        });
      }

      if (businessOwner || occupation === 'Business Owner') {
        matchedSchemes.push({
          name: "Pradhan Mantri Mudra Yojana",
          description: "Mudra loans for micro and small enterprises to provide funding for business setup and expansion.",
          benefits: "Collateral-free loans up to ₹10 Lakh categorized under Shishu, Kishor, and Tarun categories.",
          eligibility: "Non-corporate, non-farm small/micro enterprises run by Indian citizens.",
          documentsRequired: ["Business Plan", "Identity Proof", "Address Proof", "Mudra Application Form", "Quotation of machinery/assets"],
          howToApply: "Apply online via Udyam Mitra portal or visit any public/private commercial bank branch.",
          applicationLink: "https://www.mudra.org.in",
          deadline: "Ongoing"
        });
      }

      // Default fallback if nothing matches
      if (matchedSchemes.length === 0) {
        matchedSchemes.push({
          name: "PM Awas Yojana (Housing for All)",
          description: "Affordable housing scheme promoting homeownership among low and middle-income families.",
          benefits: "Interest subsidy of up to 6.5% on home loans, reducing borrowing cost by up to ₹2.67 Lakh.",
          eligibility: "Indian families with household income up to ₹18 Lakh/year who do not own a pucca house.",
          documentsRequired: ["Aadhaar Card", "PAN Card", "Income Proof", "Affidavit of not owning a house"],
          howToApply: "Apply online via PMAY MIS portal or through any designated bank branch.",
          applicationLink: "https://pmaymis.gov.in",
          deadline: "Ongoing"
        });
      }
    }

    // Save recommendations to User profile in MongoDB
    const user = req.user;
    user.recommendedSchemes = matchedSchemes;
    await user.save();

    res.json({ schemes: matchedSchemes });
  } catch (err) {
    console.error("Scheme recommendation endpoint error:", err);
    res.status(500).json({ error: 'Failed to generate scheme recommendations' });
  }
});

// GET /api/schemes/recommend — Retrieve saved recommendations
router.get('/recommend', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ recommendations: user.recommendedSchemes || [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve saved recommendations' });
  }
});

export default router;
