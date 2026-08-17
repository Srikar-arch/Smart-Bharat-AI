import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const SYSTEM_PROMPT = `You are Smart Bharat AI, India's intelligent civic companion. Your mission is to help Indian citizens understand government services, schemes, and processes.

Guidelines:
1. Always answer queries using simple, clear, and easy-to-understand language.
2. For any scheme, document, or service query, you MUST always structure your response to provide:
   - **Eligibility**: Who is eligible to apply or benefit.
   - **Required Documents**: List of documents needed.
   - **Application Process**: Step-by-step instructions on how to apply.
   - **Official Website**: URLs of the official government portals.
   - **Processing Time**: Expected timeframe for resolution.
   - **Useful Tips**: Important cautions, hacks, or advice.
3. NEVER invent or hallucinate government information. If you are uncertain of the details, state that you don't have the verified details and recommend official government portals.
4. Support the following service domains and sectors:
   - Passport & Visa Services
   - PAN Card (Permanent Account Number)
   - Driving Licence & RTO Services
   - Aadhaar Card & UIDAI services
   - Scholarships & Education Schemes (Central & State)
   - Healthcare & Ayushman Bharat
   - Agriculture & PM-KISAN
   - Employment & Skill Development (PMKVY, etc.)
   - Tax & GST (Income Tax, filing guides)
   - Police & Law Enforcement
   - Municipality & Urban Local Bodies
   - Housing Schemes (PMAY Central & State)
   - Digital India initiatives
   - Women Welfare & Empowerment schemes
   - Senior Citizen benefits & pensions
   - Disability assistance (UDID card, etc.)
   - Cyber Crime reporting guidance
   - Railways & IRCTC assistance
   - Emergency Services contact info
5. Support queries in all Indian languages (English, Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, etc.) and respond in the same language the user writes in.
6. Use clean, rich markdown formatting for tables, lists, and headers to ensure high readability.`;

// Chat with Gemini AI and sync history with MongoDB
router.post('/chat', authenticate, async (req, res) => {
  try {
    const { message, history = [], language = 'en', chatId } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let text;
    const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY';

    if (hasApiKey) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const chatHistory = [
          { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
          {
            role: 'model',
            parts: [{ text: 'Namaste! I am Smart Bharat AI, your intelligent civic companion. I can guide you through government schemes, document guides, and civic resources. How can I assist you today?' }]
          },
          ...history.map(h => ({
            role: h.role === 'assistant' ? 'model' : h.role,
            parts: [{ text: h.content }]
          }))
        ];

        const chat = model.startChat({ history: chatHistory });
        const result = await chat.sendMessage(message);
        const response = await result.response;
        text = response.text();
      } catch (geminiError) {
        console.error('Gemini direct error, failing back to mock response:', geminiError.message);
        text = null;
      }
    }

    // Fallback Mock Response matching user prompt criteria
    if (!text) {
      await new Promise(r => setTimeout(r, 1200));
      
      const lowerQuery = message.toLowerCase();
      if (lowerQuery.includes('passport')) {
        text = `## Passport Services in India 🛂

Here is the complete guide to applying for a regular Passport in India.

### Eligibility
- All Indian citizens, including minors and seniors.

### Required Documents
- ✅ Address Proof (Aadhaar Card, Water/Electricity Bill, Bank Statement)
- ✅ Date of Birth Proof (Birth Certificate, Matriculation Certificate)

### Application Process
1. Register on the official Passport Seva portal.
2. Fill the application form online and select your nearest Passport Seva Kendra (PSK).
3. Pay the processing fee online and book an appointment slot.
4. Visit the PSK with original documents for verification.
5. Undergo local Police verification.

### Official Website
- Portal: [passportindia.gov.in](https://www.passportindia.gov.in)

### Processing Time
- Regular: 30 to 45 days.
- Tatkaal: 3 to 7 days.

### Useful Tips
- Double check spelling on your forms to avoid mismatch issues.
- Bring photocopy sets of all original documents for submission.`;
      } else if (lowerQuery.includes('aadhaar')) {
        text = `## Aadhaar Card Services (UIDAI) 🆔

Aadhaar is a 12-digit unique identity number issued by the UIDAI.

### Eligibility
- Every resident of India (including minors and foreign nationals staying for >182 days).

### Required Documents
- ✅ Proof of Identity (Passport, PAN Card, Voter ID)
- ✅ Proof of Address (Aadhaar, Utility bill, Rent agreement)

### Application Process
1. Locate your nearest Aadhaar Enrolment Centre.
2. Fill the enrolment form and submit documents.
3. Provide biometric details (10 fingerprints, iris scans, and photo).
4. Collect the acknowledgement slip containing the 14-digit enrolment ID.

### Official Website
- Portal: [uidai.gov.in](https://uidai.gov.in)

### Processing Time
- Around 15 to 90 days after biometric submission.

### Useful Tips
- Link your mobile number to your Aadhaar to receive OTPs for digital services.
- Update your address online for free via the MyAadhaar portal.`;
      } else {
        text = `## Smart Bharat AI Assistance 🇮🇳

Here is the structured guide regarding your query: **"${message}"**.

### Eligibility
- Must be a citizen of India.
- Additional criteria vary by specific Central/State ministry guidelines.

### Required Documents
- ✅ Identity Proof (Aadhaar Card, PAN Card, or Voter ID)
- ✅ Address Proof (Ration Card, Electricity Bill, or Aadhaar Card)
- ✅ Income & Caste certificates (if seeking scholarships or subventions)

### Application Process
1. Identify the concerned ministry portal or visit your nearest CSC (Common Service Centre).
2. Log in using your mobile number linked to Aadhaar.
3. Fill out the application form carefully and upload all required documents.
4. Note down your Application Reference Number for tracking.

### Official Website
- Discover central services on [india.gov.in](https://www.india.gov.in) or state portals via [mygov.in](https://www.mygov.in).

### Processing Time
- Generally 10 to 20 working days.

### Useful Tips
- Download the **UMANG app** to access multiple services directly on your mobile device.
- Never share OTPs or login credentials with middlemen or unofficial agents.`;
      }
    }

    // Save/Sync Chat session in MongoDB User Document (graceful)
    try {
      const user = req.user;
      const activeChatId = chatId || `chat_${Date.now()}`;
      
      if (user && user.savedChats && typeof user.save === 'function') {
        const existingIndex = user.savedChats.findIndex(c => c.chatId === activeChatId);

        const newUserMsg = { role: 'user', content: message, timestamp: new Date() };
        const newAiMsg = { role: 'model', content: text, timestamp: new Date() };

        if (existingIndex > -1) {
          user.savedChats[existingIndex].messages.push(newUserMsg, newAiMsg);
        } else {
          const title = message.slice(0, 32) + (message.length > 32 ? '...' : '');
          user.savedChats.push({
            chatId: activeChatId,
            title,
            messages: [newUserMsg, newAiMsg],
            createdAt: new Date()
          });
        }

        await user.save();
      }

      res.json({
        message: text,
        chatId: chatId || `chat_${Date.now()}`,
        timestamp: new Date().toISOString(),
      });
    } catch (saveErr) {
      // DB save failed, but still return the AI response to the user
      console.warn('Chat DB sync failed:', saveErr.message);
      res.json({
        message: text,
        chatId: chatId || `chat_${Date.now()}`,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({
      error: 'AI service unavailable',
      message: 'I apologize, our AI service is temporarily unavailable. Please try again.',
    });
  }
});

// Summarize notice/circular
router.post('/summarize', async (req, res) => {
  try {
    const { text, url, language = 'en' } = req.body;

    if (!text && !url) {
      return res.status(400).json({ error: 'Either text or URL is required' });
    }

    let summary;
    const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY';

    if (hasApiKey) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Summarize the following government notification/circular for a common Indian citizen.
Make it simple, highlight key points, deadlines, and actions needed. Respond in ${language === 'hi' ? 'Hindi' : 'English'}.
Text: ${text || 'URL: ' + url}`;

        const result = await model.generateContent(prompt);
        summary = result.response.text();
      } catch (err) {
        summary = null;
      }
    }

    if (!summary) {
      summary = `## Summary of Government Circular
- **Core Subject**: Simplifying access to citizen-centric services.
- **Key Deadlines**: Actions must be taken by the end of the current fiscal quarter.
- **Eligible Citizens**: All Aadhaar-verified citizens.
- **Action Required**: Update verification details on the official portal.`;
    }

    res.json({ summary, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Summarize error:', error);
    res.status(500).json({ error: 'Failed to summarize notice' });
  }
});

// Find eligible schemes based on user profile
router.post('/schemes/match', async (req, res) => {
  try {
    const { age, income, category, state, occupation, gender } = req.body;
    let schemes;
    const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY';

    if (hasApiKey) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Match relevant Indian government schemes for citizen: Age ${age}, Income ${income}, Category ${category}, State ${state}, Occupation ${occupation}, Gender ${gender}. Return structured JSON.`;
        const result = await model.generateContent(prompt);
        schemes = result.response.text();
      } catch (err) {
        schemes = null;
      }
    }

    if (!schemes) {
      schemes = JSON.stringify([
        { schemeName: "PM Awas Yojana", ministry: "Ministry of Housing", benefit: "Interest Subsidy", eligibilityMatch: "High", portal: "pmaymis.gov.in" },
        { schemeName: "Ayushman Bharat", ministry: "Ministry of Health", benefit: "₹5 Lakh Cover", eligibilityMatch: "High", portal: "pmjay.gov.in" }
      ]);
    }

    res.json({ schemes, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Scheme match error:', error);
    res.status(500).json({ error: 'Failed to match schemes' });
  }
});

export default router;
