import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { HiStar, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Homemaker, Jaipur',
    state: 'Rajasthan 🏜️',
    avatar: 'PS',
    rating: 5,
    text: 'Smart Bharat AI helped me find the PM Ujjwala Yojana and apply for an LPG connection within hours. The AI explained everything in Hindi and guided me step by step. Truly incredible!',
    scheme: 'PM Ujjwala Yojana',
  },
  {
    name: 'Ramesh Kumar',
    role: 'Farmer, Vidarbha',
    state: 'Maharashtra 🌾',
    avatar: 'RK',
    rating: 5,
    text: 'मैंने PM-KISAN के लिए आवेदन कर दिया। AI ने मराठी में सब समझाया। बहुत बढ़िया सेवा है! जब भी कोई समस्या हो, यह तुरंत मदद करता है।',
    scheme: 'PM-KISAN Yojana',
  },
  {
    name: 'Anita Menon',
    role: 'Software Engineer, Bangalore',
    state: 'Karnataka 💻',
    avatar: 'AM',
    rating: 5,
    text: 'Filed a complaint about broken roads in my area. Got a resolution within 72 hours! The tracking system kept me informed at every step. This is what Digital India should look like.',
    scheme: 'Complaint Resolution',
  },
  {
    name: 'Mohammed Rafiq',
    role: 'Small Business Owner, Lucknow',
    state: 'Uttar Pradesh 🏪',
    avatar: 'MR',
    rating: 5,
    text: 'The Document Guide saved me from multiple trips to government offices. I knew exactly what papers to carry for my GST registration. The AI is more helpful than government helplines!',
    scheme: 'GST Registration',
  },
  {
    name: 'Sunita Devi',
    role: 'ASHA Worker, Patna',
    state: 'Bihar 🌺',
    avatar: 'SD',
    rating: 5,
    text: 'I use Smart Bharat AI to help villagers in my area find health schemes. The multilingual support is amazing — I can show it in Hindi and they understand everything easily.',
    scheme: 'Ayushman Bharat',
  },
  {
    name: 'Vikram Singh',
    role: 'Student, Chandigarh',
    state: 'Punjab 📚',
    avatar: 'VS',
    rating: 5,
    text: 'Found 3 scholarship schemes I was eligible for that I had no idea about. Applied for all of them through the guidance. Got 2 scholarships! This platform changed my life.',
    scheme: 'National Scholarship Portal',
  },
];

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <HiStar key={i} className={`w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`} />
    ))}
  </div>
);

const TestimonialCard = ({ testimonial, active }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: active ? 1 : 0.95 }}
    className={`relative p-6 rounded-3xl border transition-all duration-300 ${
      active
        ? 'bg-white dark:bg-dark-card border-saffron-200 dark:border-saffron-500/30 shadow-xl'
        : 'bg-gray-50 dark:bg-dark-card/50 border-gray-100 dark:border-dark-border opacity-60'
    }`}
  >
    {/* Quote icon */}
    <div className="absolute top-4 right-4 text-saffron-200 dark:text-saffron-800">
      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
    </div>

    {/* Stars */}
    <div className="mb-3">
      <StarRating rating={testimonial.rating} />
    </div>

    {/* Text */}
    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 italic">
      "{testimonial.text}"
    </p>

    {/* Scheme tag */}
    <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-saffron-50 dark:bg-saffron-500/10 text-saffron-700 dark:text-saffron-300 border border-saffron-200 dark:border-saffron-500/20 mb-4">
      📋 {testimonial.scheme}
    </span>

    {/* Author */}
    <div className="flex items-center gap-3 border-t border-gray-100 dark:border-dark-border pt-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-400 to-navy-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        {testimonial.avatar}
      </div>
      <div>
        <p className="font-semibold text-sm text-gray-900 dark:text-white">{testimonial.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.role} • {testimonial.state}</p>
      </div>
    </div>
  </motion.div>
);

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const intervalRef = useRef(null);

  const next = () => setCurrent(c => (c + 1) % TESTIMONIALS.length);
  const prev = () => setCurrent(c => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  useEffect(() => {
    intervalRef.current = setInterval(next, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const visibleCount = 3;
  const visibleItems = Array.from({ length: visibleCount }, (_, i) => ({
    testimonial: TESTIMONIALS[(current + i) % TESTIMONIALS.length],
    active: i === 0,
  }));

  return (
    <section className="section-padding bg-white dark:bg-dark-bg overflow-hidden">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/30 text-yellow-700 dark:text-yellow-300 text-sm font-semibold mb-4"
          >
            ⭐ 4.9/5 from 50,000+ users
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="section-title text-gray-900 dark:text-white mb-4"
          >
            Loved by{' '}
            <span className="text-gradient-india">Millions of Indians</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="section-subtitle max-w-xl mx-auto"
          >
            Real stories from real citizens across India whose lives we've touched.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AnimatePresence mode="wait">
            {visibleItems.map(({ testimonial, active }, i) => (
              <TestimonialCard key={`${current}-${i}`} testimonial={testimonial} active={active} />
            ))}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={prev} className="w-10 h-10 rounded-full border border-gray-200 dark:border-dark-border flex items-center justify-center hover:bg-saffron-50 dark:hover:bg-saffron-500/10 hover:border-saffron-200 transition-all">
            <HiChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 h-2 bg-saffron-500' : 'w-2 h-2 bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          <button onClick={next} className="w-10 h-10 rounded-full border border-gray-200 dark:border-dark-border flex items-center justify-center hover:bg-saffron-50 dark:hover:bg-saffron-500/10 hover:border-saffron-200 transition-all">
            <HiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
