import { motion } from 'framer-motion';
import { HiArrowLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({
  title,
  subtitle,
  badge,
  actions,
  back = false,
  backLabel = 'Back',
  icon: Icon,
  gradient = false,
  className = '',
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-8 ${className}`}
    >
      {back && (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-saffron-500 mb-4 transition-colors group"
        >
          <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {backLabel}
        </button>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-saffron-500 to-navy-900 flex items-center justify-center shadow-neon-saffron flex-shrink-0">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}

          <div>
            {badge && (
              <span className="badge-saffron mb-1 inline-flex">{badge}</span>
            )}
            <h1 className={`section-title ${gradient ? 'text-gradient-india' : 'text-gray-900 dark:text-white'}`}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm sm:text-base">{subtitle}</p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PageHeader;
