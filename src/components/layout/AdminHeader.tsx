import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  User, 
  ChevronDown, 
  Search, 
  Filter,
  Settings,
  LogOut,
  Shield,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const { state, logout } = useAuth();
  const { user } = state;
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isGTECAdmin = user?.role === 'gtec_admin';
  const isBacCheckerAdmin = user?.role === 'bacchecker_admin';

  return (
    <header className={`border-b border-gray-200 px-6 py-4 sticky top-0 z-40 backdrop-blur-sm ${
      isGTECAdmin ? 'bg-blue-600' : 'bg-white'
    }/95`}>
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <button
            onClick={onToggleSidebar}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isGTECAdmin 
                ? 'text-blue-100 hover:text-white hover:bg-blue-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img 
                src={isGTECAdmin ? "/GTEC-LOGO-removebg-preview.png" : "/image.png"} 
                alt={isGTECAdmin ? "GTEC Logo" : "BacChecker Logo"} 
                className="h-10 w-10 rounded-lg shadow-sm"
              />
              <div>
                <h1 className={`text-xl font-bold tracking-tight ${
                  isGTECAdmin ? 'text-black' : 'text-gray-900'
                }`}>
                  {isGTECAdmin ? 'GTEC Admin Portal' : 'BacChecker Admin Portal'}
                </h1>
                <p className={`text-xs font-medium ${
                  isGTECAdmin ? 'text-gray-800' : 'text-gray-500'
                }`}>
                  {isGTECAdmin ? 'Tertiary Education Administration' : 'System Administration Dashboard'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search institutions, requests, users..."
              className={`block w-full pl-10 pr-12 py-2.5 border rounded-lg leading-5 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 transition-all duration-200 ${
                isGTECAdmin 
                  ? 'border-blue-300 bg-blue-50 focus:ring-2 focus:ring-blue-300 focus:border-blue-300' 
                  : 'border-gray-300 bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500'
              }`}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button className={`p-1 transition-colors ${
                isGTECAdmin 
                  ? 'text-blue-400 hover:text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}>
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className={`relative p-2.5 rounded-lg transition-all duration-200 ${
            isGTECAdmin 
              ? 'text-blue-100 hover:text-white hover:bg-blue-700' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}>
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full animate-bounce-subtle"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${
                isGTECAdmin 
                  ? 'text-blue-100 hover:text-white hover:bg-blue-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="text-right">
                <p className={`text-sm font-semibold ${isGTECAdmin ? 'text-black' : 'text-gray-900'}`}>{user?.name}</p>
                <p className={`text-xs ${isGTECAdmin ? 'text-gray-800' : 'text-gray-500'}`}>
                  {isGTECAdmin ? 'GTEC Administrator' : 'BacChecker Administrator'}
                </p>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isGTECAdmin 
                  ? 'bg-gradient-to-br from-blue-400 to-blue-500' 
                  : 'bg-gradient-to-br from-red-500 to-red-600'
              }`}>
                {isGTECAdmin ? (
                  <img src="/GTEC-LOGO-removebg-preview.png" alt="GTEC" className="h-4 w-4" />
                ) : (
                  <Shield className="h-4 w-4 text-white" />
                )}
              </div>
              <ChevronDown className={`h-4 w-4 ${isGTECAdmin ? 'text-blue-100' : 'text-gray-500'}`} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-scale-in">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Shield className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-red-600 font-medium">Admin Access</span>
                  </div>
                </div>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Admin Settings</span>
                </button>
                <button 
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}