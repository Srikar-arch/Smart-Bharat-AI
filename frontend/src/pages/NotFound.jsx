import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { HiHome, HiArrowLeft, HiSearch, HiSparkles } from 'react-icons/hi';
import { RiGovernmentLine } from 'react-icons/ri';

const SUGGESTIONS = [
  { label: 'Go Home', path: '/', icon: HiHome },
  { label: 'AI Chat', path: '/chat', icon: HiSparkles },
  { label: 'Find Schemes', path: '/schemes', icon: HiSearch },
];

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-bg px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-hero-pattern opacity-30" />
      <div className="orb w-96 h-96 bg-saffron-500 -top-48 -left-24 opacity-10" />
      <div className="orb w-80 h-80 bg-navy-600 -bottom-40 -right-20 opacity-10" />

      <div className="relative z-10 text-center max-w-lg">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.1 }}
          className="w-20 h-20 rounded-3xl bg-gradient-to-br from-saffron-500 to-navy-900 flex items-center justify-center mx-auto mb-6 shadow-neon-saffron"
        >
          <RiGovernmentLine className="w-10 h-10 text-white" />
        </motion.div>

        {/* 404 */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <div className="text-9xl font-display font-black text-gradient-india leading-none mb-2">
            404
          </div>
          <div className="flex justify-center gap-3 mb-2">
            {['S', 'O', 'R', 'R', 'Y'].map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="text-2xl font-display font-black text-gray-300 dark:text-gray-700"
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3">
            Page Not Found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. This is common with government portals, but we've got you covered!
          </p>

          {/* Quick links */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="btn-outline flex items-center gap-2"
            >
              <HiArrowLeft className="w-4 h-4" /> Go Back
            </button>
            <Link to="/" className="btn-primary">
              <HiHome className="w-4 h-4" /> Go to Homepage
            </Link>
          </div>

          {/* Suggestions */}
          <p className="text-sm text-gray-400 mb-3">Quick links that might help:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {SUGGESTIONS.map(s => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.path}
                  to={s.path}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-saffron-300 hover:text-saffron-500 transition-all"
                >
                  <Icon className="w-4 h-4" />
                  {s.label}
                </Link>
              );
            })}
          </div>

          {/* India flag stripe */}
          <div className="india-stripe mx-auto mt-12 max-w-xs rounded-full opacity-40" />
          <p className="text-xs text-gray-400 mt-3">🇮🇳 Smart Bharat AI — Serving Every Indian</p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
