import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { HiMail, HiLockClosed, HiSparkles, HiEye } from 'react-icons/hi';
import { RiGovernmentLine, RiGoogleFill } from 'react-icons/ri';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signInWithGoogle, loading, error } = useAuth();
  const { success, error: notifError } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      success('Welcome back to Smart Bharat AI! 🇮🇳');
      navigate('/');
    } catch (err) {
      notifError('Login failed. Please check your credentials.');
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      success('Signed in with Google successfully!');
      navigate('/');
    } catch (err) {
      notifError('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left illustration */}
      <div className="hidden lg:flex flex-col lg:w-1/2 bg-gradient-to-br from-navy-900 via-navy-800 to-saffron-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="orb w-96 h-96 bg-saffron-500 -top-24 -left-24 opacity-20" />
        <div className="orb w-80 h-80 bg-navy-300 bottom-0 right-0 opacity-10" />

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-12 text-white text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-saffron-400 to-navy-900 flex items-center justify-center mb-6 shadow-neon-saffron"
          >
            <RiGovernmentLine className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-display font-black mb-4">
            Welcome to <br />
            <span className="text-gradient-india">Smart Bharat AI</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            India's most advanced civic companion. Access government services, schemes, and AI assistance — all in one place.
          </p>
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs text-sm">
            {['1200+ Schemes', '22+ Languages', 'AI Powered', 'Free Forever'].map(feat => (
              <div key={feat} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-2 font-semibold">
                ✅ {feat}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 p-8 text-center">
          <div className="india-stripe rounded-full opacity-40" />
          <p className="text-gray-500 text-xs mt-3">🇮🇳 Made in India • Digital India Initiative</p>
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
            {/* Mobile logo */}
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-500 to-navy-900 flex items-center justify-center">
                <RiGovernmentLine className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold">
                <span className="text-gradient-india">Smart Bharat</span> AI
              </span>
            </div>

            <h2 className="text-3xl font-display font-black text-gray-900 dark:text-white mb-2">Welcome back</h2>
            <p className="text-gray-500 mb-8">Sign in to access your civic dashboard</p>

            {/* Google sign in */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:border-saffron-300 transition-all mb-6"
            >
              <RiGoogleFill className="w-5 h-5 text-red-500" />
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-200 dark:bg-dark-border" />
              <span className="text-sm text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-dark-border" />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/30 rounded-xl text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                icon={<HiMail className="w-4 h-4" />}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                icon={<HiLockClosed className="w-4 h-4" />}
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <input type="checkbox" className="rounded" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-sm text-saffron-500 hover:text-saffron-600 font-semibold">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" fullWidth loading={loading} icon={<HiSparkles />} size="lg">
                Sign In
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-saffron-500 hover:text-saffron-600 font-semibold">
                Create one free →
              </Link>
            </p>

            {/* Demo login */}
            <div className="mt-6 p-4 bg-saffron-50 dark:bg-saffron-500/10 border border-saffron-200 dark:border-saffron-500/20 rounded-xl">
              <p className="text-xs font-bold text-saffron-700 dark:text-saffron-300 mb-2">🚀 Demo Access</p>
              <p className="text-xs text-saffron-600 dark:text-saffron-400 mb-2">Click Sign In with any email/password to demo the app.</p>
              <button
                onClick={() => {
                  setEmail('demo@smartbharat.ai');
                  setPassword('demo123');
                }}
                className="text-xs text-saffron-600 dark:text-saffron-400 underline"
              >
                Auto-fill demo credentials
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
