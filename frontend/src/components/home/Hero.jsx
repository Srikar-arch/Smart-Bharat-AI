import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HiSparkles, HiArrowRight, HiPlay, HiShieldCheck, HiGlobe,
  HiChat, HiDocumentText, HiLocationMarker, HiExclamationCircle,
  HiNewspaper, HiLightningBolt, HiCheckCircle
} from 'react-icons/hi';
import { RiGovernmentLine, RiRobotLine, RiMapPin2Line } from 'react-icons/ri';
import { useTheme } from '@/contexts/ThemeContext';

// Animated particle dot
const Particle = ({ delay, x, y, size = 4 }) => (
  <motion.div
    className="absolute rounded-full bg-saffron-400 opacity-20"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
    animate={{
      y: [0, -30, 0],
      opacity: [0.1, 0.4, 0.1],
      scale: [1, 1.5, 1],
    }}
    transition={{
      duration: 4 + Math.random() * 2,
      repeat: Infinity,
      delay: delay,
      ease: 'easeInOut',
    }}
  />
);

// Chakra spinning symbol
const ChakraIcon = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
    className="absolute opacity-5 dark:opacity-10 pointer-events-none"
    style={{ width: 400, height: 400, top: '10%', right: '-10%' }}
  >
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="90" stroke="#1A237E" strokeWidth="2" />
      <circle cx="100" cy="100" r="70" stroke="#1A237E" strokeWidth="1" />
      <circle cx="100" cy="100" r="20" fill="#1A237E" fillOpacity="0.3" />
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24;
        const rad = (angle * Math.PI) / 180;
        const x1 = 100 + 25 * Math.cos(rad);
        const y1 = 100 + 25 * Math.sin(rad);
        const x2 = 100 + 68 * Math.cos(rad);
        const y2 = 100 + 68 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1A237E" strokeWidth="1.5" />;
      })}
    </svg>
  </motion.div>
);

const PARTICLES = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 4,
  size: 3 + Math.random() * 5,
}));

const Hero = () => {
  const { isDark } = useTheme();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const floatingCards = [
    { icon: '🤖', label: 'AI Powered', value: '24/7 Available', color: 'from-saffron-500 to-orange-600' },
    { icon: '🏛️', label: 'Gov Schemes', value: '1,200+ Schemes', color: 'from-navy-700 to-navy-900' },
    { icon: '📍', label: 'Offices', value: '5L+ Listed', color: 'from-green-600 to-teal-600' },
    { icon: '✅', label: 'Complaints Resolved', value: '98.7% Rate', color: 'from-purple-600 to-indigo-600' },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: isDark
          ? 'radial-gradient(ellipse at 20% 50%, rgba(26,35,126,0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,107,53,0.15) 0%, transparent 50%), #0A0F1E'
          : 'radial-gradient(ellipse at 20% 50%, rgba(26,35,126,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(255,107,53,0.1) 0%, transparent 50%), #FFFFFF'
      }}
    >
      {/* Background elements */}
      <div className="particles-bg">
        {PARTICLES.map(p => <Particle key={p.id} {...p} />)}
      </div>
      <ChakraIcon />

      {/* Gradient orbs */}
      <motion.div
        className="orb w-96 h-96 bg-saffron-500"
        style={{ top: '-10%', left: '-5%' }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="orb w-[600px] h-[600px] bg-navy-700"
        style={{ bottom: '-20%', right: '-10%' }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
      />

      {/* Hero-pattern overlay */}
      <div className="absolute inset-0 bg-hero-pattern opacity-40 dark:opacity-20" />

      <motion.div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — Text */}
            <div>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saffron-50 dark:bg-saffron-500/10 border border-saffron-200 dark:border-saffron-500/30 text-saffron-700 dark:text-saffron-300 text-sm font-semibold mb-6"
              >
                <HiSparkles className="w-4 h-4 animate-pulse" />
                Official Civic Tech Platform
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-display font-black leading-[1.05] mb-6"
              >
                <span className="text-gray-900 dark:text-white">India's</span>
                <br />
                <span className="text-gradient-india">Intelligent</span>
                <br />
                <span className="text-gray-900 dark:text-white">Civic</span>{' '}
                <span className="relative inline-block">
                  <span className="text-gradient-saffron">Companion</span>
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-saffron-500 to-transparent rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8 max-w-xl"
              >
                Access <strong className="text-navy-700 dark:text-navy-300">1,200+ government schemes</strong>, file complaints, find nearby offices, and get AI-powered answers to all your civic questions — in your language, at any time.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10"
              >
                <Link to="/chat" id="hero-start-chat-btn" className="btn-primary text-base px-8 py-3.5 gap-2 group">
                  <HiSparkles className="w-5 h-5" />
                  Start AI Chat
                  <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/schemes" className="btn-outline text-base px-8 py-3.5">
                  Explore Schemes
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400"
              >
                {[
                  { icon: <HiShieldCheck className="w-4 h-4 text-green-500" />, label: 'Government Verified' },
                  { icon: <HiGlobe className="w-4 h-4 text-blue-500" />, label: '22+ Languages' },
                  { icon: <HiLightningBolt className="w-4 h-4 text-yellow-500" />, label: 'Instant Responses' },
                  { icon: <HiCheckCircle className="w-4 h-4 text-saffron-500" />, label: 'Free to Use' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    {icon}
                    <span>{label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — Floating UI Cards */}
            <div className="relative hidden lg:block">
              {/* Main central card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
                className="relative mx-auto max-w-sm"
              >
                {/* Chat preview card */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="glass-card p-5 rounded-3xl shadow-2xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-500 to-navy-900 flex items-center justify-center">
                      <RiGovernmentLine className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">Smart Bharat AI</p>
                      <p className="text-xs text-green-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                        Online
                      </p>
                    </div>
                  </div>

                  {/* Chat bubbles */}
                  <div className="space-y-3 mb-4">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-[85%]">
                      <p className="text-gray-700 dark:text-gray-300">मुझे PM Awas Yojana के बारे में जानकारी चाहिए।</p>
                    </div>
                    <div className="bg-gradient-to-r from-saffron-500 to-orange-500 rounded-2xl rounded-tr-sm px-4 py-3 text-sm ml-auto max-w-[85%]">
                      <p className="text-white">PM Awas Yojana एक आवास योजना है जो गरीब परिवारों को पक्का घर प्रदान करती है। आपकी पात्रता जाँचने के लिए...</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-saffron-400 to-navy-600" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}} />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating stat cards */}
                {floatingCards.map((card, i) => {
                  const positions = [
                    { top: '-12%', left: '-25%' },
                    { top: '-12%', right: '-25%' },
                    { bottom: '5%', left: '-30%' },
                    { bottom: '5%', right: '-30%' },
                  ];

                  return (
                    <motion.div
                      key={card.label}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.15, type: 'spring' }}
                      style={positions[i]}
                      className="absolute z-10"
                    >
                      <motion.div
                        animate={{ y: [0, i % 2 === 0 ? -6 : 6, 0] }}
                        transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
                        className={`bg-gradient-to-br ${card.color} rounded-2xl p-3 shadow-xl text-white min-w-[120px]`}
                      >
                        <span className="text-2xl">{card.icon}</span>
                        <p className="text-xs opacity-80 mt-1">{card.label}</p>
                        <p className="text-sm font-bold">{card.value}</p>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center mt-16 gap-2"
          >
            <p className="text-xs text-gray-400">Scroll to explore</p>
            <div className="w-5 h-8 border-2 border-gray-300 dark:border-gray-600 rounded-full flex justify-center pt-1.5">
              <div className="w-1 h-2 bg-saffron-500 rounded-full animate-bounce" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
