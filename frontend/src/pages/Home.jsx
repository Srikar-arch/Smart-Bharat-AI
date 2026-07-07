import { motion } from 'framer-motion';
import Hero from '@/components/home/Hero';
import FeatureCards from '@/components/home/FeatureCards';
import Stats from '@/components/home/Stats';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { HiArrowRight, HiSparkles } from 'react-icons/hi';

// CTA Section
const CTASection = () => {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <section className="section-padding overflow-hidden">
      <div className="container-max">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-saffron-500 via-orange-500 to-navy-900" />
          <div className="absolute inset-0 bg-hero-pattern opacity-10" />

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full filter blur-3xl opacity-5 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full filter blur-3xl opacity-5 translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 text-center py-16 px-8">
            <div className="text-5xl mb-4">🇮🇳</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white mb-4">
              Every Indian Deserves{' '}
              <br />Easy Access to Their Rights
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Join millions of citizens already using Smart Bharat AI to navigate government services with confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                id="cta-register-btn"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-saffron-600 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
              >
                <HiSparkles className="w-5 h-5" />
                Get Started Free
                <HiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-colors"
              >
                Try AI Chat →
              </Link>
            </div>
            <p className="text-white/60 text-sm mt-6">No credit card required • Works in 22+ languages • Available 24/7</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// How it works section
const HowItWorks = () => {
  const { ref, inView } = useInView({ triggerOnce: true });

  const STEPS = [
    { num: '01', icon: '📱', title: 'Create Account', desc: 'Sign up in 30 seconds with your email or Google account. No complex verification required.' },
    { num: '02', icon: '🤖', title: 'Ask Anything', desc: 'Chat with our AI about schemes, documents, complaints, or any government-related query in your language.' },
    { num: '03', icon: '📋', title: 'Take Action', desc: 'Apply for schemes, file complaints, find offices — all guided step-by-step by the AI.' },
    { num: '04', icon: '✅', title: 'Track & Resolve', desc: 'Track your applications and complaints in real-time with status updates at every stage.' },
  ];

  return (
    <section className="section-padding bg-white dark:bg-dark-bg">
      <div className="container-max">
        <div className="text-center mb-14">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/30 text-green-700 dark:text-green-300 text-sm font-semibold mb-4"
          >
            🎯 Simple as 1-2-3
          </motion.div>
          <h2 className="section-title text-gray-900 dark:text-white mb-4">
            How <span className="text-gradient-india">Smart Bharat AI</span> Works
          </h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Getting started is incredibly simple. Be up and running in under a minute.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-saffron-200 via-saffron-400 to-saffron-200 dark:from-saffron-800 dark:via-saffron-600 dark:to-saffron-800" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              {/* Number badge */}
              <div className="relative inline-flex">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-saffron-50 to-orange-50 dark:from-saffron-500/10 dark:to-orange-500/10 border-2 border-saffron-200 dark:border-saffron-500/30 flex items-center justify-center text-4xl mb-4 mx-auto relative z-10">
                  {step.icon}
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-saffron-500 text-white text-xs font-black flex items-center justify-center z-20">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <>
      <Hero />
      <FeatureCards />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <FAQ />
      <CTASection />
    </>
  );
};

export default Home;
