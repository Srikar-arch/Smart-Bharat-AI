import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const VARIANTS = {
  primary: 'bg-saffron-500 hover:bg-saffron-600 text-white shadow-neon-saffron hover:shadow-lg',
  secondary: 'bg-navy-900 hover:bg-navy-800 text-white',
  outline: 'border-2 border-saffron-500 text-saffron-500 hover:bg-saffron-500 hover:text-white',
  ghost: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  success: 'bg-green-500 hover:bg-green-600 text-white',
  glass: 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20',
};

const SIZES = {
  xs: 'px-2.5 py-1.5 text-xs rounded-lg',
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-2.5 text-sm rounded-xl',
  lg: 'px-8 py-3 text-base rounded-xl',
  xl: 'px-10 py-4 text-lg rounded-2xl',
};

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconRight,
  className,
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}, ref) => {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { y: -1 } : {}}
      whileTap={!isDisabled ? { scale: 0.97 } : {}}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
          {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';
export default Button;
