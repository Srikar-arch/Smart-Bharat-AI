import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiHome, HiChat, HiDocumentText, HiOfficeBuilding,
  HiExclamationCircle, HiClipboardList, HiNewspaper,
  HiLocationMarker, HiUser, HiBell, HiInformationCircle,
  HiMail, HiCog, HiChevronLeft, HiChevronRight, HiSparkles,
  HiShieldCheck
} from 'react-icons/hi';
import { RiGovernmentLine } from 'react-icons/ri';
import { useAuth } from '@/contexts/AuthContext';

const NAV_ITEMS = [
  { icon: HiHome, label: 'Home', path: '/' },
  { icon: HiSparkles, label: 'AI Chat', path: '/chat', badge: 'AI' },
  { icon: HiDocumentText, label: 'Schemes', path: '/schemes' },
  { icon: HiClipboardList, label: 'Documents', path: '/documents' },
  { divider: true, label: 'Complaints' },
  { icon: HiExclamationCircle, label: 'File Complaint', path: '/complaints/new' },
  { icon: HiClipboardList, label: 'My Complaints', path: '/complaints', requiresAuth: true },
  { divider: true, label: 'Information' },
  { icon: HiNewspaper, label: 'Notice Board', path: '/notices' },
  { icon: HiLocationMarker, label: 'Nearby Offices', path: '/offices' },
  { divider: true, label: 'Account' },
  { icon: HiUser, label: 'Profile', path: '/profile', requiresAuth: true },
  { icon: HiBell, label: 'Notifications', path: '/notifications', requiresAuth: true },
  { divider: true, label: 'More' },
  { icon: HiInformationCircle, label: 'About', path: '/about' },
  { icon: HiMail, label: 'Contact', path: '/contact' },
  { icon: HiCog, label: 'Admin', path: '/admin', requiresAdmin: true },
];

const Sidebar = ({ open, onClose }) => {
  const location = useLocation();
  const { isAuthenticated, isAdmin, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const filteredItems = NAV_ITEMS.filter(item => {
    if (item.requiresAuth && !isAuthenticated) return false;
    if (item.requiresAdmin && !isAdmin) return false;
    return true;
  });

  const sidebarContent = (
    <div className={`flex flex-col h-full transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-dark-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron-500 to-navy-900 flex items-center justify-center">
              <RiGovernmentLine className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-sm text-gray-900 dark:text-white">Smart Bharat</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron-500 to-navy-900 flex items-center justify-center mx-auto">
            <RiGovernmentLine className="w-4 h-4 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-6 h-6 rounded-full bg-gray-100 dark:bg-dark-card items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
        >
          {collapsed ? <HiChevronRight className="w-3 h-3" /> : <HiChevronLeft className="w-3 h-3" />}
        </button>
        <button onClick={onClose} className="lg:hidden">
          <HiChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* User card */}
      {isAuthenticated && !collapsed && (
        <div className="m-3 p-3 rounded-xl bg-gradient-to-br from-saffron-50 to-navy-50 dark:from-saffron-500/10 dark:to-navy-900/20 border border-saffron-100 dark:border-saffron-500/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-saffron-400 to-navy-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.displayName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.displayName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {filteredItems.map((item, idx) => {
          if (item.divider) {
            return collapsed ? (
              <div key={idx} className="my-2 border-t border-gray-100 dark:border-dark-border" />
            ) : (
              <div key={idx} className="px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest mt-2">
                {item.label}
              </div>
            );
          }

          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                active
                  ? 'bg-saffron-500 text-white shadow-neon-saffron'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-saffron-500 dark:hover:text-saffron-400'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-saffron-500 rounded-xl"
                  style={{ zIndex: -1 }}
                />
              )}
              <Icon className={`w-5 h-5 flex-shrink-0 ${collapsed ? '' : ''}`} />
              {!collapsed && (
                <>
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-current opacity-70 text-white">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-2">
            <HiShieldCheck className="w-4 h-4 text-india-green" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Secure & Verified</span>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-1">Government of India Initiative</p>
          <div className="india-stripe mt-3 rounded-full" />
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col h-screen sticky top-0 bg-white dark:bg-dark-bg border-r border-gray-100 dark:border-dark-border overflow-hidden transition-all duration-300">
        {sidebarContent}
      </aside>

      {/* Mobile overlay sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden bg-white dark:bg-dark-bg border-r border-gray-100 dark:border-dark-border overflow-hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
