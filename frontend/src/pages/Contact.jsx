import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiMail, HiPhone, HiLocationMarker, HiChat, HiPaperAirplane,
  HiCheckCircle, HiClock
} from 'react-icons/hi';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useNotification } from '@/contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

const CONTACT_OPTIONS = [
  { icon: HiPhone, label: 'Toll-Free', value: '1800-SMART-AI', desc: '24/7 support', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
  { icon: HiMail, label: 'Email', value: 'support@smartbharat.ai', desc: 'Reply within 24 hours', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { icon: HiChat, label: 'AI Chat', value: 'Available 24/7', desc: 'Instant AI assistance', color: 'text-saffron-500', bg: 'bg-saffron-100 dark:bg-saffron-900/30' },
  { icon: HiLocationMarker, label: 'Office', value: 'New Delhi - 110001', desc: 'Mon–Fri, 10AM–6PM', color: 'text-navy-500', bg: 'bg-navy-100 dark:bg-navy-900/30' },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', category: 'general' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { success } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
    success('Message sent! We\'ll get back to you within 24 hours.');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy-900 to-saffron-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-display font-black mb-4"
          >
            Get in <span className="text-gradient-india">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-lg"
          >
            Have a question or feedback? We'd love to hear from you.
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Contact options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {CONTACT_OPTIONS.map((opt, i) => {
            const Icon = opt.icon;
            return (
              <motion.div
                key={opt.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="text-center h-full">
                  <div className={`w-12 h-12 rounded-2xl ${opt.bg} flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-6 h-6 ${opt.color}`} />
                  </div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{opt.label}</p>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{opt.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card padding="lg">
              <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-6">Send us a Message</h2>

              {sent ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiCheckCircle className="w-12 h-12 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message Sent! ✉️</h3>
                  <p className="text-gray-500">We'll reply within 24 hours.</p>
                  <Button className="mt-4" variant="outline" onClick={() => setSent(false)}>Send Another</Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Your Name" placeholder="Rahul Kumar" required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
                    <Input label="Email Address" type="email" placeholder="you@example.com" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
                  </div>
                  <Input.Select label="Category" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
                    <option value="general">General Query</option>
                    <option value="scheme">Scheme Related</option>
                    <option value="complaint">Complaint Issue</option>
                    <option value="technical">Technical Issue</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership</option>
                  </Input.Select>
                  <Input label="Subject" placeholder="What is your message about?" required value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))} />
                  <Input.Textarea label="Message" placeholder="Describe your question or feedback in detail..." rows={5} required value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} />
                  <Button type="submit" fullWidth loading={loading} icon={<HiPaperAirplane />}>
                    Send Message
                  </Button>
                </form>
              )}
            </Card>
          </motion.div>

          {/* Sidebar info */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card padding="lg" className="bg-gradient-to-br from-saffron-50 to-orange-50 dark:from-saffron-900/20 dark:to-orange-900/20 border-saffron-100 dark:border-saffron-700/30">
              <h3 className="font-display font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <HiClock className="w-5 h-5 text-saffron-500" /> Response Times
              </h3>
              {[
                { type: 'General Queries', time: '< 24 hours' },
                { type: 'Technical Issues', time: '< 4 hours' },
                { type: 'Complaint Escalations', time: 'Immediate' },
                { type: 'Partnerships', time: '2-3 business days' },
              ].map(item => (
                <div key={item.type} className="flex items-center justify-between py-2 border-b border-saffron-100 dark:border-saffron-700/20 last:border-0">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.type}</span>
                  <span className="text-sm font-semibold text-saffron-600 dark:text-saffron-400">{item.time}</span>
                </div>
              ))}
            </Card>

            <Card padding="lg">
              <h3 className="font-display font-bold text-gray-900 dark:text-white mb-3">State Offices</h3>
              {['Maharashtra — Mumbai', 'Delhi — Connaught Place', 'Karnataka — Bangalore', 'Tamil Nadu — Chennai'].map(office => (
                <div key={office} className="flex items-center gap-2 py-2 border-b border-gray-100 dark:border-dark-border last:border-0 text-sm text-gray-600 dark:text-gray-400">
                  <HiLocationMarker className="w-4 h-4 text-saffron-500 flex-shrink-0" />
                  {office}
                </div>
              ))}
            </Card>

            <Card padding="lg" className="text-center">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Try AI Chat First!</h3>
              <p className="text-sm text-gray-500 mb-4">Get instant answers from our AI before contacting support.</p>
              <Button variant="outline" size="sm" fullWidth onClick={() => navigate('/chat')}>Open AI Chat</Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
