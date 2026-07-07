import { motion } from 'framer-motion';
import Button from './Button';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  illustration,
  compact = false,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex flex-col items-center justify-center text-center ${compact ? 'py-8 px-4' : 'py-16 px-8'}`}
  >
    {illustration ? (
      <div className="mb-6">{illustration}</div>
    ) : Icon ? (
      <div className={`${compact ? 'w-14 h-14' : 'w-20 h-20'} rounded-3xl bg-gray-100 dark:bg-dark-card flex items-center justify-center mb-4`}>
        <Icon className={`${compact ? 'w-7 h-7' : 'w-10 h-10'} text-gray-400 dark:text-gray-600`} />
      </div>
    ) : (
      <div className="text-5xl mb-4">🗂️</div>
    )}

    <h3 className={`font-display font-bold text-gray-900 dark:text-white mb-2 ${compact ? 'text-base' : 'text-xl'}`}>
      {title || 'Nothing here yet'}
    </h3>

    {description && (
      <p className={`text-gray-500 dark:text-gray-400 max-w-sm mb-6 ${compact ? 'text-sm' : 'text-base'}`}>
        {description}
      </p>
    )}

    {action && (
      <Button onClick={action} size={compact ? 'sm' : 'md'}>
        {actionLabel || 'Get Started'}
      </Button>
    )}
  </motion.div>
);

export default EmptyState;
