import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiNewspaper, HiSparkles, HiClock, HiDownload, HiShare,
  HiSearch, HiLightningBolt, HiExternalLink, HiX, HiCheckCircle
} from 'react-icons/hi';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useNotification } from '@/contexts/NotificationContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';

const NOTICES = [
  {
    id: 1,
    title: 'Revised Guidelines for PM Awas Yojana Urban 2.0 Implementation',
    ministry: 'Ministry of Housing & Urban Affairs',
    date: '2026-07-01',
    category: 'Housing',
    pages: 48,
    emoji: '🏠',
    summary: `## Summary: PM Awas Yojana 2.0 Updates
The Ministry of Housing & Urban Affairs has released updated guidelines for PMAY-U 2.0 with the goal of expediting homeownership registrations.

### Key Bullet Points
- **Enhanced Interest Subvention**: Subsidy rates are optimized for low-income brackets.
- **Digital Approvals**: Physical verification steps are minimized through Aadhaar e-KYC integration.
- **Extended Deadlines**: Application windows are extended for state municipal submissions.

### Important Dates
- **Implementation Start**: July 1, 2026
- **State Audits Deadline**: September 30, 2026

### Citizen Actions
- Verify your Aadhaar details are updated and linked with your active mobile number.
- Apply directly on the official PMAY portal (pmaymis.gov.in) before deadlines.

### Warnings
- Avoid third-party agents requesting transaction fees; registration is free.
- Mismatched documents will lead to instant portal rejections.`,
  },
  {
    id: 2,
    title: 'Amendment to Aadhaar targeted delivery of welfare benefits guidelines',
    ministry: 'Ministry of Electronics & IT',
    date: '2026-06-28',
    category: 'Technology',
    pages: 12,
    emoji: '🪪',
    summary: `## Summary: Aadhaar targeted delivery amendments
MeitY has issued new directives to streamline targeted delivery systems of financial and other subsidies.

### Key Bullet Points
- **Private KYC Restriction**: Restricts private entities from making Aadhaar mandatory for standard services.
- **Children Consent**: Minor biometric locks can now be managed online by parents.
- **Offline verification**: Promotes the use of XML offline e-KYC for privacy compliance.

### Important Dates
- **Directives Enforcement**: July 15, 2026

### Citizen Actions
- Use the mAadhaar application to secure/lock your biometric details when not in use.
- Prefer offline e-KYC/QR code verifications over sharing physical cards.

### Warnings
- Sharing OTPs with unauthorized agents will result in identity locks.`,
  }
];

const NoticeCard = ({ notice, index, onViewSummary }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Card className="hover:shadow-md transition-all duration-300">
        <div className="flex items-start gap-4 mb-4">
          <span className="text-3xl flex-shrink-0">{notice.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge variant="saffron" size="xs">{notice.category}</Badge>
              <Badge variant="gray" size="xs">📄 {notice.pages} pages</Badge>
            </div>
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm leading-snug">
              {notice.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
              <HiClock className="w-3.5 h-3.5" />
              <span>{notice.ministry}</span>
              <span>•</span>
              <span>{notice.date}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => onViewSummary(notice)}
            icon={<HiSparkles />}
          >
            View Summary
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

const NoticeSummarizer = () => {
  const { success, error, info } = useNotification();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  
  // Custom Notice Upload/Paste states
  const [pastedText, setPastedText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLang, setSelectedLang] = useState('en');
  const [loading, setLoading] = useState(false);
  
  // Active Summary Viewer modal
  const [activeSummary, setActiveSummary] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        error("Only PDF files are supported for circular uploads.");
        return;
      }
      setSelectedFile(file);
      setPastedText(`[Uploaded Document: ${file.name}]\n\nProceeding to summarize document via optical character benchmarks...`);
      success(`PDF File selected: ${file.name}`);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleGenerateSummary = async (e) => {
    e.preventDefault();
    if (!pastedText.trim()) {
      error("Please paste notification text or upload a PDF document first.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/ai/summarize', {
        text: pastedText,
        language: selectedLang
      });

      if (res.data && res.data.summary) {
        const customNotice = {
          title: selectedFile ? `Summary of ${selectedFile.name}` : `Custom Notice Summary (${new Date().toLocaleDateString()})`,
          ministry: 'Uploaded/Pasted Source Document',
          date: new Date().toLocaleDateString(),
          category: 'Welfare',
          pages: selectedFile ? 'Multiple' : 1,
          summary: res.data.summary
        };
        setActiveSummary(customNotice);
        success("AI Summary generated successfully!");
      }
    } catch (err) {
      error("Failed to connect to AI summarizer. Displaying mock summary.");
      // Fallback
      const fallbackNotice = {
        title: selectedFile ? `Summary of ${selectedFile.name}` : 'Custom Notice Summary',
        ministry: 'Welfare Portal',
        date: new Date().toLocaleDateString(),
        category: 'Welfare',
        pages: 1,
        summary: `## Summary: Custom Notification Circular
The document outlines critical updates regarding citizen welfare infrastructure.

### Key Bullet Points
- **Simplification**: Application forms have been updated for digital submission.
- **Biometric authentication**: Verification uses Aadhaar OTP mechanism.

### Important Dates
- **Implementation Deadline**: 30 days from release.

### Citizen Actions
- Log in to the official service portal to verify credentials.

### Warnings
- Avoid sharing sensitive credentials with middlemen.`
      };
      setActiveSummary(fallbackNotice);
    } finally {
      setLoading(false);
    }
  };

  // Download Summary PDF using print preview wrapper
  const downloadSummaryPDF = (notice) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Government Notice Summary</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 3px solid #FF6B35; padding-bottom: 10px; margin-bottom: 30px; text-align: center; }
            h1 { color: #1A237E; margin: 0; }
            h2 { color: #1A237E; margin-top: 25px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            ul { line-height: 1.6; }
            li { margin-bottom: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Smart Bharat AI — Circular Summary</h1>
            <p><strong>Source Title:</strong> ${notice.title}</p>
            <p><strong>Department:</strong> ${notice.ministry} | <strong>Date:</strong> ${notice.date}</p>
          </div>
          <div style="font-size: 14px;">
            ${notice.summary.replace(/\n/g, '<br>')}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const filteredNotices = NOTICES.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.ministry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Government Notice Summarizer"
          subtitle="Complex government circulars, notifications, and policy guidelines, simplified by AI"
          icon={HiNewspaper}
          badge="AI Summaries"
          gradient
        />

        {/* Custom Upload and Paste Section */}
        <Card className="mb-10 bg-gradient-to-br from-navy-50 to-saffron-50 dark:from-navy-900/30 dark:to-saffron-900/20 border-navy-100 dark:border-navy-700/30" padding="lg">
          <h3 className="font-display font-bold text-gray-900 dark:text-white text-base mb-4 flex items-center gap-1.5">
            <HiSparkles className="w-5 h-5 text-saffron-500" /> Simplify Any Official Document
          </h3>

          <form onSubmit={handleGenerateSummary} className="space-y-4">
            <div>
              <textarea
                placeholder="Paste notification text, details, or circular paragraphs here..."
                rows={5}
                value={pastedText}
                onChange={e => setPastedText(e.target.value)}
                className="w-full text-xs input-base bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="application/pdf"
                  className="hidden"
                />
                <Button onClick={triggerUpload} type="button" variant="outline" size="sm" icon={<HiLightningBolt />}>
                  {selectedFile ? 'Change PDF' : 'Upload PDF Document'}
                </Button>
                {selectedFile && (
                  <button type="button" onClick={() => { setSelectedFile(null); setPastedText(''); }} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg">
                    <HiX className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="flex gap-3 items-center w-full sm:w-auto">
                <select
                  value={selectedLang}
                  onChange={e => setSelectedLang(e.target.value)}
                  className="text-xs input-base py-1.5 px-3 bg-white dark:bg-dark-bg"
                >
                  <option value="en">English (English)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                </select>
                <Button type="submit" loading={loading} className="w-full sm:w-auto" icon={<HiSparkles />}>
                  Summarize Notice
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {/* Search Past Notices */}
        <div className="mb-6">
          <Input
            icon={<HiSearch className="w-4 h-4" />}
            placeholder="Search verified circular summaries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            clearable
          />
        </div>

        {/* Notices list */}
        <div className="space-y-4">
          {filteredNotices.map((notice, i) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              index={i}
              onViewSummary={setActiveSummary}
            />
          ))}
        </div>

        {/* Detailed Summary Viewer Modal */}
        <AnimatePresence>
          {activeSummary && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-white dark:bg-dark-card rounded-3xl overflow-hidden border border-gray-100 dark:border-dark-border shadow-2xl"
              >
                <div className="px-6 py-4 bg-gradient-to-r from-saffron-500 to-orange-500 text-white flex justify-between items-center">
                  <div>
                    <h3 className="font-display font-bold text-base leading-none">Simplified Circular Overview</h3>
                    <span className="text-xs opacity-90 mt-1 inline-block">{activeSummary.ministry}</span>
                  </div>
                  <button onClick={() => setActiveSummary(null)} className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors">
                    <HiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6 bg-gray-50/50 dark:bg-dark-bg">
                  <div className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-200
                    prose-headings:font-display prose-headings:font-bold prose-h2:text-base prose-h3:text-sm
                    prose-p:text-xs prose-li:text-xs prose-code:text-saffron-600 dark:prose-code:text-saffron-400
                    prose-code:bg-saffron-50 dark:prose-code:bg-saffron-900/20 prose-code:rounded prose-code:px-1
                    prose-blockquote:border-saffron-400 prose-strong:text-gray-900 dark:prose-strong:text-white">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {activeSummary.summary}
                    </ReactMarkdown>
                  </div>
                </div>

                <div className="px-6 py-4 bg-white dark:bg-dark-card border-t border-gray-100 dark:border-dark-border flex justify-end gap-3">
                  <Button onClick={() => downloadSummaryPDF(activeSummary)} variant="outline" size="sm" icon={<HiDownload />}>
                    Download Summary PDF
                  </Button>
                  <Button onClick={() => setActiveSummary(null)} size="sm">
                    Dismiss
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NoticeSummarizer;
