import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { HiChevronDown } from 'react-icons/hi';

const FAQS = [
  {
    q: 'What is Smart Bharat AI?',
    a: 'Smart Bharat AI is India\'s AI-powered civic companion that helps citizens access government schemes, file complaints, find nearby government offices, summarize government notices, and get answers to civic questions — all in one platform.',
  },
  {
    q: 'Is Smart Bharat AI free to use?',
    a: 'Yes! Smart Bharat AI is completely free for all Indian citizens. Our mission is to democratize access to government services through technology.',
  },
  {
    q: 'Which languages does the AI support?',
    a: 'Our AI supports 22+ Indian languages including Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Odia, and more. You can chat in your native language.',
  },
  {
    q: 'How do I find government schemes I\'m eligible for?',
    a: 'Use our Scheme Finder — fill in your profile details (age, income, state, category, etc.) and our AI will match you with relevant central and state government schemes instantly.',
  },
  {
    q: 'How does complaint filing work?',
    a: 'You can file a complaint in minutes — describe your issue, attach photos/documents, select the concerned department, and submit. We forward it to the relevant authority and track it for you.',
  },
  {
    q: 'Is my data safe?',
    a: 'Absolutely. We follow government-grade data security standards. Your personal information is encrypted, never sold, and used only to provide you with personalized civic assistance.',
  },
  {
    q: 'Can I use this without an account?',
    a: 'Yes, many features like Scheme Finder, Notice Summarizer, and Nearby Offices work without login. Creating an account unlocks AI Chat, complaint filing, and personalized dashboards.',
  },
  {
    q: 'How accurate is the AI information?',
    a: 'Our AI is trained on official government data and cross-references information with verified sources. However, always verify critical information from official government portals for final decisions.',
  },
];

const FAQItem = ({ item, index }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.05 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group ${
          open
            ? 'bg-saffron-50 dark:bg-saffron-500/10 border-saffron-200 dark:border-saffron-500/30'
            : 'bg-white dark:bg-dark-card border-gray-100 dark:border-dark-border hover:border-saffron-200 dark:hover:border-saffron-500/30'
        }`}
        aria-expanded={open}
      >
        <div className="flex items-center justify-between gap-4">
          <span className={`text-sm sm:text-base font-semibold transition-colors ${
            open ? 'text-saffron-600 dark:text-saffron-400' : 'text-gray-900 dark:text-white'
          }`}>
            {item.q}
          </span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
              open
                ? 'bg-saffron-500 text-white'
                : 'bg-gray-100 dark:bg-dark-card text-gray-500 group-hover:bg-saffron-100 dark:group-hover:bg-saffron-500/10'
            }`}
          >
            <HiChevronDown className="w-4 h-4" />
          </motion.div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {item.a}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
};

const FAQ = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="section-padding bg-gray-50 dark:bg-dark-bg">
      <div className="container-max">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Left */}
          <div className="lg:sticky lg:top-28">
            <motion.div
              ref={ref}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saffron-50 dark:bg-saffron-500/10 border border-saffron-200 dark:border-saffron-500/30 text-saffron-700 dark:text-saffron-300 text-sm font-semibold mb-4">
                ❓ FAQ
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                Frequently{' '}
                <span className="text-gradient-saffron">Asked</span>{' '}
                Questions
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Can't find what you're looking for? Reach out to our support team.
              </p>

              {/* Contact CTA */}
              <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border">
                <p className="font-semibold text-gray-900 dark:text-white mb-1">Still have questions?</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Our team is here to help you 24/7.</p>
                <a href="mailto:support@smartbharat.ai" className="btn-primary text-sm py-2 px-4">
                  Contact Support →
                </a>
              </div>
            </motion.div>
          </div>

          {/* FAQ list */}
          <div className="lg:col-span-2 space-y-3">
            {FAQS.map((item, i) => (
              <FAQItem key={item.q} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
