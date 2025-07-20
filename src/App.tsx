import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { OnboardingProvider, useOnboarding } from './context/OnboardingContext';
import { Login } from './pages/Login';
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './components/layout/AdminLayout';
import { UserLayout } from './components/layout/UserLayout';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { Dashboard } from './pages/Dashboard';
import { Registries } from './pages/Registries';
import { Services } from './pages/Services';
import { Requests } from './pages/Requests';
import { Users } from './pages/Users';
import { ApiValidation } from './pages/ApiValidation';
import { DocumentTemplates } from './pages/DocumentTemplates';
import { Settings } from './pages/admin/Settings';
import { InstitutionSettings } from './pages/InstitutionSettings';
import { Courses } from './pages/Courses';

// User Pages
import { UserDashboard } from './pages/user/UserDashboard';
import { UserVerifications } from './pages/user/UserVerifications';
import { UserProfile } from './pages/user/UserProfile';
import { UserHelp } from './pages/user/UserHelp';
import UserSettings from './pages/user/Settings';

// New Verification System Pages
import { DocumentVerification } from './pages/DocumentVerification';
import { FraudPrevention } from './pages/FraudPrevention';
import { VerificationReports } from './pages/VerificationReports';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { InstitutionsManagement } from './pages/admin/InstitutionsManagement';
import { RequestMonitoring } from './pages/admin/RequestMonitoring';
import { SystemAnalytics } from './pages/admin/SystemAnalytics';
import { GlobalTemplates } from './pages/admin/GlobalTemplates';
import { Payments } from './pages/admin/Payments';
import { Help } from './pages/admin/Help';
import { BacCheckerInstitutions } from './pages/admin/BacCheckerInstitutions';
import PaymentsBaccheckerAdmin from './pages/admin/PaymentsBaccheckerAdmin';
import PaymentsGTECAdmin from './pages/admin/PaymentsGTECAdmin';
import GlobalTemplatesBaccheckerAdmin from './pages/admin/GlobalTemplatesBaccheckerAdmin';
import GlobalTemplatesGTECAdmin from './pages/admin/GlobalTemplatesGTECAdmin';
import SettingsBaccheckerAdmin from './pages/admin/SettingsBaccheckerAdmin';
import SettingsGTECAdmin from './pages/admin/SettingsGTECAdmin';
import { TertiaryOnboarding } from './pages/TertiaryOnboarding';
import { PublicPortal } from './pages/PublicPortal';

// Placeholder components for other routes
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-8 text-center">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
    <p className="text-gray-600">This page is under development. Full functionality coming soon.</p>
  </div>
);

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { state } = useAuth();
  
  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && state.user && !allowedRoles.includes(state.user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
}

// Admin Routes Component
function AdminRoutes() {
  const { state } = useAuth();
  const user = state.user;

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route
          path="/institutions"
          element={
            user?.role === 'bacchecker_admin'
              ? <BacCheckerInstitutions />
              : <InstitutionsManagement />
          }
        />
        <Route path="/requests" element={<RequestMonitoring />} />
        <Route path="/analytics" element={<SystemAnalytics />} />
        <Route path="/verification" element={<DocumentVerification />} />
        <Route path="/fraud-prevention" element={<FraudPrevention />} />
        <Route path="/verification-reports" element={<VerificationReports />} />
        <Route path="/templates" element={
          user?.role === 'bacchecker_admin'
            ? <GlobalTemplatesBaccheckerAdmin />
            : user?.role === 'gtec_admin'
              ? <GlobalTemplatesGTECAdmin />
              : <GlobalTemplates />
        } />
        <Route path="/payments" element={
          user?.role === 'bacchecker_admin'
            ? <PaymentsBaccheckerAdmin />
            : user?.role === 'gtec_admin'
              ? <PaymentsGTECAdmin />
              : <Payments />
        } />
        <Route path="/help" element={<Help />} />
        <Route path="/settings" element={
          user?.role === 'bacchecker_admin'
            ? <SettingsBaccheckerAdmin />
            : user?.role === 'gtec_admin'
              ? <SettingsGTECAdmin />
              : <Settings />
        } />
      </Routes>
    </AdminLayout>
  );
}

// User Routes Component
function UserRoutes() {
  return (
    <UserLayout>
      <Routes>
        <Route path="/" element={<UserDashboard />} />
        <Route path="/verifications" element={<UserVerifications />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/help" element={<UserHelp />} />
        <Route path="/settings" element={<UserSettings />} />
      </Routes>
    </UserLayout>
  );
}

// Institution Routes Component
function InstitutionRoutes() {
  return <InstitutionApp />;
}

function InstitutionApp() {
  const { state } = useOnboarding();
  const { state: authState } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    // Check if onboarding was completed for this institution
    if (authState.user?.institutionId) {
      const onboardingKey = `onboarding_completed_${authState.user.institutionId}`;
      const onboardingCompleted = localStorage.getItem(onboardingKey);
      if (onboardingCompleted === 'true' || state.isComplete) {
        setShowOnboarding(false);
      }
    }
  }, [state.isComplete, authState.user?.institutionId]);

  useEffect(() => {
    // Save onboarding completion status for this institution
    if (state.isComplete && authState.user?.institutionId) {
      const onboardingKey = `onboarding_completed_${authState.user.institutionId}`;
      localStorage.setItem(onboardingKey, 'true');
      setShowOnboarding(false);
    }
  }, [state.isComplete, authState.user?.institutionId]);

  if (showOnboarding && !state.isComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <OnboardingWizard />
        {/* Demo skip button for testing */}
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => {
              if (authState.user?.institutionId) {
                const onboardingKey = `onboarding_completed_${authState.user.institutionId}`;
                localStorage.setItem(onboardingKey, 'true');
                setShowOnboarding(false);
              }
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors text-sm"
          >
            Skip to Dashboard (Demo)
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/institutions" element={<InstitutionsManagement />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/templates" element={<DocumentTemplates />} />
        <Route path="/users" element={<Users />} />
        <Route path="/api" element={<ApiValidation />} />
        <Route path="/analytics" element={<PlaceholderPage title="Analytics Dashboard" />} />
        <Route path="/settings" element={<InstitutionSettings />} />
        <Route path="/help" element={<UserHelp />} />
      </Routes>
    </Layout>
  );
}

// Main App Content
function AppContent() {
  const { state } = useAuth();

  if (!state.isAuthenticated) {
    return <Login />;
  }

  // Route based on user role
  if (state.user?.role === 'bacchecker_admin' || state.user?.role === 'gtec_admin') {
    return <AdminRoutes />;
  } else if (state.user?.role === 'tertiary_institution_user') {
    // Skip onboarding for tertiary institution users
    return <UserRoutes />;
  } else if (state.user?.role === 'institution_admin') {
    return (
      <OnboardingProvider>
        <Routes>
          <Route path="/*" element={<InstitutionRoutes />} />
        </Routes>
      </OnboardingProvider>
    );
  } else if (state.user?.role === 'institution_user') {
    return <UserRoutes />;
  }

  // Fallback for unknown roles
  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<PlaceholderPage title="Unauthorized Access" />} />
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['bacchecker_admin', 'gtec_admin']}>
                <AdminRoutes />
              </ProtectedRoute>
            } />
            <Route path="/user/*" element={
              <ProtectedRoute allowedRoles={['tertiary_institution_user']}>
                <UserRoutes />
              </ProtectedRoute>
            } />
            <Route path="/onboarding/:token" element={<TertiaryOnboarding />} />
            <Route path="/public" element={<PublicPortal />} />
            <Route path="/settings" element={
              <ProtectedRoute allowedRoles={['bacchecker_admin', 'gtec_admin', 'tertiary_institution_user', 'institution_admin']}>
                <InstitutionSettings />
              </ProtectedRoute>
            } />
            <Route path="/*" element={<AppContent />} />
            <Route path="/user/document-verification" element={<DocumentVerification />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;