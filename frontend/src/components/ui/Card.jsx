import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const Card = ({
  children,
  className,
  variant = 'default',
  hover = false,
  padding = 'md',
  onClick,
  glass = false,
  ...props
}) => {
  const PADDING = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const BASE = 'rounded-2xl border transition-all duration-300';
  const VARIANTS = {
    default: 'bg-white dark:bg-dark-card border-gray-100 dark:border-dark-border shadow-sm',
    glass: 'backdrop-blur-xl bg-white/70 dark:bg-dark-card/70 border-white/50 dark:border-dark-border shadow-glass',
    flat: 'bg-gray-50 dark:bg-dark-card border-gray-100 dark:border-dark-border',
    gradient: 'bg-gradient-to-br from-saffron-50 to-navy-50 dark:from-saffron-500/10 dark:to-navy-900/20 border-saffron-100 dark:border-saffron-500/20',
    dark: 'bg-gray-900 dark:bg-gray-950 border-gray-800 text-white',
  };

  const Comp = onClick || hover ? motion.div : 'div';
  const motionProps = (onClick || hover) ? {
    whileHover: { y: -4, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' },
    whileTap: onClick ? { scale: 0.99 } : {},
    transition: { duration: 0.2 },
  } : {};

  return (
    <Comp
      onClick={onClick}
      className={clsx(
        BASE,
        glass ? VARIANTS.glass : VARIANTS[variant] || VARIANTS.default,
        PADDING[padding],
        hover || onClick ? 'cursor-pointer' : '',
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Comp>
  );
};

Card.Header = ({ children, className }) => (
  <div className={clsx('border-b border-gray-100 dark:border-dark-border pb-4 mb-4', className)}>
    {children}
  </div>
);

Card.Footer = ({ children, className }) => (
  <div className={clsx('border-t border-gray-100 dark:border-dark-border pt-4 mt-4', className)}>
    {children}
  </div>
);

export default Card;
