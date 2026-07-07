import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiCheckCircle, HiXCircle, HiInformationCircle, HiExclamationCircle, HiX } from 'react-icons/hi';

const NotificationContext = createContext(null);

let notifId = 0;

const ICONS = {
  success: HiCheckCircle,
  error: HiXCircle,
  info: HiInformationCircle,
  warning: HiExclamationCircle,
};

const COLORS = {
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/50 text-green-800 dark:text-green-300',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/50 text-red-800 dark:text-red-300',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/50 text-blue-800 dark:text-blue-300',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700/50 text-yellow-800 dark:text-yellow-300',
};

const ICON_COLORS = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-yellow-500',
};

const ToastNotification = ({ notification, onDismiss }) => {
  const Icon = ICONS[notification.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm max-w-sm w-full ${COLORS[notification.type]}`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${ICON_COLORS[notification.type]}`} />
      <div className="flex-1 min-w-0">
        {notification.title && (
          <p className="font-semibold text-sm mb-0.5">{notification.title}</p>
        )}
        <p className="text-sm opacity-90">{notification.message}</p>
      </div>
      <button
        onClick={() => onDismiss(notification.id)}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
      >
        <HiX className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [inAppNotifs, setInAppNotifs] = useState([
    {
      id: 1,
      title: 'New Government Scheme',
      message: 'PM Awas Yojana 2024 applications are now open',
      type: 'info',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      link: '/schemes',
    },
    {
      id: 2,
      title: 'Complaint Update',
      message: 'Your complaint #SB-2024-001 has been resolved',
      type: 'success',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      link: '/complaints',
    },
    {
      id: 3,
      title: 'Document Reminder',
      message: 'Your Aadhaar verification is pending',
      type: 'warning',
      read: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      link: '/documents',
    },
  ]);

  const timerRefs = useRef({});

  const dismiss = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (timerRefs.current[id]) {
      clearTimeout(timerRefs.current[id]);
      delete timerRefs.current[id];
    }
  }, []);

  const notify = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = ++notifId;
    setNotifications(prev => [...prev, { id, type, title, message }]);

    if (duration > 0) {
      timerRefs.current[id] = setTimeout(() => {
        dismiss(id);
      }, duration);
    }

    return id;
  }, [dismiss]);

  const success = useCallback((message, title) => notify({ type: 'success', message, title }), [notify]);
  const error = useCallback((message, title) => notify({ type: 'error', message, title }), [notify]);
  const info = useCallback((message, title) => notify({ type: 'info', message, title }), [notify]);
  const warning = useCallback((message, title) => notify({ type: 'warning', message, title }), [notify]);

  const unreadCount = inAppNotifs.filter(n => !n.read).length;

  const markAsRead = useCallback((id) => {
    setInAppNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setInAppNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const addInAppNotif = useCallback((notif) => {
    setInAppNotifs(prev => [{ ...notif, id: Date.now(), read: false, timestamp: new Date() }, ...prev]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notify, success, error, info, warning,
      inAppNotifs, unreadCount, markAsRead, markAllAsRead, addInAppNotif,
    }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {notifications.map(n => (
            <div key={n.id} className="pointer-events-auto">
              <ToastNotification notification={n} onDismiss={dismiss} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};

export default NotificationContext;
