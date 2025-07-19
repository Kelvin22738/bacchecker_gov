import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  FileText,
  Settings,
  HelpCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Activity,
  User,
  Clock,
  Bell,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserSidebar({ isOpen, onClose }: UserSidebarProps) {
  const { state, dispatch } = useApp();
  const { state: authState } = useAuth();
  const { sidebarCollapsed } = state;
  const { user } = authState;
  
  const isGTECInstitution = user?.role === 'tertiary_institution_user';

  // Get custom theme from localStorage if present
  let customTheme = null;
  if (isGTECInstitution) {
    try {
      customTheme = JSON.parse(localStorage.getItem('user_theme') || 'null');
    } catch {}
  }
  const logo = isGTECInstitution && customTheme?.logo ? customTheme.logo : "/GTEC-LOGO-removebg-preview.png";
  const primaryColor = isGTECInstitution && customTheme?.primaryColor ? customTheme.primaryColor : '#1e40af';
  const secondaryColor = isGTECInstitution && customTheme?.secondaryColor ? customTheme.secondaryColor : '#171717';
  const accentColor = isGTECInstitution && customTheme?.accentColor ? customTheme.accentColor : '#fafafa';

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/user',
      icon: Home,
      exact: true
    },
    {
      name: 'Verifications',
      href: '/user/verifications',
      icon: FileText
    },
    {
      name: 'My Profile',
      href: '/user/profile',
      icon: User
    },
    {
      name: 'Settings',
      href: '/user/settings',
      icon: Settings
    },
    {
      name: 'Help & Support',
      href: '/user/help',
      icon: HelpCircle
    }
  ];

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const getInstitutionName = () => {
    switch (user?.institutionId) {
      case 'gps':
        return 'Ghana Police Service';
      case 'hcg':
        return 'High Court of Ghana';
      case 'moe':
        return 'Ministry of Education';
      default:
        return 'Institution';
    }
  };

  const getInstitutionColor = () => {
    switch (user?.institutionId) {
      case 'gps':
        return '#dc2626';
      case 'hcg':
        return '#7f1d1d';
      case 'moe':
        return '#991b1b';
      default:
        return '#dc2626';
    }
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
        <div className="flex flex-col h-full">
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
          <div className="hidden lg:flex items-center justify-end p-4">
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
          {!sidebarCollapsed && user?.institutionId && (
            <div className="px-4 pb-4">
              <div 
                className={`p-3 rounded-lg border-2 border-opacity-20 ${
                  isGTECInstitution ? '' : 'bg-red-50 border-red-200'
                }`}
                style={isGTECInstitution ? { background: primaryColor, borderColor: primaryColor } : {}}
              >
                <div className="flex items-center space-x-2">
                  <img src={logo} alt="Institution Logo" className="h-6 w-6 rounded" />
                  <span className={`text-xs font-semibold ${
                    isGTECInstitution ? '' : 'text-gray-700'
                  }`} style={isGTECInstitution ? { color: accentColor } : {}}>
                    {isGTECInstitution ? 'GTEC' : user?.institutionId?.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate" style={isGTECInstitution ? { color: accentColor } : {}}>
                  {getInstitutionName()}
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto" style={isGTECInstitution ? { color: accentColor } : {}}>
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
                      ? `${isGTECInstitution ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'bg-red-50 text-red-700 border-r-2 border-red-700'} shadow-sm`
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

          {/* Status */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-gray-200">
              {isGTECInstitution && (
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
                    <span className="text-xs text-green-600">Online</span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <p className="font-semibold">BacChecker Government Suite™</p>
                  <p className="mt-2">© 2024 {isGTECInstitution ? 'GTEC' : 'Government of Ghana'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}