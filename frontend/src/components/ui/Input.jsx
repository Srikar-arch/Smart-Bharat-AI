import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { HiEye, HiEyeOff, HiSearch, HiX } from 'react-icons/hi';
import { useState } from 'react';

const Input = forwardRef(({
  label,
  error,
  hint,
  icon,
  iconRight,
  type = 'text',
  size = 'md',
  className,
  containerClassName,
  required,
  clearable = false,
  onClear,
  value,
  onChange,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const SIZES = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  return (
    <div className={clsx('space-y-1.5', containerClassName)}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-saffron-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          type={inputType}
          value={value}
          onChange={onChange}
          className={clsx(
            'w-full bg-gray-50 dark:bg-dark-card border rounded-xl text-gray-900 dark:text-gray-100',
            'placeholder-gray-400 dark:placeholder-gray-600',
            'focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent',
            'transition-all duration-200',
            error
              ? 'border-red-400 dark:border-red-500 focus:ring-red-400'
              : 'border-gray-200 dark:border-dark-border',
            icon ? 'pl-10' : '',
            (iconRight || isPassword || clearable) ? 'pr-10' : '',
            SIZES[size],
            className
          )}
          {...props}
        />

        {/* Right icon area */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {clearable && value && (
            <button
              type="button"
              onClick={onClear || (() => onChange?.({ target: { value: '' } }))}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <HiX className="w-4 h-4" />
            </button>
          )}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
            </button>
          )}
          {iconRight && !isPassword && (
            <span className="text-gray-400">{iconRight}</span>
          )}
        </div>
      </div>

      {(error || hint) && (
        <p className={clsx(
          'text-xs',
          error ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
        )}>
          {error || hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Textarea variant
Input.Textarea = forwardRef(({ label, error, hint, required, className, containerClassName, ...props }, ref) => (
  <div className={clsx('space-y-1.5', containerClassName)}>
    {label && (
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-saffron-500 ml-1">*</span>}
      </label>
    )}
    <textarea
      ref={ref}
      className={clsx(
        'w-full bg-gray-50 dark:bg-dark-card border rounded-xl px-4 py-3 text-sm',
        'text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600',
        'focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent',
        'transition-all duration-200 resize-none',
        error
          ? 'border-red-400 dark:border-red-500'
          : 'border-gray-200 dark:border-dark-border',
        className
      )}
      {...props}
    />
    {(error || hint) && (
      <p className={clsx('text-xs', error ? 'text-red-500' : 'text-gray-500')}>{error || hint}</p>
    )}
  </div>
));
Input.Textarea.displayName = 'Input.Textarea';

// Select variant
Input.Select = forwardRef(({ label, error, hint, required, children, className, containerClassName, ...props }, ref) => (
  <div className={clsx('space-y-1.5', containerClassName)}>
    {label && (
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-saffron-500 ml-1">*</span>}
      </label>
    )}
    <select
      ref={ref}
      className={clsx(
        'w-full bg-gray-50 dark:bg-dark-card border rounded-xl px-4 py-2.5 text-sm',
        'text-gray-900 dark:text-gray-100',
        'focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent',
        'transition-all duration-200',
        error
          ? 'border-red-400 dark:border-red-500'
          : 'border-gray-200 dark:border-dark-border',
        className
      )}
      {...props}
    >
      {children}
    </select>
    {(error || hint) && (
      <p className={clsx('text-xs', error ? 'text-red-500' : 'text-gray-500')}>{error || hint}</p>
    )}
  </div>
));
Input.Select.displayName = 'Input.Select';

export default Input;
