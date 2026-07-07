import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RiGovernmentLine, RiTwitterXLine, RiFacebookCircleLine,
  RiYoutubeLine, RiInstagramLine, RiLinkedinBoxLine
} from 'react-icons/ri';
import { HiMail, HiPhone, HiLocationMarker, HiExternalLink } from 'react-icons/hi';

const FOOTER_LINKS = {
  'Services': [
    { label: 'AI Chat Assistant', path: '/chat' },
    { label: 'Scheme Finder', path: '/schemes' },
    { label: 'Document Guide', path: '/documents' },
    { label: 'Notice Summarizer', path: '/notices' },
    { label: 'Nearby Offices', path: '/offices' },
  ],
  'Complaints': [
    { label: 'File Complaint', path: '/complaints/new' },
    { label: 'Track Complaint', path: '/complaints' },
    { label: 'Complaint Dashboard', path: '/complaints' },
  ],
  'Account': [
    { label: 'Sign In', path: '/login' },
    { label: 'Register', path: '/register' },
    { label: 'My Profile', path: '/profile' },
    { label: 'Notifications', path: '/notifications' },
    { label: 'Admin Panel', path: '/admin' },
  ],
  'Company': [
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
  ],
};

const SOCIAL_LINKS = [
  { Icon: RiTwitterXLine, href: '#', label: 'Twitter' },
  { Icon: RiFacebookCircleLine, href: '#', label: 'Facebook' },
  { Icon: RiYoutubeLine, href: '#', label: 'YouTube' },
  { Icon: RiInstagramLine, href: '#', label: 'Instagram' },
  { Icon: RiLinkedinBoxLine, href: '#', label: 'LinkedIn' },
];

const GOV_LINKS = [
  { label: 'MyGov.in', href: 'https://www.mygov.in', icon: '🏛️' },
  { label: 'DigiLocker', href: 'https://digilocker.gov.in', icon: '📱' },
  { label: 'UMANG', href: 'https://web.umang.gov.in', icon: '🇮🇳' },
  { label: 'e-Sampark', href: 'https://esampark.gov.in', icon: '📡' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 dark:bg-dark-bg text-gray-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb w-96 h-96 bg-saffron-500 -top-48 -left-24 opacity-5" />
        <div className="orb w-96 h-96 bg-navy-600 -bottom-48 -right-24 opacity-5" />
        <div className="dot-pattern absolute inset-0 opacity-20" />
      </div>

      <div className="relative z-10">
        {/* Top section */}
        <div className="border-b border-white/5 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">

              {/* Brand */}
              <div className="lg:col-span-2">
                <Link to="/" className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-500 to-navy-900 flex items-center justify-center shadow-neon-saffron">
                    <RiGovernmentLine className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-display font-bold">
                      <span className="text-gradient-india">Smart</span>
                      <span className="text-white"> Bharat </span>
                      <span className="text-gradient-saffron">AI</span>
                    </span>
                    <p className="text-[11px] text-gray-500 font-medium">India's Civic Companion</p>
                  </div>
                </Link>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  Empowering every citizen of India with AI-powered access to government services, schemes, and civic assistance — anytime, anywhere.
                </p>

                {/* Contact info */}
                <div className="space-y-2 mb-6">
                  <a href="mailto:support@smartbharat.ai" className="flex items-center gap-2 text-sm text-gray-400 hover:text-saffron-400 transition-colors">
                    <HiMail className="w-4 h-4 text-saffron-500" />
                    support@smartbharat.ai
                  </a>
                  <a href="tel:1800-BHARAT" className="flex items-center gap-2 text-sm text-gray-400 hover:text-saffron-400 transition-colors">
                    <HiPhone className="w-4 h-4 text-saffron-500" />
                    1800-SMART-AI (Toll Free)
                  </a>
                  <p className="flex items-center gap-2 text-sm text-gray-400">
                    <HiLocationMarker className="w-4 h-4 text-saffron-500" />
                    New Delhi, India — 110001
                  </p>
                </div>

                {/* Social links */}
                <div className="flex items-center gap-3">
                  {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      aria-label={label}
                      whileHover={{ scale: 1.15, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-9 h-9 rounded-lg bg-white/5 hover:bg-saffron-500 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Nav links */}
              <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
                {Object.entries(FOOTER_LINKS).map(([category, links]) => (
                  <div key={category}>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{category}</h3>
                    <ul className="space-y-2">
                      {links.map(link => (
                        <li key={link.path}>
                          <Link
                            to={link.path}
                            className="text-sm text-gray-400 hover:text-saffron-400 transition-colors flex items-center gap-1 group"
                          >
                            <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-saffron-400 transition-colors" />
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Government portals */}
        <div className="border-b border-white/5 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Official Portals:</span>
              {GOV_LINKS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-saffron-400 transition-colors px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10"
                >
                  <span>{icon}</span>
                  {label}
                  <HiExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col items-center sm:items-start gap-1 text-[11px] text-gray-500">
                <p>© {currentYear} Smart Bharat AI. Official Portal of the Government of India.</p>
                <p className="opacity-80">Website designed, developed and hosted by National Informatics Centre (NIC), Ministry of Electronics & IT.</p>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacy</Link>
                <Link to="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Terms</Link>
                <Link to="/sitemap" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Sitemap</Link>
              </div>
            </div>
            {/* India flag stripe */}
            <div className="india-stripe mt-6 rounded-full opacity-30" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
