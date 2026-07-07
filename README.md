# 🇮🇳 Smart Bharat AI — India's Intelligent Civic Companion

Smart Bharat AI is a production-grade, hackathon-winning civic companion web platform designed to empower Indian citizens by simplifying access to government services, localizing information across official languages, easing the grievance reporting process, and analyzing policy circulars using state-of-the-art Artificial Intelligence.

The platform aligns with **Digital India** conventions and **NIC (National Informatics Centre)** design aesthetics to resemble an official Ministry platform, featuring complete multilingual support, voice assistance, keyboard accessibility, and dual-mode authentication.

---

## 🚀 Key Features

### 1. 🤖 Smart Bharat AI Assistant (ChatGPT-conv)
- **Interactive Chat**: A ChatGPT-like conversational companion for government scheme discovery and general citizen support.
- **Strict Guardrails**: Fine-tuned prompt engineering prevents the engine from generating mock/hallucinated policy details, always referring citizens back to official government resources when uncertain.
- **Voice Control**: Full continuous speech-to-text recognition and text-to-speech feedback (English and Indian English).

### 2. 📋 Scheme Recommendation Module
- **Demographic Wizard**: A comprehensive multi-step questionnaire collecting Age, Gender, State, Income, Occupation, and specific demographic identifiers (Farmer, Student, Minority, Senior Citizen).
- **Gemini Recommendations**: Matches demographics to official scheme databases and displays recommended schemes as dynamic, expandable cards.

### 3. 📢 Civic Grievance Complaint System
- **GPS & Nominatim Geolocator**: Reverse-geocodes addresses via Leaflet maps, enabling citizens to drag map pins to mark the exact locations of local issues.
- **AI Router & Classifier**: Analyzes the description, auto-categorizes the grievance, predicts urgency/priority, routes it to the correct Ministry/Department, and generates a formal professional letter addressed to authorities.
- **Status Timeline**: Tracks the resolution path (`Pending`, `Assigned`, `In Progress`, `Resolved`, `Rejected`).
- **Interactive Analytics**: Displays local complaint statistics and status categories via Chart.js charts.
- **PDF Receipt Exporter**: Prints formatted complaint verification certificates instantly.

### 4. 📄 Citizen Document Manual & Circular Summarizer
- **Step-by-Step Checklists**: Detailed application guides (Required Docs, Estimated Fees, Processing Time, Office addresses, and Common Pitfalls) for key documents: Aadhaar, PAN, Passport, GST, Caste/Income certificates, and Startup registrations.
- **Notice Summarizer**: Converts official long-form PDF notifications or circular texts into bulleted layperson language, highlighting critical deadlines and warnings.

### 5. ♿ Inclusivity & Accessibility
- **10 Official Indian Languages**: English, Hindi, Telugu, Tamil, Kannada, Malayalam, Gujarati, Punjabi, Marathi, and Bengali.
- **Visual Filters**: High contrast/color-blind mode filter controls.
- **Flexible Typography**: Injects dynamic text resizers (`A-`, `A`, `A+`) modifying global sizing tokens.
- **Zero-Latency Recognition**: Real-time voice parser triggers navigation actions on key phrases with zero pauses.

### 6. 🔒 Production-Grade Admin Dashboard
- **Citizen Directory**: Review citizen profiles, modify roles (Citizen, Official, Moderator, Admin), and suspend/activate accounts.
- **Grievance Console**: Re-route complaint departments and update resolution milestones.
- **Broadcast Alert Notifications**: Post announcement banners to all logged-in users.
- **System Health Diagnostics**: Real-time progress bars tracking RAM/CPU load, database pings, and node latencies.
- **CSV & Text Exporters**: Generate administrative audits as downloadable sheets or logs.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | React (Vite) | Single Page Application framework |
| **Styling** | Vanilla CSS + Tailwind | Premium responsive layout with Ashoka blue / saffron themes |
| **Charts** | Chart.js (react-chartjs-2) | Interactive charts for grievances and statistics |
| **Maps** | Leaflet (react-leaflet) | OpenStreetMap geocoder with draggable landmark markers |
| **Backend** | Node.js (Express) | Modular REST API service |
| **Database** | MongoDB (Mongoose) | Schema-modeled data storage |
| **Auth** | Firebase Authentication | Google popup & email credentials with local fallback modes |
| **AI Engine** | Google Gemini (SDK) | Natural language processing, classification, and summarization |

---

## 🧠 AI Workflow & Prompt Engineering

### Recommendation Workflow
```
[Citizen Profile Data] -> [Formatted Prompt Context] -> [Gemini API] -> [JSON Schema Validation] -> [Recommended Scheme Cards]
```

### Prompt Engineering Strategy
We use system-level instruction formatting to guide the Gemini model:
1. **Persona**: You are the *Smart Bharat AI*, an official Indian Government digital assistant.
2. **Clarity**: Always respond in simple, citizen-friendly language.
3. **Safety**: Never hallucinate government link domains or facts. If uncertain, recommend general official portals (`india.gov.in`, `uidai.gov.in`).
4. **Consistency**: Structure policy recommendations into predictable subsets (Eligibility, Benefits, Required Documents, Processing Time, Official Links).

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js**: v18+
- **MongoDB**: Active connection URI

### Backend Setup
1. Navigate to `/backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/smart-bharat-ai
   GEMINI_API_KEY=your_gemini_api_key_here
   # Optional Firebase Admin SDK configurations
   # FIREBASE_SERVICE_ACCOUNT_KEY=...
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to `/frontend`:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Vite dev server:
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:5173`.

---

## 🚀 Deployment Instructions

### Frontend (Vercel)
The directory is configured with `vercel.json` to handle client-side routing.
1. Build production assets:
   ```bash
   npm run build
   ```
2. Deploy to Vercel via CLI or Vercel Dashboard, pointing to the `/frontend` subdirectory.

### Backend (Render)
1. Add environment variables: `PORT`, `MONGODB_URI`, `GEMINI_API_KEY`.
2. Configure start command as `npm start` and run node server.js.
