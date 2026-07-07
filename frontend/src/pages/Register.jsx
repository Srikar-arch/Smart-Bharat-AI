import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { HiMail, HiLockClosed, HiUser, HiSparkles, HiCheckCircle } from 'react-icons/hi';
import { RiGovernmentLine, RiGoogleFill } from 'react-icons/ri';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const FEATURES = [
  'Access 1,200+ government schemes',
  'AI chat in your language',
  'File and track complaints',
  'Find nearby government offices',
  'Government notice summaries',
  'Completely free forever',
];

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const { signUp, signInWithGoogle, loading } = useAuth();
  const { success, error: notifError } = useNotification();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      notifError('Passwords do not match');
      return;
    }
    try {
      await signUp(form.email, form.password, form.name);
      success('Welcome to Smart Bharat AI! 🎉 Your account is ready.');
      navigate('/');
    } catch (err) {
      notifError('Registration failed. Please try again.');
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      success('Account created with Google!');
      navigate('/');
    } catch (err) {
      notifError('Google sign-up failed.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col lg:w-1/2 bg-gradient-to-br from-india-green via-teal-700 to-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="orb w-80 h-80 bg-green-400 -top-20 -right-20 opacity-20" />

        <div className="relative z-10 flex-1 flex flex-col justify-center p-12 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <RiGovernmentLine className="w-7 h-7" />
            </div>
            <span className="text-2xl font-display font-bold">Smart Bharat AI</span>
          </div>

          <h1 className="text-4xl font-display font-black mb-4 leading-tight">
            Join India's Digital Civic Revolution
          </h1>
          <p className="text-green-200 mb-8">
            Create your free account and unlock access to all government services in one place.
          </p>

          <div className="space-y-3">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                  <HiCheckCircle className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm">{feat}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 p-8">
          <div className="india-stripe rounded-full opacity-40" />
          <p className="text-green-600 text-xs mt-3 text-center">🔒 Your data is safe with us. We never sell personal information.</p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-dark-bg">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-500 to-navy-900 flex items-center justify-center">
                <RiGovernmentLine className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-gradient-india">Smart Bharat AI</span>
            </div>

            <h2 className="text-3xl font-display font-black text-gray-900 dark:text-white mb-2">Create Free Account</h2>
            <p className="text-gray-500 mb-8">Join 1.2 million Indians using Smart Bharat AI</p>

            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:border-saffron-300 transition-all mb-6"
            >
              <RiGoogleFill className="w-5 h-5 text-red-500" />
              Sign up with Google
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-200 dark:bg-dark-border" />
              <span className="text-sm text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-dark-border" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Rahul Kumar"
                value={form.name}
                onChange={e => setForm(f => ({...f, name: e.target.value}))}
                icon={<HiUser className="w-4 h-4" />}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({...f, email: e.target.value}))}
                icon={<HiMail className="w-4 h-4" />}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={e => setForm(f => ({...f, password: e.target.value}))}
                icon={<HiLockClosed className="w-4 h-4" />}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={e => setForm(f => ({...f, confirm: e.target.value}))}
                icon={<HiLockClosed className="w-4 h-4" />}
                required
              />

              <div className="flex items-start gap-2">
                <input type="checkbox" id="terms" required className="mt-1 rounded" />
                <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{' '}
                  <Link to="/terms" className="text-saffron-500 hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-saffron-500 hover:underline">Privacy Policy</Link>
                </label>
              </div>

              <Button type="submit" fullWidth loading={loading} icon={<HiSparkles />} size="lg">
                Create Free Account
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-saffron-500 hover:text-saffron-600 font-semibold">
                Sign in →
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
