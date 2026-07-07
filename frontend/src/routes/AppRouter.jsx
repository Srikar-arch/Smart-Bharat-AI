import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute, AdminRoute, PublicOnlyRoute } from './ProtectedRoute';
import Loader from '@/components/ui/Loader';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import VoiceAssistant from '@/components/ui/VoiceAssistant';

// Lazy loaded pages
const Home = lazy(() => import('@/pages/Home'));
const Chat = lazy(() => import('@/pages/Chat'));
const Schemes = lazy(() => import('@/pages/Schemes'));
const Documents = lazy(() => import('@/pages/Documents'));
const ComplaintNew = lazy(() => import('@/pages/ComplaintNew'));
const ComplaintDashboard = lazy(() => import('@/pages/ComplaintDashboard'));
const NoticeSummarizer = lazy(() => import('@/pages/NoticeSummarizer'));
const NearbyOffices = lazy(() => import('@/pages/NearbyOffices'));
const Profile = lazy(() => import('@/pages/Profile'));
const Notifications = lazy(() => import('@/pages/Notifications'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const AdminPanel = lazy(() => import('@/pages/AdminPanel'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader size="lg" variant="dots" text="Loading page..." />
  </div>
);

// Layout that includes sidebar for dashboard-style pages
const DashboardLayout = ({ children, sidebarOpen, onSidebarToggle }) => (
  <div className="flex min-h-screen bg-gray-50 dark:bg-dark-bg">
    <Sidebar open={sidebarOpen} onClose={onSidebarToggle} />
    <main className="flex-1 min-w-0 overflow-x-hidden">
      {children}
    </main>
  </div>
);

// Full-page layout (Home, Landing pages)
const FullLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-white dark:bg-dark-bg">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

const AppRouter = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(p => !p);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Full layout routes (home, marketing) */}
          <Route path="/" element={
            <FullLayout>
              <Home />
            </FullLayout>
          } />
          <Route path="/about" element={
            <FullLayout>
              <About />
            </FullLayout>
          } />
          <Route path="/contact" element={
            <FullLayout>
              <Contact />
            </FullLayout>
          } />

          {/* Auth routes */}
          <Route path="/login" element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          } />
          <Route path="/register" element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          } />

          {/* App routes with Navbar */}
          <Route path="/chat" element={
            <ProtectedRoute>
              <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-bg">
                <Navbar />
                <main className="flex-1">
                  <Chat />
                </main>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/schemes" element={
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-bg">
              <Navbar />
              <main className="flex-1"><Schemes /></main>
              <Footer />
            </div>
          } />
          <Route path="/documents" element={
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-bg">
              <Navbar />
              <main className="flex-1"><Documents /></main>
              <Footer />
            </div>
          } />
          <Route path="/notices" element={
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-bg">
              <Navbar />
              <main className="flex-1"><NoticeSummarizer /></main>
              <Footer />
            </div>
          } />
          <Route path="/offices" element={
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-bg">
              <Navbar />
              <main className="flex-1"><NearbyOffices /></main>
              <Footer />
            </div>
          } />

          {/* Protected routes */}
          <Route path="/complaints/new" element={
            <ProtectedRoute>
              <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-bg">
                <Navbar />
                <main className="flex-1"><ComplaintNew /></main>
                <Footer />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/complaints" element={
            <ProtectedRoute>
              <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-bg">
                <Navbar />
                <main className="flex-1"><ComplaintDashboard /></main>
                <Footer />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-bg">
                <Navbar />
                <main className="flex-1"><Profile /></main>
                <Footer />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-bg">
                <Navbar />
                <main className="flex-1"><Notifications /></main>
                <Footer />
              </div>
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin/*" element={
            <AdminRoute>
              <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-bg">
                <Navbar />
                <main className="flex-1"><AdminPanel /></main>
              </div>
            </AdminRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <VoiceAssistant />
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
