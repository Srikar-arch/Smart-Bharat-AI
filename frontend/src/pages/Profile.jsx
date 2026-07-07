import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiUser, HiMail, HiPhone, HiLocationMarker, HiPencil,
  HiShieldCheck, HiDocumentText, HiStar, HiCamera
} from 'react-icons/hi';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';

const LANG_MAP = {
  en: 'English',
  hi: 'Hindi',
  te: 'Telugu',
  ta: 'Tamil',
  kn: 'Kannada',
  ml: 'Malayalam',
  gu: 'Gujarati',
  pa: 'Punjabi',
  mr: 'Marathi',
  bn: 'Bengali'
};

const REVERSE_LANG_MAP = {
  'English': 'en',
  'Hindi': 'hi',
  'Telugu': 'te',
  'Tamil': 'ta',
  'Kannada': 'kn',
  'Malayalam': 'ml',
  'Gujarati': 'gu',
  'Punjabi': 'pa',
  'Marathi': 'mr',
  'Bengali': 'bn'
};

const STATES = ['Maharashtra', 'Uttar Pradesh', 'Rajasthan', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Bihar', 'West Bengal', 'Madhya Pradesh', 'Andhra Pradesh'];

const Profile = () => {
  const { user, signOut } = useAuth();
  const { success, info, warning } = useNotification();
  const { lang, setLang } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [form, setForm] = useState({
    displayName: user?.displayName || 'Arjun Sharma',
    email: user?.email || 'arjun@example.com',
    phone: user?.phoneNumber || '+91 98765 43210',
    state: user?.state || 'Maharashtra',
    district: user?.district || 'Pune',
    aadhaar: '****-****-1234',
    category: 'General',
    language: LANG_MAP[lang] || 'English',
  });

  const handleSave = () => {
    setEditing(false);
    success('Profile updated successfully!');
  };

  const handleSecurityAction = (action) => {
    if (action === 'Enable 2FA' || action === 'Disable 2FA') {
      const nextState = !twoFactorEnabled;
      setTwoFactorEnabled(nextState);
      if (nextState) {
        success('Two-factor authentication has been enabled for your account!');
      } else {
        warning('Two-factor authentication has been disabled.');
      }
    } else if (action === 'Manage') {
      info('Login Alerts configured: Email alerts are enabled for unrecognized devices.');
    } else if (action === 'View All') {
      info('Active Sessions: Pune, Maharashtra (Current Session) - Safari/macOS');
    }
  };

  const TABS = ['profile', 'activity', 'security', 'settings'];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader title="My Profile" subtitle="Manage your account and preferences" icon={HiUser} />

        {/* Profile hero */}
        <Card className="mb-6 overflow-hidden" padding="none">
          <div className="h-32 bg-gradient-to-r from-saffron-500 via-orange-400 to-navy-900 relative">
            <div className="absolute inset-0 bg-hero-pattern opacity-20" />
          </div>
          <div className="px-6 pb-6 -mt-14 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-4">
              <div className="relative">
                <Avatar name={form.displayName} size="2xl" className="ring-4 ring-white dark:ring-dark-card" />
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-saffron-500 rounded-full flex items-center justify-center shadow-lg hover:bg-saffron-600 transition-colors">
                  <HiCamera className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{form.displayName}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{form.email}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="green" dot>Verified Account</Badge>
                  <Badge variant="navy" size="xs">{form.category}</Badge>
                  <Badge variant="saffron" size="xs">🇮🇳 {form.state}</Badge>
                </div>
              </div>
              <Button
                variant={editing ? 'success' : 'outline'}
                size="sm"
                icon={editing ? undefined : <HiPencil />}
                onClick={editing ? handleSave : () => setEditing(true)}
              >
                {editing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-dark-border">
              {[
                { label: 'Complaints Filed', value: '4', icon: '📢' },
                { label: 'Schemes Applied', value: '2', icon: '📋' },
                { label: 'Notices Read', value: '12', icon: '📰' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl">{s.icon}</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-dark-card rounded-2xl p-1 mb-6">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize ${
                activeTab === tab
                  ? 'bg-white dark:bg-gray-800 text-saffron-500 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card padding="lg">
                <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <HiUser className="w-5 h-5 text-saffron-500" /> Personal Info
                </h3>
                <div className="space-y-4">
                  <Input label="Full Name" value={form.displayName} onChange={e => setForm(f => ({...f, displayName: e.target.value}))} disabled={!editing} icon={<HiUser className="w-4 h-4" />} />
                  <Input label="Email" value={form.email} type="email" onChange={e => setForm(f => ({...f, email: e.target.value}))} disabled={!editing} icon={<HiMail className="w-4 h-4" />} />
                  <Input label="Phone" value={form.phone} type="tel" onChange={e => setForm(f => ({...f, phone: e.target.value}))} disabled={!editing} icon={<HiPhone className="w-4 h-4" />} />
                </div>
              </Card>

              <Card padding="lg">
                <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <HiLocationMarker className="w-5 h-5 text-saffron-500" /> Location & Category
                </h3>
                <div className="space-y-4">
                  <Input.Select label="State" value={form.state} onChange={e => setForm(f => ({...f, state: e.target.value}))} disabled={!editing}>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </Input.Select>
                  <Input label="District" value={form.district} onChange={e => setForm(f => ({...f, district: e.target.value}))} disabled={!editing} />
                  <Input.Select label="Social Category" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} disabled={!editing}>
                    {['General', 'OBC', 'SC', 'ST', 'EWS'].map(c => <option key={c}>{c}</option>)}
                  </Input.Select>
                </div>
              </Card>

              <Card padding="lg" className="md:col-span-2">
                <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <HiDocumentText className="w-5 h-5 text-saffron-500" /> Government ID
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input label="Aadhaar (masked)" value={form.aadhaar} disabled icon={<HiShieldCheck className="w-4 h-4" />} />
                    <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                      <HiShieldCheck className="w-3.5 h-3.5" /> Aadhaar Verified
                    </p>
                  </div>
                  <Input label="PAN Card (optional)" placeholder="ABCDE1234F" disabled={!editing} />
                </div>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card padding="lg">
              <h3 className="font-display font-bold text-gray-900 dark:text-white mb-6">Security Settings</h3>
              <div className="space-y-4">
                {[
                  { label: 'Email Verification', desc: 'Your email is verified', status: true, action: null },
                  { label: 'Two-Factor Authentication', desc: twoFactorEnabled ? 'Two-factor authentication is active' : 'Add extra security to your account', status: twoFactorEnabled, action: twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA' },
                  { label: 'Login Alerts', desc: 'Get notified of new sign-ins', status: true, action: 'Manage' },
                  { label: 'Active Sessions', desc: '1 active session', status: null, action: 'View All' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-dark-bg">
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                        {item.label}
                        {item.status === true && <HiShieldCheck className="w-4 h-4 text-green-500" />}
                      </p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    {item.action && (
                      <Button size="xs" variant="outline" onClick={() => handleSecurityAction(item.action)}>{item.action}</Button>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-dark-border">
                <Button variant="danger" onClick={signOut}>Sign Out of All Devices</Button>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card padding="lg">
              <h3 className="font-display font-bold text-gray-900 dark:text-white mb-6">Preferences</h3>
              <div className="space-y-4">
                <Input.Select label="Preferred Language" value={form.language} onChange={e => setForm(f => ({...f, language: e.target.value}))}>
                  {['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi'].map(l => (
                    <option key={l}>{l}</option>
                  ))}
                </Input.Select>

                <div className="space-y-3">
                  {[
                    { label: 'Email Notifications', desc: 'Receive scheme and complaint updates via email', checked: true },
                    { label: 'SMS Alerts', desc: 'Get SMS for important updates', checked: false },
                    { label: 'Scheme Recommendations', desc: 'AI-powered scheme suggestions based on your profile', checked: true },
                  ].map(pref => (
                    <div key={pref.label} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{pref.label}</p>
                        <p className="text-xs text-gray-500">{pref.desc}</p>
                      </div>
                      <div className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${pref.checked ? 'bg-saffron-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${pref.checked ? 'translate-x-6' : 'translate-x-1'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="mt-6" onClick={() => {
                const code = REVERSE_LANG_MAP[form.language] || 'en';
                setLang(code);
                success('Settings saved!');
              }}>Save Settings</Button>
            </Card>
          </motion.div>
        )}

        {activeTab === 'activity' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card padding="lg">
              <h3 className="font-display font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { action: '📢 Complaint Filed', detail: 'Broken road near Main Market', time: '2 days ago', icon: '🛣️' },
                  { action: '📋 Scheme Applied', detail: 'PM Awas Yojana Urban', time: '5 days ago', icon: '🏠' },
                  { action: '🤖 AI Chat', detail: 'Asked about PM-KISAN', time: '1 week ago', icon: '💬' },
                  { action: '📰 Notice Read', detail: 'Aadhaar Amendment 2024', time: '1 week ago', icon: '📄' },
                  { action: '✅ Complaint Resolved', detail: 'Water supply issue resolved', time: '2 weeks ago', icon: '💧' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                    <span className="text-xl">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;
