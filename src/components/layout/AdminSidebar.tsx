import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Building2,
  FileText,
  BarChart3,
  Users,
  Shield,
  X,
  ChevronLeft,
  ChevronRight,
  Activity,
  FileCheck,
  CreditCard,
  HelpCircle,
  Settings,
  Database,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const { state, dispatch } = useApp();
  const { state: authState } = useAuth();
  const { sidebarCollapsed } = state;
  const { user } = authState;

  const isGTECAdmin = user?.role === 'gtec_admin';
  const isBacCheckerAdmin = user?.role === 'bacchecker_admin';

  const navigationItems = [
    {
      name: 'System Overview',
      href: '/admin',
      icon: Home,
      exact: true
    },
    {
      name: 'Institutions',
      href: '/admin/institutions',
      icon: Building2
    },
    {
      name: 'Request Monitoring',
      href: '/admin/requests',
      icon: FileText
    },
    {
      name: 'Document Verification',
      href: '/admin/verification',
      icon: Shield
    },
    {
      name: 'Fraud Prevention',
      href: '/admin/fraud-prevention',
      icon: AlertTriangle
    },
    {
      name: 'Verification Reports',
      href: '/admin/verification-reports',
      icon: FileCheck
    },
    {
      name: 'System Analytics',
      href: '/admin/analytics',
      icon: BarChart3
    },
    {
      name: 'Payments',
      href: '/admin/payments',
      icon: CreditCard
    },
    {
      name: 'Global Templates',
      href: '/admin/templates',
      icon: FileCheck
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings
    },
    {
      name: 'Help & Support',
      href: '/admin/help',
      icon: HelpCircle
    }
  ];

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          sidebarCollapsed ? 'lg:w-16' : 'lg:w-64',
          'w-64'
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 lg:hidden">
            <span className="text-lg font-semibold text-gray-900">BacChecker Admin</span>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Desktop collapse toggle */}
          <div className="hidden lg:flex items-center justify-end p-4 flex-shrink-0">
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Admin indicator */}
          {!sidebarCollapsed && (
            <div className="px-4 pb-4 flex-shrink-0">
              <div className={`p-3 rounded-lg border ${
                isGTECAdmin 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center space-x-2">
                  {isGTECAdmin ? (
                    <img src="/GTEC-LOGO-removebg-preview.png" alt="GTEC" className="w-4 h-4" />
                  ) : (
                    <Shield className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm font-semibold ${
                    isGTECAdmin ? 'text-blue-700' : 'text-red-700'
                  }`}>
                    {isGTECAdmin ? 'GTEC Administrator' : 'System Administrator'}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${
                  isGTECAdmin ? 'text-blue-600' : 'text-red-600'
                }`}>
                  {isGTECAdmin ? 'Tertiary education oversight' : 'Full platform access'}
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto min-h-0">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.exact}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group',
                    isActive
                      ? `${isGTECAdmin ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'bg-red-50 text-red-700 border-r-2 border-red-700'} shadow-sm`
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
                    sidebarCollapsed && 'lg:justify-center'
                  )
                }
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon className={clsx(
                  'h-5 w-5 flex-shrink-0',
                  sidebarCollapsed ? '' : 'mr-3'
                )} />
                {!sidebarCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* System Status */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
              {isGTECAdmin && (
                <div className="mb-3 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <img src="/GTEC-LOGO-removebg-preview.png" alt="GTEC" className="h-6 w-6" />
                    <span className="text-sm font-bold text-gray-900">GTEC</span>
                  </div>
                  <p className="text-xs text-gray-600">Ghana Tertiary Education Commission</p>
                </div>
              )}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">System Status</span>
                  <div className="flex items-center space-x-1">
                    <Activity className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">Operational</span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <p className="font-semibold">
                    {isGTECAdmin ? 'BacChecker Government Suite™' : 'BacChecker Government Suite™'}
                  </p>
                  <p>Admin Portal v2.0.0</p>
                  <p className="mt-2">© 2024 {isGTECAdmin ? 'GTEC' : 'Government of Ghana'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}