import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import {
  HiSparkles, HiDocumentText, HiExclamationCircle,
  HiNewspaper, HiLocationMarker, HiArrowRight, HiClipboardList,
  HiChat
} from 'react-icons/hi';

const FEATURES = [
  {
    icon: HiSparkles,
    title: 'AI Chat Assistant',
    description: 'Ask anything about government schemes, documents, or civic procedures in your language. Powered by Smart Bharat AI.',
    link: '/chat',
    color: 'from-saffron-400 to-orange-500',
    badge: 'Most Popular',
    emoji: '🤖',
    highlight: true,
  },
  {
    icon: HiDocumentText,
    title: 'Scheme Finder',
    description: 'Discover 1,200+ central and state government schemes tailored for your profile — age, income, category, state.',
    link: '/schemes',
    color: 'from-navy-600 to-blue-700',
    emoji: '📋',
  },
  {
    icon: HiClipboardList,
    title: 'Document Guide',
    description: 'Know exactly what documents you need for any government process — from Aadhaar to passport applications.',
    link: '/documents',
    color: 'from-teal-500 to-cyan-600',
    emoji: '📄',
  },
  {
    icon: HiExclamationCircle,
    title: 'Complaint Center',
    description: 'File and track civic complaints with real-time status updates. Direct escalation to authorities.',
    link: '/complaints/new',
    color: 'from-red-500 to-rose-600',
    emoji: '📢',
  },
  {
    icon: HiNewspaper,
    title: 'Notice Summarizer',
    description: 'Government circulars and notices are complex. Our AI summarizes them in simple language.',
    link: '/notices',
    color: 'from-purple-500 to-violet-600',
    emoji: '📰',
  },
  {
    icon: HiLocationMarker,
    title: 'Nearby Offices',
    description: 'Find government offices, service centers, banks, and post offices near your location.',
    link: '/offices',
    color: 'from-green-500 to-emerald-600',
    emoji: '🗺️',
  },
];

const FeatureCard = ({ feature, index }) => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
    >
      <Link
        to={feature.link}
        className={`group block rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover ${
          feature.highlight
            ? 'bg-gradient-to-br from-saffron-500 to-orange-600 text-white shadow-neon-saffron'
            : 'bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border shadow-sm hover:shadow-lg'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Top row */}
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              feature.highlight
                ? 'bg-white/20 text-white'
                : `bg-gradient-to-br ${feature.color} text-white`
            }`}>
              <Icon className="w-6 h-6" />
            </div>
            {feature.badge && (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                feature.highlight
                  ? 'bg-white/20 text-white'
                  : 'bg-saffron-100 text-saffron-700 dark:bg-saffron-500/20 dark:text-saffron-300'
              }`}>
                {feature.badge}
              </span>
            )}
          </div>

          {/* Emoji */}
          <div className="text-4xl mb-3">{feature.emoji}</div>

          {/* Text */}
          <h3 className={`font-display text-xl font-bold mb-2 ${
            feature.highlight ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            {feature.title}
          </h3>
          <p className={`text-sm leading-relaxed flex-1 ${
            feature.highlight ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'
          }`}>
            {feature.description}
          </p>

          {/* Arrow */}
          <div className={`flex items-center gap-2 mt-4 text-sm font-semibold ${
            feature.highlight ? 'text-white' : 'text-saffron-500'
          }`}>
            <span>Explore</span>
            <HiArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const FeatureCards = () => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section className="section-padding bg-gray-50 dark:bg-dark-bg">
      <div className="container-max">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-50 dark:bg-navy-900/30 border border-navy-100 dark:border-navy-700/30 text-navy-700 dark:text-navy-300 text-sm font-semibold mb-4"
          >
            Everything You Need
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="section-title text-gray-900 dark:text-white mb-4"
          >
            One Platform for All{' '}
            <span className="text-gradient-india">Civic Needs</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="section-subtitle max-w-2xl mx-auto"
          >
            From AI-powered conversations to real-time complaint tracking — Smart Bharat AI brings all government services to your fingertips.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
