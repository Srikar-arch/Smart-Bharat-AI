import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HiExclamationCircle, HiPlus, HiSearch, HiRefresh,
  HiEye, HiClipboardCopy, HiDownload, HiX, HiCheckCircle, HiShare
} from 'react-icons/hi';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend
} from 'chart.js';
import axios from 'axios';
import Skeleton from '@/components/ui/Skeleton';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const PRIORITY_COLORS = {
  low: 'text-gray-500 bg-gray-50 dark:bg-gray-500/10 px-2 py-0.5 rounded-lg border border-gray-200/50',
  medium: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10 px-2 py-0.5 rounded-lg border border-yellow-200/50',
  high: 'text-orange-600 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-lg border border-orange-200/50',
  urgent: 'text-red-600 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-lg border border-red-200/50',
};

const ComplaintDashboard = () => {
  const { user } = useAuth();
  const { success, info } = useNotification();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Load complaints
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/complaints?limit=100');
      if (res.data && res.data.complaints) {
        setComplaints(res.data.complaints);
      }
    } catch (err) {
      console.warn("Failed to load complaints from DB. Loading local sample cases.");
      // Fallback
      setComplaints([
        {
          _id: '1',
          complaintId: 'SB-2026-0042',
          title: 'Broken road causing accidents near Main Market',
          description: 'A massive pothole has opened up on MG Road. Several two-wheelers have slipped here in the last 3 days.',
          category: 'road',
          status: 'in-progress',
          priority: 'high',
          createdAt: '2026-07-01T10:00:00Z',
          location: { address: 'MG Road, Pune, Maharashtra', state: 'Maharashtra', district: 'Pune', pincode: '411001' },
          authority: { department: 'Municipal Roads Department', name: 'Chief Works Officer' },
          aiSummary: 'A hazardous pothole on MG Road is causing multiple two-wheeler accidents and requires immediate patching.',
          aiDraft: `Subject: Formal Grievance regarding dangerous pothole on MG Road\n\nDear Municipal Works Department,\n\nI am writing to draw your urgent attention to a severe road hazard located on MG Road. There is a deep pothole that has caused multiple accidents. Kindly repair it immediately to prevent further incidents.\n\nSincerely,\nBala Srikar`,
          updates: [
            { status: 'pending', message: 'Complaint registered successfully', updatedBy: 'System', timestamp: '2026-07-01T10:00:00Z' },
            { status: 'assigned', message: 'Grievance assigned to Municipal Roads Division', updatedBy: 'System', timestamp: '2026-07-02T14:30:00Z' },
            { status: 'in-progress', message: 'Inspection completed, road repair crew dispatched', updatedBy: 'PMC Officer', timestamp: '2026-07-05T09:15:00Z' }
          ]
        },
        {
          _id: '2',
          complaintId: 'SB-2026-0039',
          title: 'No water supply for 5 days in Sector 12',
          description: 'Main water pipe leak near local water tank has cut off household water supply for 5 consecutive days.',
          category: 'water',
          status: 'resolved',
          priority: 'urgent',
          createdAt: '2026-06-28T08:00:00Z',
          location: { address: 'Sector 12, Noida, UP', state: 'Uttar Pradesh', district: 'Gautam Buddha Nagar', pincode: '201301' },
          authority: { department: 'Noida Water Supply and Sewerage Board', name: 'Zonal Inspector' },
          aiSummary: 'Main distribution line pipeline burst has disrupted local water access for Noida Sector 12 families.',
          aiDraft: `Dear Zonal Authority,\n\nThis is a formal report concerning water supply disruption in Sector 12. Kindly repair the pipeline leak immediately.\n\nRegards,\nCitizen`,
          updates: [
            { status: 'pending', message: 'Complaint filed successfully', updatedBy: 'System', timestamp: '2026-06-28T08:00:00Z' },
            { status: 'resolved', message: 'Leak repaired, main valves restarted. Supply restored.', updatedBy: 'Noida Board', timestamp: '2026-07-03T11:00:00Z' }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Compute stats
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'in-progress' || c.status === 'open').length;
  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;

  const filtered = complaints.filter(c => {
    const matchSearch = !search || c.title?.toLowerCase().includes(search.toLowerCase()) || c.complaintId?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Calculate dynamic charts
  const categoryCounts = complaints.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});

  const barChartLabels = Object.keys(categoryCounts).map(cat => cat.toUpperCase());
  const barChartDataValues = Object.values(categoryCounts);

  const chartData = {
    labels: barChartLabels.length > 0 ? barChartLabels : ['ROAD', 'WATER', 'GARBAGE', 'ELECTRICITY'],
    datasets: [{
      label: 'Complaints',
      data: barChartDataValues.length > 0 ? barChartDataValues : [2, 1, 1, 0],
      backgroundColor: 'rgba(255,107,53,0.8)',
      borderRadius: 12,
    }]
  };

  const doughnutData = {
    labels: ['Resolved', 'In Progress', 'Pending'],
    datasets: [{
      data: [resolvedCount || 1, inProgressCount || 1, pendingCount || 1],
      backgroundColor: ['#22c55e', '#3b82f6', '#eab308'],
      borderWidth: 0,
    }]
  };

  // Export receipt print trigger
  const printReceipt = (complaint) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Smart Bharat AI — Complaint Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .receipt-card { border: 2px solid #FF6B35; border-radius: 12px; padding: 25px; }
            h2 { color: #1A237E; margin-top: 0; }
            .meta { font-size: 13px; color: #666; margin-bottom: 20px; }
            .section { margin-top: 15px; }
            .section strong { display: block; color: #1A237E; }
          </style>
        </head>
        <body>
          <div class="receipt-card">
            <h2>CIVIC COMPLAINT REGISTRATION RECEIPT</h2>
            <div class="meta">
              <p><strong>Complaint ID:</strong> ${complaint.complaintId}</p>
              <p><strong>Date Filed:</strong> ${new Date(complaint.createdAt).toLocaleDateString()}</p>
              <p><strong>Priority:</strong> ${complaint.priority.toUpperCase()}</p>
              <p><strong>Current Status:</strong> ${complaint.status.toUpperCase()}</p>
            </div>
            <div class="section">
              <strong>Assigned Authority:</strong>
              <p>${complaint.authority?.department || 'Concerned Local Municipality Office'}</p>
            </div>
            <div class="section">
              <strong>Complaint Title:</strong>
              <p>${complaint.title}</p>
            </div>
            <div class="section">
              <strong>AI Summary:</strong>
              <p>${complaint.aiSummary || 'Summary pending'}</p>
            </div>
            <div class="section">
              <strong>Formal Draft Document:</strong>
              <pre style="white-space: pre-wrap; font-family: sans-serif; background: #f9f9f9; padding: 15px; border-radius: 8px;">${complaint.aiDraft || ''}</pre>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const copyShareLink = (id) => {
    const link = `${window.location.origin}/complaints/${id}`;
    navigator.clipboard.writeText(link);
    success("Shareable grievance link copied to clipboard!");
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Citizen Complaint Center"
          subtitle="Register civic grievances and track resolution timelines with AI routing"
          icon={HiExclamationCircle}
          actions={
            <Link to="/complaints/new">
              <Button icon={<HiPlus />}>File a Complaint</Button>
            </Link>
          }
        />

        {/* Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Grievances', value: totalCount, icon: '📋', bg: 'from-navy-50 to-navy-100' },
            { label: 'In Progress', value: inProgressCount, icon: '🔄', bg: 'from-saffron-50 to-saffron-100' },
            { label: 'Resolved', value: resolvedCount, icon: '✅', bg: 'from-green-50 to-green-100' },
            { label: 'Pending Action', value: pendingCount, icon: '⏳', bg: 'from-yellow-50 to-yellow-100' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-3xl font-display font-black text-gray-900 dark:text-white">{item.value}</p>
                <p className="text-xs text-gray-500 font-semibold mt-1">{item.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2" padding="lg">
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-base mb-4">Grievance Hotspots by Category</h3>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} height={100} />
          </Card>
          <Card padding="lg">
            <h3 className="font-display font-bold text-gray-900 dark:text-white text-base mb-4">Resolution Status Breakdown</h3>
            <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          </Card>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              icon={<HiSearch className="w-4 h-4" />}
              placeholder="Search by title or SB-2026-XXXX ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              clearable
            />
          </div>
          <div className="flex gap-2 items-center overflow-x-auto pb-1">
            {['all', 'pending', 'in-progress', 'resolved', 'rejected'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all border whitespace-nowrap ${
                  statusFilter === s
                    ? 'bg-saffron-500 text-white border-saffron-500 shadow-sm'
                    : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400'
                }`}
              >
                {s === 'all' ? 'All Complaints' : s.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Table representation */}
        <Card padding="none" className="overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-6">
              <Skeleton.List />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-bg text-left">
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Complaint</th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Filed On</th>
                    <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                  {filtered.map((c, i) => (
                    <tr key={c._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">
                            {c.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 capitalize">📁 {c.category} • 📍 {c.location?.address}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <code className="text-xs font-mono bg-gray-100 dark:bg-dark-bg px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300">
                          {c.complaintId}
                        </code>
                      </td>
                      <td className="px-4 py-4">
                        <Badge.Status status={c.status} />
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-bold uppercase ${PRIORITY_COLORS[c.priority] || 'text-gray-500'}`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-500">
                        {new Date(c.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedComplaint(c)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-saffron-500 transition-colors"
                            title="Inspect Timeline & AI details"
                          >
                            <HiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => copyShareLink(c.complaintId)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-navy-500 transition-colors"
                            title="Share"
                          >
                            <HiShare className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                        No registered complaints matching selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Detailed Timeline and AI summary Modal */}
        <AnimatePresence>
          {selectedComplaint && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-white dark:bg-dark-card rounded-3xl overflow-hidden border border-gray-100 dark:border-dark-border shadow-2xl"
              >
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-saffron-500 to-orange-500 text-white flex justify-between items-center">
                  <div>
                    <h3 className="font-display font-bold text-base leading-none">Grievance Investigation</h3>
                    <span className="text-xs opacity-90 mt-1 inline-block">ID: {selectedComplaint.complaintId}</span>
                  </div>
                  <button onClick={() => setSelectedComplaint(null)} className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors">
                    <HiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
                  {/* Title & category */}
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-saffron-100 text-saffron-700 px-2.5 py-1 rounded-full dark:bg-saffron-500/10 dark:text-saffron-300">
                      Category: {selectedComplaint.category}
                    </span>
                    <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white mt-2">
                      {selectedComplaint.title}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">📍 Location: {selectedComplaint.location?.address}</p>
                  </div>

                  {/* AI Summary Banner */}
                  <div className="p-4 bg-navy-50/50 dark:bg-navy-950/20 border border-navy-100 dark:border-navy-900/30 rounded-2xl">
                    <h4 className="text-xs font-bold text-navy-800 dark:text-navy-300 uppercase tracking-wide flex items-center gap-1.5">
                      🤖 Smart Bharat AI Summary
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">
                      {selectedComplaint.aiSummary || 'Summary processing pending.'}
                    </p>
                  </div>

                  {/* Progress timeline */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Grievance Timeline & Progress</h4>
                    
                    {/* Progress Bar Line */}
                    <div className="relative border-l-2 border-gray-200 dark:border-dark-border pl-6 ml-2 space-y-6">
                      {(selectedComplaint.updates || []).map((u, index) => (
                        <div key={index} className="relative">
                          <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-saffron-500 ring-4 ring-saffron-100 dark:ring-saffron-950/30 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          </span>
                          <div>
                            <span className="text-[10px] font-bold uppercase text-saffron-500">
                              {u.status}
                            </span>
                            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                              {u.message}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              Updated by: {u.updatedBy} • {new Date(u.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Generated Letter Draft */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">AI-Generated Professional Complaint Draft</h4>
                    <pre className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-dark-bg p-4 rounded-xl border border-gray-100 dark:border-dark-border whitespace-pre-wrap font-sans">
                      {selectedComplaint.aiDraft || 'No draft available.'}
                    </pre>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-dark-bg border-t border-gray-100 dark:border-dark-border flex justify-end gap-3">
                  <Button onClick={() => printReceipt(selectedComplaint)} variant="outline" size="sm" icon={<HiDownload />}>
                    Download Receipt PDF
                  </Button>
                  <Button onClick={() => setSelectedComplaint(null)} size="sm">
                    Dismiss
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default ComplaintDashboard;
