import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Database,
  Settings,
  FileText,
  Users,
  Key,
  Shield,
  BarChart3,
  Workflow,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Layout,
  FileCheck,
  CreditCard,
  HelpCircle,
  Building2,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { state, dispatch } = useApp();
  const { state: authState } = useAuth();
  const { sidebarCollapsed, currentInstitution } = state;
  const { user } = authState;

  const isGTECAdmin = user?.role === 'gtec_admin';
  const isBacCheckerAdmin = user?.role === 'bacchecker_admin';

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home,
      roles: ['bacchecker_admin', 'gtec_admin', 'tertiary_institution_user'],
      exact: true
    },
    {
      name: 'Institutions',
      href: '/institutions',
      icon: Building2,
      roles: ['bacchecker_admin', 'gtec_admin'],
    },
    {
      name: 'Courses',
      href: '/courses',
      icon: GraduationCap,
      roles: ['tertiary_institution_user'],
    },
    {
      name: 'Verification Requests',
      href: '/requests',
      icon: FileText,
      roles: ['bacchecker_admin', 'gtec_admin', 'tertiary_institution_user'],
    },
    {
      name: 'Document Templates',
      href: '/templates',
      icon: FileCheck,
      roles: ['bacchecker_admin', 'gtec_admin', 'tertiary_institution_user'],
    },
    {
      name: 'User Management',
      href: '/users',
      icon: Users,
      roles: ['bacchecker_admin', 'gtec_admin'],
    },
    {
      name: 'API & Validation',
      href: '/api',
      icon: Key,
      roles: ['bacchecker_admin', 'gtec_admin'],
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      roles: ['bacchecker_admin', 'gtec_admin', 'tertiary_institution_user'],
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      roles: ['bacchecker_admin', 'gtec_admin', 'tertiary_institution_user', 'institution_admin'],
    },
    {
      name: 'Help & Support',
      href: '/help',
      icon: HelpCircle,
      roles: ['bacchecker_admin', 'gtec_admin', 'tertiary_institution_user'],
    },
  ];

  const filteredItems = navigationItems.filter(item =>
    user?.role && item.roles.includes(user.role)
  );

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
            <span className="text-lg font-semibold text-gray-900">Menu</span>
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

          {/* Institution indicator */}
          {currentInstitution && !sidebarCollapsed && (
            <div className="px-4 pb-4 flex-shrink-0">
              <div 
                className="p-3 rounded-lg border-2 border-opacity-20"
                style={{ 
                  borderColor: currentInstitution.primaryColor,
                  backgroundColor: `${currentInstitution.primaryColor}10`
                }}
              >
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: currentInstitution.primaryColor }}
                  />
                  <span className="text-xs font-semibold text-gray-700">
                    {currentInstitution.shortName}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {currentInstitution.name}
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto min-h-0">
            {filteredItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.exact}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group',
                    isActive
                      ? 'bg-red-50 text-red-700 border-r-2 border-red-700 shadow-sm'
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

          {/* Footer */}
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
              <div className="text-xs text-gray-500 space-y-1">
                <p className="font-semibold">
                  {isGTECAdmin ? 'BacChecker Government Suite™' : 'BacChecker Government Suite™'}
                </p>
                <p>Version 2.0.0</p>
                <p className="mt-2">© 2024 {isGTECAdmin ? 'GTEC' : 'Government of Ghana'}</p>
                {isGTECAdmin && (
                  <p className="text-xs text-gray-400">Tertiary Education Platform</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}