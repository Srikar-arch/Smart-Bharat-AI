import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiUsers, HiExclamationCircle, HiDocumentText,
  HiChartBar, HiArrowUp, HiArrowDown, HiRefresh, HiSearch,
  HiChevronLeft, HiChevronRight, HiTrash, HiBell, HiDatabase,
  HiShieldCheck, HiPencil
} from 'react-icons/hi';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, ArcElement, Tooltip, Legend, Filler
} from 'chart.js';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/ui/PageHeader';
import Input from '@/components/ui/Input';
import { useNotification } from '@/contexts/NotificationContext';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend, Filler);

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', icon: HiChartBar },
  { label: 'Users', icon: HiUsers },
  { label: 'Complaints', icon: HiExclamationCircle },
  { label: 'Notifications', icon: HiBell },
  { label: 'System Health', icon: HiDatabase },
];

const DEPARTMENTS = [
  'Public Works Department (PWD)',
  'Water Resources & Sanitation Ministry',
  'Ministry of Power & Energy',
  'Home Affairs & Law Enforcement',
  'Ministry of Agriculture & Farmers Welfare',
  'Ministry of Education',
  'Ministry of Health & Family Welfare',
  'Urban Development & Municipal Council'
];

const AdminPanel = () => {
  const { success, warning, error, info } = useNotification();
  const [activeSection, setActiveSection] = useState('Dashboard');

  // Stats / Dashboard
  const [stats, setStats] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Users Tab
  const [users, setUsers] = useState([]);
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userStateFilter, setUserStateFilter] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);

  // Complaints Tab
  const [complaints, setComplaints] = useState([]);
  const [complaintPage, setComplaintPage] = useState(1);
  const [complaintTotalPages, setComplaintTotalPages] = useState(1);
  const [complaintSearch, setComplaintSearch] = useState('');
  const [complaintStatusFilter, setComplaintStatusFilter] = useState('');
  const [complaintPriorityFilter, setComplaintPriorityFilter] = useState('');
  const [complaintsLoading, setComplaintsLoading] = useState(false);

  // Broadcast Notification Form
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcasting, setBroadcasting] = useState(false);

  // System Health
  const [health, setHealth] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);

  // Recent Activity Log
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  // Export progress
  const [exporting, setExporting] = useState(false);

  // Trigger data fetches based on active section
  useEffect(() => {
    if (activeSection === 'Dashboard') {
      fetchStats();
      fetchRecentUsers();
    } else if (activeSection === 'Users') {
      fetchUsers();
    } else if (activeSection === 'Complaints') {
      fetchComplaints();
    } else if (activeSection === 'System Health') {
      fetchHealth();
      fetchActivities();
    }
  }, [activeSection, userPage, userRoleFilter, userStateFilter, complaintPage, complaintStatusFilter, complaintPriorityFilter]);

  const fetchStats = async () => {
    try {
      setDashboardLoading(true);
      const res = await axios.get('/api/admin/stats');
      setStats(res.data);
    } catch (err) {
      error('Failed to load dashboard analytics');
    } finally {
      setDashboardLoading(false);
    }
  };

  const fetchRecentUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users?limit=5');
      setUsers(res.data.users);
    } catch (err) {}
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await axios.get('/api/admin/users', {
        params: {
          page: userPage,
          limit: 8,
          search: userSearch,
          role: userRoleFilter,
          state: userStateFilter
        }
      });
      setUsers(res.data.users);
      setUserTotalPages(res.data.totalPages);
    } catch (err) {
      error('Failed to load users list');
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchComplaints = async () => {
    try {
      setComplaintsLoading(true);
      const res = await axios.get('/api/admin/complaints', {
        params: {
          page: complaintPage,
          limit: 8,
          search: complaintSearch,
          status: complaintStatusFilter,
          priority: complaintPriorityFilter
        }
      });
      setComplaints(res.data.complaints);
      setComplaintTotalPages(res.data.totalPages);
    } catch (err) {
      error('Failed to load complaints list');
    } finally {
      setComplaintsLoading(false);
    }
  };

  const fetchHealth = async () => {
    try {
      setHealthLoading(true);
      const res = await axios.get('/api/admin/system/health');
      setHealth(res.data);
    } catch (err) {
      error('Failed to load system health metrics');
    } finally {
      setHealthLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      setActivitiesLoading(true);
      const res = await axios.get('/api/admin/activities');
      setActivities(res.data.logs);
    } catch (err) {
      error('Failed to load activity logs');
    } finally {
      setActivitiesLoading(false);
    }
  };

  // Actions
  const handleUserSearchSubmit = (e) => {
    e.preventDefault();
    setUserPage(1);
    fetchUsers();
  };

  const handleComplaintSearchSubmit = (e) => {
    e.preventDefault();
    setComplaintPage(1);
    fetchComplaints();
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
      success('User role updated successfully');
      fetchUsers();
    } catch (err) {
      error('Failed to update user role');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await axios.put(`/api/admin/users/${userId}/status`, { isActive: !currentStatus });
      success(`User account ${!currentStatus ? 'activated' : 'suspended'} successfully`);
      fetchUsers();
    } catch (err) {
      error('Failed to modify user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) return;
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      success('User permanently deleted');
      fetchUsers();
    } catch (err) {
      error('Failed to delete user');
    }
  };

  const handleUpdateComplaintStatus = async (complaintId, newStatus) => {
    try {
      await axios.put(`/api/admin/complaints/${complaintId}/status`, { status: newStatus });
      success('Complaint status updated');
      fetchComplaints();
    } catch (err) {
      error('Failed to update complaint status');
    }
  };

  const handleRouteComplaint = async (complaintId, newDept) => {
    try {
      await axios.put(`/api/admin/complaints/${complaintId}/route`, { department: newDept });
      success('Complaint successfully re-routed');
      fetchComplaints();
    } catch (err) {
      error('Failed to re-route complaint');
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    try {
      setBroadcasting(true);
      await axios.post('/api/admin/notifications/broadcast', {
        title: broadcastTitle,
        message: broadcastMessage
      });
      success('System broadcast notification sent successfully');
      setBroadcastTitle('');
      setBroadcastMessage('');
    } catch (err) {
      error('Failed to publish broadcast notification');
    } finally {
      setBroadcasting(false);
    }
  };

  const handleExportReport = async (format, type) => {
    try {
      setExporting(true);
      info(`Generating report export...`);
      const res = await axios.get('/api/admin/reports/export', {
        params: { format, type },
        responseType: 'blob'
      });
      
      const blob = new Blob([res.data], { type: format === 'csv' ? 'text/csv' : 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `smart-bharat-${type}-report.${format === 'csv' ? 'csv' : 'txt'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      success('Report downloaded successfully!');
    } catch (err) {
      error('Failed to generate report export');
    } finally {
      setExporting(false);
    }
  };

  // Chart Setup Helpers
  const lineData = {
    labels: stats?.charts?.userGrowth?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'New Users',
      data: stats?.charts?.userGrowth?.data || [8000, 12000, 10000, 15000, 18000, 20000, 24000],
      borderColor: '#FF6B35',
      backgroundColor: 'rgba(255,107,53,0.1)',
      fill: true,
      tension: 0.4,
    }]
  };

  const doughnutData = {
    labels: stats?.charts?.usersByState?.labels || ['Maharashtra', 'UP', 'Karnataka', 'Others'],
    datasets: [{
      data: stats?.charts?.usersByState?.data || [28, 22, 18, 32],
      backgroundColor: ['#FF6B35', '#1A237E', '#138808', '#94A3B8', '#00897B'],
      borderWidth: 0,
    }]
  };

  const barData = {
    labels: stats?.charts?.schemeCategoryInterest?.labels || ['Housing', 'Health', 'Agri', 'Education', 'Business', 'Energy'],
    datasets: [{
      label: 'Scheme Interest',
      data: stats?.charts?.schemeCategoryInterest?.data || [450, 380, 320, 280, 200, 150],
      backgroundColor: ['#FF6B35', '#1A237E', '#138808', '#00897B', '#5C6BC0', '#F5A623'],
      borderRadius: 8,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100">
      {/* Admin sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-950 text-white border-r border-white/10">
        <div className="p-5 border-b border-white/10">
          <h1 className="font-display font-bold text-xl flex items-center gap-2">
            <span className="text-gradient-saffron">Smart Bharat</span> AI
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-1">Grievance & Scheme Console</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {SIDEBAR_ITEMS.map(item => {
            const Icon = item.icon;
            const active = activeSection === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveSection(item.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-saffron-500 to-orange-600 text-white shadow-lg shadow-orange-500/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-saffron-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              AD
            </div>
            <div>
              <p className="text-xs font-bold text-white">Smart Bharat Admin</p>
              <p className="text-[10px] text-gray-500">admin@smartbharat.gov.in</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 sm:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-display font-black text-gray-900 dark:text-white tracking-tight">{activeSection}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">System Monitoring & Citizen Administration Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" icon={<HiRefresh />} onClick={() => activeSection === 'Dashboard' ? fetchStats() : activeSection === 'Users' ? fetchUsers() : activeSection === 'Complaints' ? fetchComplaints() : fetchHealth()}>
                Refresh Console
              </Button>
              <Badge variant="green" dot pulse>NIC Node Active</Badge>
            </div>
          </div>

          {/* SECTION: DASHBOARD */}
          {activeSection === 'Dashboard' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Enrolled Citizens', value: stats?.summary?.totalUsers || '...', icon: '👥', color: 'text-blue-600 dark:text-blue-400' },
                  { label: 'Active Civic Complaints', value: stats?.summary?.activeComplaints || '...', icon: '📢', color: 'text-saffron-600 dark:text-saffron-400' },
                  { label: 'Schemes Recommended', value: stats?.summary?.schemesAccessed || '...', icon: '📋', color: 'text-green-600 dark:text-green-400' },
                  { label: 'Gemini AI Inquiries', value: stats?.summary?.aiConversations || '...', icon: '🤖', color: 'text-purple-600 dark:text-purple-400' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Card padding="md" className="hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">{stat.icon}</span>
                        <Badge variant="gray">Live</Badge>
                      </div>
                      <p className={`text-3xl font-display font-black ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{stat.label}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Charts grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2" padding="lg">
                  <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4">Citizen Enrollment growth</h3>
                  {dashboardLoading ? <div className="h-64 flex items-center justify-center">Loading Analytics...</div> : <Line data={lineData} options={chartOptions} height={120} />}
                </Card>
                <Card padding="lg">
                  <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4">Demographics by State</h3>
                  {dashboardLoading ? <div className="h-64 flex items-center justify-center">Loading Demographics...</div> : <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 15 } } } }} />}
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2" padding="lg">
                  <h3 className="font-display font-bold text-gray-900 dark:text-white mb-4">Scheme Domain Search interest</h3>
                  {dashboardLoading ? <div className="h-64 flex items-center justify-center">Loading Search Interest...</div> : <Bar data={barData} options={chartOptions} height={120} />}
                </Card>

                {/* Exporter actions card */}
                <Card padding="lg" className="flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-gray-900 dark:text-white mb-2">Export Data Reports</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Generate full CSV datasets or formatted text reports for administrative auditing.</p>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline" disabled={exporting} onClick={() => handleExportReport('csv', 'users')}>Users CSV</Button>
                      <Button size="sm" variant="outline" disabled={exporting} onClick={() => handleExportReport('pdf', 'users')}>Users TXT</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline" disabled={exporting} onClick={() => handleExportReport('csv', 'complaints')}>Complaints CSV</Button>
                      <Button size="sm" variant="outline" disabled={exporting} onClick={() => handleExportReport('pdf', 'complaints')}>Complaints TXT</Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* SECTION: USERS */}
          {activeSection === 'Users' && (
            <div className="space-y-6">
              {/* Filters & Search */}
              <Card padding="md">
                <form onSubmit={handleUserSearchSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <Input
                      label="Search Citizens"
                      placeholder="Search by name or email..."
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                      icon={<HiSearch />}
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <Input.Select label="Filter Role" value={userRoleFilter} onChange={e => { setUserRoleFilter(e.target.value); setUserPage(1); }}>
                      <option value="">All Roles</option>
                      <option value="user">Citizen (User)</option>
                      <option value="moderator">Moderator</option>
                      <option value="official">Govt Official</option>
                      <option value="admin">Administrator</option>
                    </Input.Select>
                  </div>
                  <div className="w-full md:w-48">
                    <Input.Select label="Filter State" value={userStateFilter} onChange={e => { setUserStateFilter(e.target.value); setUserPage(1); }}>
                      <option value="">All States</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Gujarat">Gujarat</option>
                    </Input.Select>
                  </div>
                  <Button type="submit" variant="saffron" className="w-full md:w-auto">Search</Button>
                </form>
              </Card>

              {/* Users table */}
              <Card padding="none" className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-dark-card border-b border-gray-200 dark:border-dark-border text-xs font-bold text-gray-500 uppercase">
                        <th className="px-6 py-4">Citizen</th>
                        <th className="px-6 py-4">State</th>
                        <th className="px-6 py-4">Role Designation</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-dark-border text-sm">
                      {usersLoading ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Querying registered user profiles...</td>
                        </tr>
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No citizens match the search query parameters.</td>
                        </tr>
                      ) : (
                        users.map(u => (
                          <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-dark-card/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-saffron-400 to-navy-600 flex items-center justify-center text-white font-bold text-xs uppercase">
                                  {u.displayName[0]}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">{u.displayName}</p>
                                  <p className="text-xs text-gray-400">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{u.state || 'N/A'}</td>
                            <td className="px-6 py-4">
                              <select
                                value={u.role}
                                onChange={e => handleUpdateRole(u._id, e.target.value)}
                                className="bg-transparent border border-gray-200 dark:border-dark-border rounded-xl px-2 py-1 text-xs focus:ring-2 focus:ring-saffron-500 dark:bg-dark-card"
                              >
                                <option value="user">Citizen (User)</option>
                                <option value="moderator">Moderator</option>
                                <option value="official">Govt Official</option>
                                <option value="admin">Administrator</option>
                              </select>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant={u.isActive ? 'green' : 'red'}>
                                {u.isActive ? 'Active' : 'Suspended'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="xs" variant={u.isActive ? 'outline' : 'success'} onClick={() => handleToggleStatus(u._id, u.isActive)}>
                                  {u.isActive ? 'Suspend' : 'Activate'}
                                </Button>
                                <Button size="xs" variant="danger" icon={<HiTrash />} onClick={() => handleDeleteUser(u._id)} />
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {userTotalPages > 1 && (
                  <div className="p-4 border-t border-gray-100 dark:border-dark-border flex items-center justify-between">
                    <span className="text-xs text-gray-500">Page {userPage} of {userTotalPages}</span>
                    <div className="flex gap-2">
                      <Button size="xs" variant="outline" icon={<HiChevronLeft />} disabled={userPage === 1} onClick={() => setUserPage(p => Math.max(p - 1, 1))} />
                      <Button size="xs" variant="outline" icon={<HiChevronRight />} disabled={userPage === userTotalPages} onClick={() => setUserPage(p => Math.min(p + 1, userTotalPages))} />
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* SECTION: COMPLAINTS */}
          {activeSection === 'Complaints' && (
            <div className="space-y-6">
              {/* Filters & Search */}
              <Card padding="md">
                <form onSubmit={handleComplaintSearchSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <Input
                      label="Search Grievance Records"
                      placeholder="Search by ID, title, or description..."
                      value={complaintSearch}
                      onChange={e => setComplaintSearch(e.target.value)}
                      icon={<HiSearch />}
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <Input.Select label="Filter Status" value={complaintStatusFilter} onChange={e => { setComplaintStatusFilter(e.target.value); setComplaintPage(1); }}>
                      <option value="">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </Input.Select>
                  </div>
                  <div className="w-full md:w-48">
                    <Input.Select label="Filter Priority" value={complaintPriorityFilter} onChange={e => { setComplaintPriorityFilter(e.target.value); setComplaintPage(1); }}>
                      <option value="">All Priorities</option>
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="critical">Critical Priority</option>
                    </Input.Select>
                  </div>
                  <Button type="submit" variant="saffron" className="w-full md:w-auto">Search</Button>
                </form>
              </Card>

              {/* Complaints Table */}
              <Card padding="none" className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-dark-card border-b border-gray-200 dark:border-dark-border text-xs font-bold text-gray-500 uppercase">
                        <th className="px-6 py-4">Grievance ID</th>
                        <th className="px-6 py-4">Title & Details</th>
                        <th className="px-6 py-4">Assigned Department</th>
                        <th className="px-6 py-4">Routing / Resolution Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-dark-border text-sm">
                      {complaintsLoading ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-8 text-center text-gray-500">Querying filed civic records...</td>
                        </tr>
                      ) : complaints.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No grievances match the search parameters.</td>
                        </tr>
                      ) : (
                        complaints.map(c => (
                          <tr key={c._id} className="hover:bg-gray-50 dark:hover:bg-dark-card/30 transition-colors">
                            <td className="px-6 py-4 font-mono font-bold text-saffron-600 dark:text-saffron-400">
                              {c.complaintId || `SB-${c._id.substring(0, 6).toUpperCase()}`}
                            </td>
                            <td className="px-6 py-4 max-w-xs">
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white truncate">{c.title}</p>
                                <p className="text-xs text-gray-400 truncate">{c.issueDescription}</p>
                                <div className="flex gap-2 mt-1.5">
                                  <Badge variant={c.priority === 'critical' || c.priority === 'high' ? 'red' : 'gray'} size="xs">
                                    {c.priority}
                                  </Badge>
                                  <Badge variant={c.status === 'Resolved' ? 'green' : c.status === 'Rejected' ? 'red' : 'saffron'} size="xs">
                                    {c.status}
                                  </Badge>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={c.department || ''}
                                onChange={e => handleRouteComplaint(c._id, e.target.value)}
                                className="bg-transparent border border-gray-200 dark:border-dark-border rounded-xl px-2 py-1 text-xs max-w-xs focus:ring-2 focus:ring-saffron-500 dark:bg-dark-card"
                              >
                                <option value="">Unassigned</option>
                                {DEPARTMENTS.map(d => (
                                  <option key={d} value={d}>{d}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={c.status}
                                onChange={e => handleUpdateComplaintStatus(c._id, e.target.value)}
                                className="bg-transparent border border-gray-200 dark:border-dark-border rounded-xl px-2 py-1 text-xs focus:ring-2 focus:ring-saffron-500 dark:bg-dark-card font-semibold"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Assigned">Assigned</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {complaintTotalPages > 1 && (
                  <div className="p-4 border-t border-gray-100 dark:border-dark-border flex items-center justify-between">
                    <span className="text-xs text-gray-500">Page {complaintPage} of {complaintTotalPages}</span>
                    <div className="flex gap-2">
                      <Button size="xs" variant="outline" icon={<HiChevronLeft />} disabled={complaintPage === 1} onClick={() => setComplaintPage(p => Math.max(p - 1, 1))} />
                      <Button size="xs" variant="outline" icon={<HiChevronRight />} disabled={complaintPage === complaintTotalPages} onClick={() => setComplaintPage(p => Math.min(p + 1, complaintTotalPages))} />
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* SECTION: NOTIFICATIONS */}
          {activeSection === 'Notifications' && (
            <Card padding="lg" className="max-w-2xl mx-auto">
              <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-2">Publish System Alert Notification</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Send an announcements broadcast or emergency warning notice to all registered users instantly.</p>
              
              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <Input
                  label="Broadcast Title"
                  placeholder="e.g. Server Maintenance Notice or PM-KISAN Release Dates"
                  value={broadcastTitle}
                  onChange={e => setBroadcastTitle(e.target.value)}
                  required
                />
                
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Notification message body</label>
                  <textarea
                    rows={4}
                    value={broadcastMessage}
                    onChange={e => setBroadcastMessage(e.target.value)}
                    placeholder="Provide detailed description of the alert notification to show to all users..."
                    className="w-full rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 dark:text-white"
                    required
                  />
                </div>
                
                <Button type="submit" variant="saffron" className="w-full" disabled={broadcasting}>
                  {broadcasting ? 'Broadcasting Notice...' : 'Send Bulk Notification Broadcast'}
                </Button>
              </form>
            </Card>
          )}

          {/* SECTION: SYSTEM HEALTH */}
          {activeSection === 'System Health' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Metrics */}
              <div className="lg:col-span-2 space-y-6">
                <Card padding="lg">
                  <h3 className="font-display font-bold text-gray-900 dark:text-white mb-6">CPU & Memory Performance Meters</h3>
                  {healthLoading ? (
                    <div className="py-8 text-center text-gray-500">Querying systems host dashboard metrics...</div>
                  ) : (
                    <div className="space-y-6">
                      {/* CPU */}
                      <div>
                        <div className="flex justify-between text-sm font-semibold mb-2">
                          <span>CPU Processing load</span>
                          <span className={health?.cpu > 80 ? 'text-red-500' : 'text-green-500'}>{health?.cpu}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-3 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${health?.cpu > 80 ? 'bg-red-500' : 'bg-saffron-500'}`} style={{ width: `${health?.cpu}%` }} />
                        </div>
                      </div>
                      
                      {/* RAM */}
                      <div>
                        <div className="flex justify-between text-sm font-semibold mb-2">
                          <span>System Memory (RAM) utilization</span>
                          <span className={health?.ram > 80 ? 'text-red-500' : 'text-green-500'}>{health?.ram}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-3 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${health?.ram}%` }} />
                        </div>
                      </div>
                      
                      {/* Stats grid */}
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-dark-border">
                        <div>
                          <p className="text-xs text-gray-400">Database Connection</p>
                          <p className="text-sm font-bold text-green-500 flex items-center gap-1.5 mt-0.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500" /> {health?.database}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Database Latency Ping</p>
                          <p className="text-sm font-bold text-gray-800 dark:text-white mt-0.5">{health?.dbPing}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Average API Node Response</p>
                          <p className="text-sm font-bold text-gray-800 dark:text-white mt-0.5">{health?.apiLatency}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Server Host Node Uptime</p>
                          <p className="text-sm font-bold text-gray-800 dark:text-white mt-0.5">{health?.uptime}s</p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              {/* Audit Activity Log */}
              <Card padding="none" className="overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-dark-border">
                  <h3 className="font-display font-bold text-gray-900 dark:text-white">Admin Activity Audit Logs</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Chronological system events and operations</p>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-dark-border max-h-[400px] overflow-y-auto">
                  {activitiesLoading ? (
                    <div className="p-6 text-center text-gray-500 text-sm">Querying audit trail history...</div>
                  ) : activities.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm">No activity logs recorded.</div>
                  ) : (
                    activities.map((act, i) => (
                      <div key={i} className="p-4 text-xs">
                        <div className="flex justify-between items-start gap-3 mb-1">
                          <span className="font-bold text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-dark-card px-1.5 py-0.5 rounded">
                            {act.action}
                          </span>
                          <span className="text-[10px] text-gray-400">{new Date(act.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-1.5">{act.details}</p>
                        <p className="text-[10px] text-gray-400 flex items-center gap-1">
                          <HiShieldCheck className="w-3.5 h-3.5 text-blue-500" /> By: {act.performedBy?.displayName || act.performedBy?.email || 'System'}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
