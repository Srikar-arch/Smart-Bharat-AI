import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import { clsx } from 'clsx';

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full m-4',
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
  closeOnBackdrop = true,
  className,
}) => {
  const ref = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal panel */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={clsx(
              'relative w-full bg-white dark:bg-dark-card rounded-3xl shadow-2xl',
              'border border-gray-100 dark:border-dark-border overflow-hidden',
              SIZES[size],
              className
            )}
          >
            {/* Header */}
            {(title || onClose) && (
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-dark-border">
                {title && (
                  <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white">{title}</h2>
                )}
                {onClose && (
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <HiX className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 bg-gray-50 dark:bg-dark-bg border-t border-gray-100 dark:border-dark-border">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
