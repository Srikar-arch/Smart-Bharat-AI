import { motion } from 'framer-motion';
import { RiGovernmentLine } from 'react-icons/ri';
import { clsx } from 'clsx';

const Loader = ({ size = 'md', text, fullscreen = false, variant = 'spinner' }) => {
  const SIZES = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      {variant === 'logo' ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className={clsx(
            'rounded-2xl bg-gradient-to-br from-saffron-500 to-navy-900 flex items-center justify-center shadow-neon-saffron',
            SIZES[size]
          )}
        >
          <RiGovernmentLine className="w-1/2 h-1/2 text-white" />
        </motion.div>
      ) : variant === 'dots' ? (
        <div className="flex items-center gap-2">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-saffron-500 rounded-full"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      ) : (
        <div className={clsx(
          'border-4 border-gray-200 dark:border-gray-700 border-t-saffron-500 rounded-full animate-spin',
          SIZES[size]
        )} />
      )}
      {text && (
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-dark-bg">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {spinner}
          </motion.div>
        </div>
      </div>
    );
  }

  return spinner;
};

export default Loader;
