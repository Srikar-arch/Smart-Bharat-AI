import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiSearch, HiFilter, HiExternalLink, HiBookmark, HiShare,
  HiArrowRight, HiSparkles, HiDocumentText, HiCheck, HiX, HiCheckCircle
} from 'react-icons/hi';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useNotification } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import Skeleton from '@/components/ui/Skeleton';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const PRESET_SCHEMES = [
  {
    name: 'PM Awas Yojana (Urban)',
    description: 'Affordable housing scheme offering interest subventions and financial assistance for homeownership.',
    benefits: 'Credit-linked interest subsidy up to ₹2.67 Lakh for first-time home buyers.',
    eligibility: 'Families with annual income up to ₹18 Lakh who do not own a pucca house.',
    documentsRequired: ['Aadhaar Card', 'PAN Card', 'Income Certificate', 'Affidavit of no pucca house'],
    howToApply: 'Register online at pmaymis.gov.in or visit a designated public sector bank.',
    applicationLink: 'https://pmaymis.gov.in',
    deadline: 'Ongoing',
    emoji: '🏠',
  },
  {
    name: 'PM-KISAN Samman Nidhi',
    description: 'Direct cash transfer program providing financial assistance to all landholder farmer families.',
    benefits: '₹6,000 per year paid in three equal installments of ₹2,000 directly to bank accounts.',
    eligibility: 'All landholding farmer families across India (subject to certain exclusion criteria).',
    documentsRequired: ['Aadhaar Card', 'Land ownership records/Khatauni', 'Bank Account details'],
    howToApply: 'Self-register on pmkisan.gov.in or apply at local CSC nodes.',
    applicationLink: 'https://pmkisan.gov.in',
    deadline: 'Ongoing',
    emoji: '🌾',
  },
  {
    name: 'Ayushman Bharat PMJAY',
    description: 'Flagship health insurance scheme providing free secondary and tertiary care hospitalization.',
    benefits: 'Cashless medical insurance cover up to ₹5 Lakh per family per year.',
    eligibility: 'Identified households under the Socio-Economic Caste Census (SECC 2011).',
    documentsRequired: ['Aadhaar Card', 'Ration Card', 'PMJAY Enrolment Slip'],
    howToApply: 'Verify your name on the portal, then visit an empanelled hospital or CSC to make your card.',
    applicationLink: 'https://pmjay.gov.in',
    deadline: 'Ongoing',
    emoji: '🏥',
  },
];

const RecommendationCard = ({ scheme, index, onBookmark, isBookmarked }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08 }}
    >
      <Card className="h-full border-l-4 border-l-saffron-500 hover:shadow-lg transition-all duration-300">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏛️</span>
            <div>
              <h3 className="font-display font-bold text-gray-900 dark:text-white text-base leading-snug">
                {scheme.name}
              </h3>
              <span className="text-xs font-semibold text-saffron-500">95% Match</span>
            </div>
          </div>
          <button
            onClick={() => onBookmark(scheme.name)}
            className={`p-1.5 rounded-lg transition-colors ${
              isBookmarked ? 'text-saffron-500 bg-saffron-50 dark:bg-saffron-500/10' : 'text-gray-400 hover:text-saffron-500'
            }`}
          >
            <HiBookmark className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
          {scheme.description}
        </p>

        <div className="space-y-2 text-xs mb-4">
          <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-dark-border">
            <span className="text-gray-500 dark:text-gray-400">Core Benefits</span>
            <span className="font-semibold text-green-600 dark:text-green-400 text-right max-w-[65%]">{scheme.benefits}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-50 dark:border-dark-border">
            <span className="text-gray-500 dark:text-gray-400">Eligibility</span>
            <span className="font-medium text-gray-700 dark:text-gray-300 text-right max-w-[65%]">{scheme.eligibility}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-gray-500 dark:text-gray-400">Deadline</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{scheme.deadline}</span>
          </div>
        </div>

        {/* Expanded Info */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-gray-100 dark:border-dark-border pt-4 mb-4 space-y-4"
            >
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Required Documents</h4>
                <div className="flex flex-wrap gap-1.5">
                  {scheme.documentsRequired?.map(doc => (
                    <Badge key={doc} variant="saffron" size="xs">📄 {doc}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">How to Apply</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-dark-bg p-3 rounded-xl border border-gray-100 dark:border-dark-border">
                  {scheme.howToApply}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2">
          <Button onClick={() => setExpanded(!expanded)} variant="outline" size="sm" className="flex-1">
            {expanded ? 'Hide Details' : 'View Requirements'}
          </Button>
          <a
            href={scheme.applicationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-white font-bold rounded-xl text-xs transition-colors shadow-neon-saffron"
          >
            Apply Now <HiExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </Card>
    </motion.div>
  );
};

const Schemes = () => {
  const { user } = useAuth();
  const { success, info, error } = useNotification();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);

  // Recommendations state
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  // Form State
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [income, setIncome] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [occupation, setOccupation] = useState('Salaried');
  const [education, setEducation] = useState('Graduate');

  // Checkboxes
  const [farmer, setFarmer] = useState(false);
  const [student, setStudent] = useState(false);
  const [businessOwner, setBusinessOwner] = useState(false);
  const [disability, setDisability] = useState(false);
  const [minority, setMinority] = useState(false);
  const [seniorCitizen, setSeniorCitizen] = useState(false);
  const [women, setWomen] = useState(false);

  // Load existing recommendations and bookmarks on mount
  useEffect(() => {
    const fetchSavedData = async () => {
      try {
        const res = await axios.get('/api/schemes/recommend');
        if (res.data && res.data.recommendations) {
          setRecommendations(res.data.recommendations);
        }
      } catch (err) {
        console.warn("Failed to fetch backend recommendations. Using offline presets.");
      }

      if (user) {
        setBookmarks(user.bookmarks || []);
      }
    };
    fetchSavedData();
  }, [user]);

  const handleBookmark = async (schemeName) => {
    const isBookmarked = bookmarks.includes(schemeName);
    try {
      if (isBookmarked) {
        await axios.delete('/api/users/bookmarks', { data: { item: schemeName } });
        setBookmarks(prev => prev.filter(b => b !== schemeName));
        success("Scheme removed from bookmarks!");
      } else {
        await axios.post('/api/users/bookmarks', { item: schemeName });
        setBookmarks(prev => [...prev, schemeName]);
        success("Scheme bookmarked successfully!");
      }
    } catch (err) {
      if (error) {
        error("Failed to update bookmark.");
      } else {
        alert("Failed to update bookmark.");
      }
    }
  };

  const handleWizardSubmit = async (e) => {
    e.preventDefault();
    setShowWizard(false);
    setLoading(true);

    try {
      const payload = {
        age: parseInt(age) || 25,
        gender,
        income: parseFloat(income) || 300000,
        occupation,
        education,
        state,
        district,
        farmer,
        student,
        businessOwner,
        disability,
        minority,
        seniorCitizen,
        women
      };

      const res = await axios.post('/api/schemes/recommend', payload);
      if (res.data && res.data.schemes) {
        setRecommendations(res.data.schemes);
        success("Personalized scheme list generated!");
      }
    } catch (err) {
      if (error) {
        error("Failed to find personalized schemes. Please try again.");
      } else {
        alert("Failed to find personalized schemes. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Housing', 'Agriculture', 'Health', 'Education', 'Business'];

  const filteredPreset = PRESET_SCHEMES.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Government Scheme Finder"
          subtitle="Discover central and state government schemes tailored to your citizen profile"
          badge="AI Matching Grid"
          icon={HiDocumentText}
          gradient
        />

        {/* AI Recommendation Panel Trigger */}
        <Card className="mb-10 bg-gradient-to-br from-navy-50 to-saffron-50 dark:from-navy-900/30 dark:to-saffron-900/20 border-navy-100 dark:border-navy-700/30">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-saffron-500/10 flex items-center justify-center text-3xl">
              🤖
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-1">
                Personalized Schemes Finder
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Answer a few quick questions about your demographic and family profile. Our matching engine will align your data with Central & State benefits.
              </p>
            </div>
            <Button onClick={() => { setWizardStep(0); setShowWizard(true); }} icon={<HiSparkles />} iconRight={<HiArrowRight />}>
              Start AI Finder
            </Button>
          </div>
        </Card>

        {loading && (
          <div className="mb-12">
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-base mb-4 flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-saffron-500 animate-ping" />
              Scanning Welfare Schemes Grid...
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Skeleton.Card />
              <Skeleton.Card />
              <Skeleton.Card />
            </div>
          </div>
        )}

        {recommendations.length > 0 && !loading && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white">
                  Your Personalized Scheme Recommendations
                </h2>
                <p className="text-xs text-gray-500 mt-1">Matched using official eligibility databases.</p>
              </div>
              <Badge variant="saffron" size="sm">Matched ({recommendations.length})</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((scheme, i) => (
                <RecommendationCard
                  key={scheme.name}
                  scheme={scheme}
                  index={i}
                  onBookmark={handleBookmark}
                  isBookmarked={bookmarks.includes(scheme.name)}
                />
              ))}
            </div>
          </div>
        )}

        {/* General Popular Schemes List */}
        <div>
          <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-6">
            Popular Schemes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPreset.map((scheme, i) => (
              <Card key={scheme.name} className="h-full flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{scheme.emoji || '🏛️'}</span>
                    <div>
                      <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm leading-tight">
                        {scheme.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">Central Government</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBookmark(scheme.name)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      bookmarks.includes(scheme.name) ? 'text-saffron-500 bg-saffron-50 dark:bg-saffron-500/10' : 'text-gray-400 hover:text-saffron-500'
                    }`}
                  >
                    <HiBookmark className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex-1 mb-4 leading-relaxed">
                  {scheme.description}
                </p>
                <div className="flex gap-2">
                  <a
                    href={scheme.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-saffron-500 hover:bg-saffron-600 text-white font-bold rounded-xl text-xs transition-colors shadow-neon-saffron"
                  >
                    Apply <HiExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Questionnaire Modal Wizard */}
        <AnimatePresence>
          {showWizard && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-white dark:bg-dark-card rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-dark-border"
              >
                <div className="px-6 py-4 bg-gradient-to-r from-saffron-500 to-orange-500 text-white flex justify-between items-center">
                  <h3 className="font-display font-bold text-base flex items-center gap-1.5">
                    <HiSparkles className="w-5 h-5" /> Schemes Questionnaire
                  </h3>
                  <button onClick={() => setShowWizard(false)} className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors">
                    <HiX className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleWizardSubmit} className="p-6 space-y-6">
                  {/* Step 1: Basic Details */}
                  {wizardStep === 0 && (
                    <div className="space-y-4">
                      <p className="text-xs text-gray-500">Step 1 of 3: General Demographic Details</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Age"
                          type="number"
                          placeholder="25"
                          value={age}
                          onChange={e => setAge(e.target.value)}
                          required
                        />
                        <Input.Select
                          label="Gender"
                          value={gender}
                          onChange={e => setGender(e.target.value)}
                          required
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </Input.Select>
                      </div>

                      <Input
                        label="Annual Household Income (₹)"
                        type="number"
                        placeholder="300000"
                        value={income}
                        onChange={e => setIncome(e.target.value)}
                        required
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <Input.Select
                          label="State"
                          value={state}
                          onChange={e => setState(e.target.value)}
                          required
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </Input.Select>
                        <Input
                          label="District"
                          placeholder="Pune"
                          value={district}
                          onChange={e => setDistrict(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Occupation and Education */}
                  {wizardStep === 1 && (
                    <div className="space-y-4">
                      <p className="text-xs text-gray-500">Step 2 of 3: Occupation & Qualifications</p>

                      <Input.Select
                        label="Primary Occupation"
                        value={occupation}
                        onChange={e => setOccupation(e.target.value)}
                        required
                      >
                        <option value="Salaried">Salaried Employee</option>
                        <option value="Farmer">Farmer / Agriculture Worker</option>
                        <option value="Business Owner">Business Owner / Entrepreneur</option>
                        <option value="Student">Student</option>
                        <option value="Unemployed">Unemployed</option>
                        <option value="Retired">Retired</option>
                      </Input.Select>

                      <Input.Select
                        label="Highest Education"
                        value={education}
                        onChange={e => setEducation(e.target.value)}
                        required
                      >
                        <option value="Below 10th">Below 10th Standard</option>
                        <option value="10th Pass">10th Standard Pass</option>
                        <option value="12th Pass">12th Standard Pass</option>
                        <option value="Graduate">Graduate (Degree)</option>
                        <option value="Post Graduate">Post Graduate</option>
                      </Input.Select>
                    </div>
                  )}

                  {/* Step 3: Specific tags */}
                  {wizardStep === 2 && (
                    <div className="space-y-4">
                      <p className="text-xs text-gray-500">Step 3 of 3: Custom Eligibility Flags</p>

                      <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                          <input type="checkbox" checked={farmer} onChange={e => setFarmer(e.target.checked)} className="rounded text-saffron-500" />
                          Are you a Farmer?
                        </label>
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                          <input type="checkbox" checked={student} onChange={e => setStudent(e.target.checked)} className="rounded text-saffron-500" />
                          Are you a Student?
                        </label>
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                          <input type="checkbox" checked={businessOwner} onChange={e => setBusinessOwner(e.target.checked)} className="rounded text-saffron-500" />
                          Business Owner?
                        </label>
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                          <input type="checkbox" checked={disability} onChange={e => setDisability(e.target.checked)} className="rounded text-saffron-500" />
                          Person with Disability?
                        </label>
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                          <input type="checkbox" checked={minority} onChange={e => setMinority(e.target.checked)} className="rounded text-saffron-500" />
                          Minority Community?
                        </label>
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                          <input type="checkbox" checked={seniorCitizen} onChange={e => setSeniorCitizen(e.target.checked)} className="rounded text-saffron-500" />
                          Senior Citizen?
                        </label>
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 col-span-2">
                          <input type="checkbox" checked={women} onChange={e => setWomen(e.target.checked)} className="rounded text-saffron-500" />
                          Eligible for Women welfare focus schemes?
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Navigation footer inside modal */}
                  <div className="flex justify-between border-t border-gray-100 dark:border-dark-border pt-4 mt-6">
                    {wizardStep > 0 ? (
                      <Button variant="outline" type="button" onClick={() => setWizardStep(s => s - 1)}>
                        Back
                      </Button>
                    ) : <div />}

                    {wizardStep < 2 ? (
                      <Button type="button" onClick={() => setWizardStep(s => s + 1)}>
                        Next
                      </Button>
                    ) : (
                      <Button type="submit" icon={<HiCheckCircle />}>
                        Find Schemes
                      </Button>
                    )}
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Schemes;
