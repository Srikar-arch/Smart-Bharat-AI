import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HiSparkles, HiArrowRight, HiHeart, HiGlobe, HiShieldCheck,
  HiLightningBolt, HiCode, HiAcademicCap
} from 'react-icons/hi';
import { RiGovernmentLine } from 'react-icons/ri';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const TEAM = [
  { name: 'Bala Srikar', role: 'Founder & Lead Architect', emoji: '👨‍💻', bg: 'from-saffron-500 via-navy-800 to-green-600' },
];

const VALUES = [
  { icon: '🤝', title: 'Citizen First', desc: 'Every feature we build starts with the citizen\'s need, not the technology.' },
  { icon: '🔒', title: 'Privacy by Design', desc: 'Your data is yours. We never sell or misuse personal information.' },
  { icon: '🌐', title: 'Inclusive Access', desc: 'We support 22+ Indian languages to reach every citizen.' },
  { icon: '⚡', title: 'Speed & Simplicity', desc: 'Complex government processes, simplified in seconds.' },
];

const About = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-saffron-900">
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="orb w-96 h-96 bg-saffron-500 top-0 left-0 opacity-10" />
        <div className="orb w-80 h-80 bg-navy-300 bottom-0 right-0 opacity-10" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold mb-6"
          >
            <RiGovernmentLine className="w-4 h-4" />
            India's Civic Companion
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl font-display font-black text-white mb-6"
          >
            About{' '}
            <span className="text-gradient-india">Smart Bharat AI</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            We believe every Indian citizen deserves frictionless access to government services, regardless of language, literacy, or location.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-white dark:bg-dark-bg">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              ref={ref}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
            >
              <Badge variant="saffron" className="mb-4">Our Mission</Badge>
              <h2 className="section-title text-gray-900 dark:text-white mb-6">
                Democratizing Access to{' '}
                <span className="text-gradient-india">Government Services</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                India has an extraordinary ecosystem of government schemes, services, and welfare programs — but navigating them is incredibly complex. Language barriers, bureaucratic jargon, and lack of awareness mean millions of eligible citizens miss out on benefits that are rightfully theirs.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Smart Bharat AI was built to bridge this gap using the power of artificial intelligence, natural language processing, and accessible design — making government services as easy as chatting with a friend.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="green" size="md">🇮🇳 Made in India</Badge>
                <Badge variant="navy" size="md">🤖 Powered by National AI Grid</Badge>
                <Badge variant="saffron" size="md">✅ Open for Citizens</Badge>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { num: '1.4B+', label: 'Citizens', icon: '🇮🇳' },
                { num: '1200+', label: 'Schemes', icon: '📋' },
                { num: '22+', label: 'Languages', icon: '🗣️' },
                { num: '5L+', label: 'Offices', icon: '🏛️' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: i * 0.1 + 0.2 }}
                >
                  <Card className="text-center p-6">
                    <div className="text-4xl mb-2">{s.icon}</div>
                    <div className="text-3xl font-display font-black text-saffron-500 mb-1">{s.num}</div>
                    <div className="text-sm text-gray-500">{s.label}</div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-gray-50 dark:bg-dark-bg">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="section-title text-gray-900 dark:text-white mb-4">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="text-center h-full">
                  <div className="text-5xl mb-4">{v.icon}</div>
                  <h3 className="font-display font-bold text-gray-900 dark:text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{v.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-white dark:bg-dark-bg">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="section-title text-gray-900 dark:text-white mb-4">Platform Creator</h2>
            <p className="section-subtitle">The designer and engineer behind Smart Bharat AI, committed to Digital India.</p>
          </div>
          <div className="flex justify-center">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-sm"
              >
                <Card className="text-center p-6">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.bg} flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg`}>
                    {member.emoji}
                  </div>
                  <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-sm font-semibold text-saffron-500 mt-1">{member.role}</p>
                  <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                    Designed and built every detail of Smart Bharat AI to provide citizens with seamless, instant, and inclusive access to civic assistance.
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-saffron-500 to-navy-900">
        <div className="container-max text-center">
          <h2 className="text-4xl font-display font-black text-white mb-4">Join India's Civic Revolution</h2>
          <p className="text-white/80 mb-8 text-lg">Help us make government services accessible for every citizen.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-saffron-600 font-bold rounded-xl hover:bg-gray-50 transition-colors">
              <HiSparkles /> Get Started Free
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
