import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import AppRouter from '@/routes/AppRouter';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <LanguageProvider>
              <AppRouter />

              {/* Floating Offline Notification Banner */}
              <AnimatePresence>
                {isOffline && (
                  <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    className="fixed bottom-6 left-6 z-[9999] flex items-center gap-3 px-5 py-3.5 bg-red-600 text-white rounded-2xl shadow-2xl border border-red-500 max-w-sm"
                  >
                    <span className="text-2xl animate-bounce">📡</span>
                    <div>
                      <p className="font-bold text-sm">Offline Mode Active</p>
                      <p className="text-[11px] text-red-100">Smart Bharat AI is running in local fallback mode. Sync will restore once connection returns.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </LanguageProvider>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
