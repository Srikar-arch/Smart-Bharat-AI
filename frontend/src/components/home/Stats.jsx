import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const STATS = [
  { value: '1.4B+', label: 'Citizens Served', icon: '🇮🇳', color: 'text-saffron-500' },
  { value: '1,200+', label: 'Gov. Schemes Listed', icon: '📋', color: 'text-navy-600 dark:text-navy-400' },
  { value: '5L+', label: 'Govt. Offices Mapped', icon: '🏛️', color: 'text-green-600 dark:text-green-400' },
  { value: '98.7%', label: 'Complaint Resolution', icon: '✅', color: 'text-teal-600 dark:text-teal-400' },
  { value: '22+', label: 'Indian Languages', icon: '🗣️', color: 'text-purple-600 dark:text-purple-400' },
  { value: '24/7', label: 'AI Availability', icon: '⚡', color: 'text-saffron-500' },
];

const CountUp = ({ value }) => {
  // Simple display — real countup would need useEffect
  return <span>{value}</span>;
};

const StatCard = ({ stat, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
      className="flex flex-col items-center text-center p-6 rounded-3xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
    >
      <motion.span
        className="text-4xl mb-3"
        animate={inView ? { scale: [0, 1.3, 1] } : {}}
        transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
      >
        {stat.icon}
      </motion.span>

      <motion.div
        className={`text-4xl sm:text-5xl font-display font-black mb-1 ${stat.color}`}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: index * 0.1 + 0.3 }}
      >
        <CountUp value={stat.value} />
      </motion.div>

      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'radial-gradient(circle at center, rgba(255,107,53,0.05), transparent 70%)' }}
      />
    </motion.div>
  );
};

const Stats = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-saffron-900 dark:from-gray-950 dark:via-navy-950 dark:to-gray-950" />
      <div className="absolute inset-0 bg-hero-pattern opacity-10" />

      {/* Decorative orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-saffron-500 rounded-full filter blur-3xl opacity-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-navy-500 rounded-full filter blur-3xl opacity-10" />

      <div className="container-max relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold mb-4"
          >
            🏆 Trusted by Millions of Indians
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="text-3xl md:text-4xl font-display font-bold text-white mb-3"
          >
            Numbers that speak for themselves
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-gray-300 max-w-xl mx-auto"
          >
            Smart Bharat AI is building the most comprehensive civic tech platform for every Indian citizen.
          </motion.p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="relative">
              <StatCard stat={stat} index={i} />
            </div>
          ))}
        </div>

        {/* India flag stripe */}
        <div className="india-stripe mt-12 rounded-full opacity-50" />
      </div>
    </section>
  );
};

export default Stats;
