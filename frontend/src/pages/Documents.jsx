import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiDocumentText, HiSearch, HiExternalLink,
  HiChevronRight, HiLightBulb, HiCheckCircle, HiXCircle,
  HiClipboardList, HiOutlineCash, HiClock, HiOfficeBuilding, HiExclamationCircle
} from 'react-icons/hi';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';

const GUIDES = [
  {
    id: 1, emoji: '🛂', title: 'Passport', category: 'Travel',
    documents: ['Aadhaar Card / Voter ID / Utility Bill (Address Proof)', 'School Leaving / Matriculation / Birth Certificate (DOB Proof)', 'Non-ECR Category proof (if applicable)'],
    fee: '₹1,500 (Normal 36 pages) / ₹3,500 (Tatkaal)',
    time: '30-45 working days (Normal) / 3-7 days (Tatkaal)',
    process: 'Register on the Passport Seva Portal, pay the fee online, schedule an appointment, and visit the Passport Seva Kendra (PSK) for document submission and biometrics. Police verification follows.',
    office: 'Passport Seva Kendra (PSK) / Post Office Passport Seva Kendra (POPSK)',
    mistakes: ['Mismatched spellings between Aadhaar and School certificates.', 'Providing address proof issued in another person\'s name without an NOC.'],
    tips: ['Keep original documents ready with self-attested photocopies.', 'Ensure your mobile number linked with Aadhaar is active for verification.'],
    link: 'passportindia.gov.in'
  },
  {
    id: 2, emoji: '💼', title: 'PAN Card', category: 'Taxation',
    documents: ['Aadhaar Card (serves as identity, address, and DOB proof)', 'Passport Size Photograph (for physical card application)'],
    fee: '₹107 (Physical card within India) / Free (Instant e-PAN)',
    time: 'Instant (e-PAN) / 10-15 working days (Physical Card)',
    process: 'Apply online on NSDL/UTIITSL website. Authorize via Aadhaar e-KYC (OTP) for instant e-PAN, or post physically signed documents for physical card.',
    office: 'Income Tax Department (via NSDL / UTIITSL Portal)',
    mistakes: ['Biometric mismatch in Aadhaar preventing instant e-KYC.', 'Incorrect address/pincode leading to delivery returns.'],
    tips: ['Use the instant e-PAN route via Aadhaar OTP if your name and DOB details are fully correct on Aadhaar.'],
    link: 'onlineservices.tin.egov-nsdl.com'
  },
  {
    id: 3, emoji: '🚗', title: 'Driving Licence', category: 'Transport',
    documents: ['Aadhaar Card (Address & Age Proof)', 'Learner\'s Licence (mandatory)', 'Medical Certificate Form 1A (for commercial class vehicles)'],
    fee: '₹200 (Learner) / ₹700–₹1,200 (Permanent License test & card)',
    time: '30 days after Learner Licence issuance (validity up to 6 months)',
    process: 'Apply for Learner Licence online (Parivahan) and pass online slot exam. After 30 days, schedule permanent slot test, drive the vehicle at the RTO track before the Inspector.',
    office: 'Regional Transport Office (RTO) / Parivahan Sewa Portal',
    mistakes: ['Not scheduling permanent license test within 6 months of learner issuance.', 'Mismatched vehicle class selection.'],
    tips: ['Practice reversing and the "8" track beforehand.', 'Ensure the test vehicle has a valid PUC and insurance during the RTO test.'],
    link: 'parivahan.gov.in'
  },
  {
    id: 4, emoji: '🆔', title: 'Aadhaar', category: 'Identity',
    documents: ['Proof of Identity (Passport, Voter ID, PAN)', 'Proof of Address (Utility bill, bank passbook, rent deed)', 'Proof of Date of Birth (Birth certificate, mark sheet)'],
    fee: 'Free (First time / Enrolment) / ₹50 (Demographic updates) / ₹100 (Biometric updates)',
    time: '15-90 working days for verification and delivery',
    process: 'Locate an Aadhaar Enrolment Centre. Fill the application form, submit documents, provide fingerprints, iris scan, and webcam photo. Keep the acknowledgement slip.',
    office: 'Aadhaar Seva Kendra (ASK) / Authorized Banks/Post Offices',
    mistakes: ['Submitting blurry, unreadable photocopies of bills.', 'Outdated address proofs that are more than 3 months old.'],
    tips: ['You can track your enrolment status online using your 14-digit EID printed on the acknowledgement receipt.'],
    link: 'uidai.gov.in'
  },
  {
    id: 5, emoji: '🧾', title: 'GST', category: 'Business',
    documents: ['PAN Card of Business/Proprietor', 'Aadhaar Card', 'Proof of Business Address (Utility bill/Rent deed + NOC)', 'Bank Statement / Cancelled Cheque'],
    fee: 'Free (No registration fee)',
    time: '3-7 working days',
    process: 'Register on the GST Portal under GST REG-01. Upload business entity proof, promoter details, and business location proofs. Await approval and GSTIN generation.',
    office: 'Goods and Services Tax Network (GSTN)',
    mistakes: ['Uploading illegible rent agreements.', 'Mismatch between commercial electricity bill name and property tax records.'],
    tips: ['An active Aadhaar authentication of the proprietor speed up registration approvals.'],
    link: 'gst.gov.in'
  },
  {
    id: 6, emoji: '👶', title: 'Birth Certificate', category: 'Civic Records',
    documents: ['Hospital discharge summary/birth record', 'Aadhaar Cards of Parents', 'Proof of address of birth location'],
    fee: 'Free (if registered within 21 days) / ₹2–₹50 (late fees apply)',
    time: '7-15 working days',
    process: 'Apply at the municipal corporation or Panchayat office where the child was born. If registered by hospital, visit municipal ward office to collect copy.',
    office: 'Municipal Corporation / Gram Panchayat / Civil Registration System',
    mistakes: ['Delaying registration past 21 days (requires SDM verification).', 'Wrong spelling of parents\' names.'],
    tips: ['Register within 21 days of birth for instant and hassle-free certificate collection.'],
    link: 'crsorgi.gov.in'
  },
  {
    id: 7, emoji: '🪦', title: 'Death Certificate', category: 'Civic Records',
    documents: ['Hospital medical death report', 'Aadhaar Card of deceased', 'ID Proof of the applicant'],
    fee: 'Free (within 21 days) / Nominal late fee thereafter',
    time: '5-10 working days',
    process: 'Report death to the local registrar (Panchayat/Municipal ward). Submit cremation/burial ground slip along with medical reports.',
    office: 'Municipal Corporation / Local Gram Panchayat Registrar',
    mistakes: ['Not matching names with the deceased\'s Aadhaar details.'],
    tips: ['Keep multiple attested copies as they are mandatory for banking and inheritance claims.'],
    link: 'crsorgi.gov.in'
  },
  {
    id: 8, emoji: '🌾', title: 'Income Certificate', category: 'Revenue',
    documents: ['Aadhaar Card', 'Ration Card / Voter ID', 'Salary Slip / Form 16 / ITR / Self-declaration Affidavit'],
    fee: '₹10–₹50 (varies by state portal)',
    time: '7-15 working days',
    process: 'Submit application online via state e-District portal or local revenue office. Revenue inspector conducts location verification before Tehsildar approval.',
    office: 'Tehsildar Office / Revenue Department (e-District)',
    mistakes: ['Incorrect/inflated income self-declaration.', 'Uploading incomplete bank transaction records.'],
    tips: ['Include the latest ITR or salary slip to expedite the Tehsildar approval process.'],
    link: 'edistrict.delhigovt.nic.in'
  },
  {
    id: 9, emoji: '🛡️', title: 'Caste Certificate', category: 'Revenue',
    documents: ['Aadhaar Card', 'Proof of Caste (relative\'s caste certificate/land records)', 'Residence Proof', 'Affidavit declaring caste lineage'],
    fee: '₹10–₹30 (nominal e-District processing fee)',
    time: '15-30 working days',
    process: 'Submit caste lineage proof on state e-District portal. Local Patwari/Revenue Inspector conducts field inquiry to verify ancestry records.',
    office: 'Sub-Divisional Magistrate (SDM) / Tehsildar Office',
    mistakes: ['Inability to produce blood-relative caste proof certificates.', 'Mismatched spelling of surname.'],
    tips: ['Use an older land record document or school certificate of an uncle/father displaying the caste.'],
    link: 'edistrict.delhigovt.nic.in'
  },
  {
    id: 10, emoji: '💍', title: 'Marriage Certificate', category: 'Civic Records',
    documents: ['Marriage Invitation Card / Temple Certificate', 'Proof of Age of Bride (18+) & Groom (21+)', 'Joint wedding photo', 'Aadhaar Cards of Couple', 'Witness ID proofs (3 witnesses required)'],
    fee: '₹100 (Hindu Marriage Act) / ₹150 (Special Marriage Act)',
    time: '15 days (Hindu Act) / 30 days (Special Marriage Act)',
    process: 'Apply online or at Registrar office. Schedule slot. Bride, groom, and 3 witnesses must appear physically before Sub-Registrar to verify signatures.',
    office: 'Sub-Registrar Office / Marriage Registrar',
    mistakes: ['Witnesses arriving without physical original ID cards.', 'Applying without proof of solemnization.'],
    tips: ['Register within 30 days of solemnization to avoid penalty/late fees.'],
    link: 'edistrict.delhigovt.nic.in'
  },
  {
    id: 11, emoji: '🏡', title: 'Property Registration', category: 'Revenue',
    documents: ['Property Sale Deed', 'No Objection Certificate (NOC)', 'Property Card / Tax Receipts', 'Identity & Address Proof of buyer and seller', 'Witness IDs'],
    fee: 'Stamp Duty (3%-8% of property value) + Registration fee (1%)',
    time: '2-5 working days',
    process: 'Calculate and pay Stamp Duty online. Prepare sale deed. Book Sub-Registrar slot. Buyer, seller, and witnesses must present signatures and biometrics at SDM office.',
    office: 'Sub-Registrar / Department of Stamps & Registration',
    mistakes: ['Under-valuing property value below government circle rates.', 'Witnesses not carrying original identity proofs.'],
    tips: ['Verify circle rates online before stamp paper purchases.'],
    link: 'registration.maharashtra.gov.in'
  },
  {
    id: 12, emoji: '🚀', title: 'Startup Registration', category: 'Business',
    documents: ['Certificate of Incorporation/Partnership Deed', 'Write-up explaining innovative nature of business', 'PAN Card of Company', 'Pitch deck / Website link'],
    fee: 'Free (for DPIIT Recognition registration)',
    time: '5-10 working days',
    process: 'Incorporate business first. Register on Startup India portal. Apply for DPIIT recognition by uploading pitch deck and explaining innovation.',
    office: 'DPIIT / Ministry of Commerce and Industry',
    mistakes: ['Not explaining the "innovative" element of the business.', 'Incorrect company registration number.'],
    tips: ['Highlight job creation potential and scaling benefits in your application.'],
    link: 'startupindia.gov.in'
  }
];

const CATEGORIES = ['All', 'Travel', 'Taxation', 'Transport', 'Identity', 'Business', 'Civic Records', 'Revenue'];

const GuideCard = ({ guide, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="h-full transition-all duration-300 hover:shadow-lg">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">{guide.emoji}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-base leading-tight">
                  {guide.title}
                </h3>
                <Badge variant="navy" size="xs">{guide.category}</Badge>
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1"><HiClock className="w-3.5 h-3.5 text-saffron-500" /> {guide.time}</span>
                <span className="flex items-center gap-1"><HiOutlineCash className="w-3.5 h-3.5 text-saffron-500" /> {guide.fee}</span>
              </div>
            </div>
            <HiChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </div>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-4 pt-4 border-t border-gray-100 dark:border-dark-border"
            >
              <div className="space-y-5">
                {/* Office */}
                <div className="flex gap-2 items-start text-xs text-gray-600 dark:text-gray-400">
                  <HiOfficeBuilding className="w-4 h-4 text-saffron-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300 block">Department Office</span>
                    {guide.office}
                  </div>
                </div>

                {/* Documents list */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <HiClipboardList className="w-4 h-4 text-saffron-500" />
                    Required Documents Checklists
                  </h4>
                  <ul className="space-y-1.5">
                    {guide.documents.map((doc, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                        <HiCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Process */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Application Process</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-dark-bg p-3 rounded-xl border border-gray-100 dark:border-dark-border">
                    {guide.process}
                  </p>
                </div>

                {/* Common Mistakes */}
                <div>
                  <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <HiExclamationCircle className="w-4 h-4 text-red-500" /> Common Mistakes
                  </h4>
                  <ul className="space-y-1 pl-1">
                    {guide.mistakes.map((m, i) => (
                      <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                        <HiXCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tips */}
                <div>
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <HiLightBulb className="w-4 h-4 text-amber-500" /> Expert Tips
                  </h4>
                  <ul className="space-y-1 pl-1">
                    {guide.tips.map((t, i) => (
                      <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                        <span className="text-amber-500">•</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`https://${guide.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-white font-bold rounded-xl text-xs transition-colors shadow-neon-saffron"
                  >
                    <HiExternalLink className="w-4 h-4" />
                    Apply at {guide.link}
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

const Documents = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = GUIDES.filter(g => {
    const matchSearch = !search || g.title.toLowerCase().includes(search.toLowerCase()) || g.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || g.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <PageHeader
          title="Citizen Document Guide"
          subtitle="Know exactly what documents, fees, processing time, and steps you need for government services"
          icon={HiDocumentText}
          badge="National Standard Guides"
          gradient
        />

        {/* Search */}
        <div className="mb-6">
          <Input
            icon={<HiSearch className="w-4 h-4" />}
            placeholder="Search documents by service name (e.g. Passport, Caste Certificate)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            clearable
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                category === cat
                  ? 'bg-saffron-500 text-white shadow-neon-saffron'
                  : 'bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 hover:border-saffron-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* AI tip */}
        <Card className="mb-8 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/30">
          <div className="flex items-start gap-3">
            <HiLightBulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">Pro Tip</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                Use our <strong>AI Chat</strong> to get a customized document checklist for your specific situation. Location, lineage certificates, and category status may affect municipal requirements.
              </p>
            </div>
          </div>
        </Card>

        {/* Guides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((guide, i) => (
            <GuideCard key={guide.id} guide={guide} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Documents;
