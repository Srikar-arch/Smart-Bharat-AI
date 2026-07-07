import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiSun, HiMoon, HiBell, HiMenu, HiX, HiUser, HiLogout,
  HiCog, HiChevronDown, HiSearch, HiSparkles
} from 'react-icons/hi';
import { RiGovernmentLine } from 'react-icons/ri';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';

const NAV_LINKS = [
  { label: 'nav_home', path: '/' },
  { label: 'nav_chat', path: '/chat' },
  {
    label: 'Services', path: '#',
    children: [
      { label: 'btn_explore_schemes', path: '/schemes', desc: 'Find government schemes for you' },
      { label: 'nav_documents', path: '/documents', desc: 'Know what documents you need' },
      { label: 'nav_notices', path: '/notices', desc: 'AI-powered notice summaries' },
      { label: 'nav_offices', path: '/offices', desc: 'Find government offices near you' },
    ]
  },
  {
    label: 'Complaints', path: '#',
    children: [
      { label: 'File Complaint', path: '/complaints/new', desc: 'Submit a new complaint' },
      { label: 'nav_complaints', path: '/complaints', desc: 'Track your complaints' },
    ]
  },
  { label: 'About', path: '/about' },
];

const DropdownMenu = ({ items, isOpen }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl shadow-xl overflow-hidden z-50"
      >
        <div className="p-2">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col gap-0.5 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
            >
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-saffron-500 transition-colors">
                {item.label}
              </span>
              {item.desc && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</span>
              )}
            </Link>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const UserMenu = ({ user, onSignOut, isOpen }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl shadow-xl overflow-hidden z-50"
      >
        {/* User info */}
        <div className="p-4 border-b border-gray-100 dark:border-dark-border bg-gradient-to-br from-saffron-50 to-navy-50 dark:from-saffron-500/10 dark:to-navy-900/20">
          <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.displayName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
          <span className="badge-saffron mt-1 capitalize">{user?.role || 'User'}</span>
        </div>
        <div className="p-2">
          <Link to="/profile" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
            <HiUser className="w-4 h-4" /> My Profile
          </Link>
          <Link to="/notifications" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
            <HiBell className="w-4 h-4" /> Notifications
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
              <HiCog className="w-4 h-4" /> Admin Panel
            </Link>
          )}
          <hr className="my-1 border-gray-100 dark:border-dark-border" />
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-sm font-medium text-red-600 dark:text-red-400 transition-colors"
          >
            <HiLogout className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, signOut } = useAuth();
  const { unreadCount } = useNotification();
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  const changeFontSize = (size) => {
    document.documentElement.classList.remove('font-size-sm', 'font-size-lg');
    if (size !== 'normal') {
      document.documentElement.classList.add(`font-size-${size}`);
    }
  };

  const toggleColorBlind = () => {
    const isColorBlind = document.documentElement.classList.toggle('color-blind');
    localStorage.setItem('color-blind', isColorBlind ? 'true' : 'false');
  };

  const translatedNavLinks = NAV_LINKS.map(link => {
    if (link.children) {
      return {
        ...link,
        label: t(link.label) === link.label ? link.label : t(link.label),
        children: link.children.map(c => ({
          ...c,
          label: t(c.label) === c.label ? c.label : t(c.label)
        }))
      };
    }
    return {
      ...link,
      label: t(link.label) === link.label ? link.label : t(link.label)
    };
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
    setUserMenuOpen(false);
  }, [location]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setActiveDropdown(null);
      if (!userMenuRef.current?.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isHomePage = location.pathname === '/';
  const showBg = scrolled || !isHomePage;

  const navbarClasses = `fixed left-0 right-0 z-50 transition-all duration-300 border-b ${
    showBg
      ? 'bg-white/95 dark:bg-dark-bg/95 backdrop-blur-xl shadow-lg border-gray-100 dark:border-dark-border'
      : 'bg-transparent border-white/10 dark:border-white/5'
  }`;

  const navTop = scrolled ? '3px' : '31px';

  return (
    <>
      {/* India flag stripe at top */}
      <div className="india-stripe fixed top-0 left-0 right-0 z-[53] h-[3px]" />

      {/* GoI Official Top Bar - collapses on scroll */}
      <AnimatePresence>
        {!scrolled && (
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-navy-950 text-white text-[11px] py-1.5 border-b border-white/5 hidden sm:flex fixed top-[3px] left-0 right-0 z-[52] h-[28px] items-center"
          >
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
              <div className="flex items-center gap-4 font-medium text-white/90">
                <span className="flex items-center gap-1.5">
                  <span className="text-xs">🇮🇳</span> {t('lbl_gov_india')}
                </span>
                <span className="text-white/20">|</span>
                <span className="text-white/80 font-bold uppercase tracking-wider text-[10px]">{t('lbl_ministry')}</span>
              </div>
              <div className="flex items-center gap-4 text-white/70 text-[10px]">
                <a href="#main" className="hover:text-white transition-colors">Skip to main content</a>
                <span className="text-white/20">|</span>
                <a href="#reader" className="hover:text-white transition-colors">Screen Reader Access</a>
                <span className="text-white/20">|</span>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="bg-transparent text-white border-0 text-[10px] font-bold cursor-pointer focus:outline-none focus:ring-0 py-0"
                >
                  <option value="en" className="bg-navy-950 text-white">English</option>
                  <option value="hi" className="bg-navy-950 text-white">हिंदी (Hindi)</option>
                  <option value="te" className="bg-navy-950 text-white">తెలుగు (Telugu)</option>
                  <option value="ta" className="bg-navy-950 text-white">தமிழ் (Tamil)</option>
                  <option value="kn" className="bg-navy-950 text-white">ಕನ್ನಡ (Kannada)</option>
                  <option value="ml" className="bg-navy-950 text-white">മലയാളം (Malayalam)</option>
                  <option value="gu" className="bg-navy-950 text-white">ગુજરાતી (Gujarati)</option>
                  <option value="pa" className="bg-navy-950 text-white">ਪੰਜਾਬੀ (Punjabi)</option>
                  <option value="mr" className="bg-navy-950 text-white">मराठी (Marathi)</option>
                  <option value="bn" className="bg-navy-950 text-white">বাংলা (Bengali)</option>
                </select>
                <span className="text-white/20">|</span>
                <div className="flex items-center gap-1.5 font-bold">
                  <button onClick={() => changeFontSize('sm')} className="px-1 hover:text-white transition-colors">A-</button>
                  <button onClick={() => changeFontSize('normal')} className="px-1 hover:text-white transition-colors">A</button>
                  <button onClick={() => changeFontSize('lg')} className="px-1 hover:text-white transition-colors">A+</button>
                </div>
                <span className="text-white/20">|</span>
                <button
                  onClick={toggleColorBlind}
                  className="px-1.5 py-0.5 rounded border border-white/20 hover:bg-white/10 text-[9px] font-bold uppercase tracking-wider"
                  title="Toggle High Contrast / Color Blind Mode"
                >
                  Contrast
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className={navbarClasses} style={{ top: navTop }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-saffron-500 to-navy-900 flex items-center justify-center shadow-neon-saffron"
              >
                <RiGovernmentLine className="w-5 h-5 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-lg font-display font-bold">
                  <span className="text-gradient-india">Smart</span>
                  <span className="text-gray-900 dark:text-white"> Bharat </span>
                  <span className="text-gradient-saffron">AI</span>
                </span>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-none">
                  India's Civic Companion
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
              {translatedNavLinks.map((link) => (
                <div key={link.label} className="relative">
                  {link.children ? (
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                      className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive(link.path) || link.children?.some(c => isActive(c.path))
                          ? 'text-saffron-500 bg-saffron-50 dark:bg-saffron-500/10'
                          : 'text-gray-600 dark:text-gray-300 hover:text-saffron-500 hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                    >
                      {link.label}
                      <HiChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link
                      to={link.path}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors block ${
                        isActive(link.path)
                          ? 'text-saffron-500 bg-saffron-50 dark:bg-saffron-500/10'
                          : 'text-gray-600 dark:text-gray-300 hover:text-saffron-500 hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                  {link.children && (
                    <DropdownMenu items={link.children} isOpen={activeDropdown === link.label} />
                  )}
                </div>
              ))}
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && searchQuery) {
                          navigate(`/schemes?q=${encodeURIComponent(searchQuery)}`);
                          setSearchOpen(false);
                        }
                        if (e.key === 'Escape') setSearchOpen(false);
                      }}
                      placeholder="Search schemes..."
                      className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="btn-ghost p-2 rounded-lg"
                aria-label="Search"
              >
                {searchOpen ? <HiX className="w-5 h-5" /> : <HiSearch className="w-5 h-5" />}
              </button>

              {/* Theme toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="btn-ghost p-2 rounded-lg"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <HiSun className="w-5 h-5 text-yellow-400" />
                    </motion.div>
                  ) : (
                    <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <HiMoon className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Notifications */}
              {isAuthenticated && (
                <Link to="/notifications" className="btn-ghost p-2 rounded-lg relative" aria-label="Notifications">
                  <HiBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-saffron-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                  )}
                </Link>
              )}

              {/* Auth */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron-400 to-navy-600 flex items-center justify-center text-white font-bold text-sm">
                      {user?.displayName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <HiChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform hidden sm:block ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <UserMenu user={user} onSignOut={handleSignOut} isOpen={userMenuOpen} />
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login" className="btn-ghost text-sm px-4 py-2">Sign In</Link>
                  <Link to="/register" className="btn-primary text-sm px-4 py-2">
                    <HiSparkles className="w-4 h-4" /> Get Started
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                className="lg:hidden btn-ghost p-2 rounded-lg"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <HiX className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                      <HiMenu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden bg-white dark:bg-dark-bg border-t border-gray-100 dark:border-dark-border"
            >
              <div className="px-4 py-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <div key={link.label}>
                    {link.children ? (
                      <>
                        <div className="px-3 py-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-2">
                          {link.label}
                        </div>
                        {link.children.map(child => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-saffron-50 dark:hover:bg-saffron-500/10 hover:text-saffron-500 transition-colors"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-saffron-400" />
                            {child.label}
                          </Link>
                        ))}
                      </>
                    ) : (
                      <Link
                        to={link.path}
                        className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          isActive(link.path)
                            ? 'bg-saffron-50 dark:bg-saffron-500/10 text-saffron-500'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
                {!isAuthenticated && (
                  <div className="pt-3 flex flex-col gap-2">
                    <Link to="/login" className="btn-outline text-center">Sign In</Link>
                    <Link to="/register" className="btn-primary text-center">Get Started Free</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer */}
      {!isHomePage && <div className="h-24 sm:h-[92px] h-[64px]" />}
    </>
  );
};

export default Navbar;
