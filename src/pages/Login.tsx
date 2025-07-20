// src/pages/Login.tsx - REPLACE ENTIRE FILE
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';

export function Login() {
  const { state, login } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  // Role-based redirect logic
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      console.log('Login successful, redirecting...', state.user);
      
      // Redirect based on user role
      switch (state.user.role) {
        case 'bacchecker_admin':
        case 'gtec_admin':
          navigate('/admin', { replace: true });
          break;
        case 'tertiary_institution_user':
          navigate('/user', { replace: true });
          break;
        case 'institution_admin':
          // Check if onboarding is completed
          const onboardingKey = `onboarding_completed_${state.user.institutionId}`;
          const onboardingCompleted = localStorage.getItem(onboardingKey);
          if (onboardingCompleted === 'true') {
            navigate('/', { replace: true }); // Will trigger InstitutionRoutes
          } else {
            navigate('/', { replace: true }); // Will show onboarding
          }
          break;
        default:
          // Fallback for unknown roles
          navigate('/unauthorized', { replace: true });
      }
    }
  }, [state.isAuthenticated, state.user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted', credentials);
    
    try {
      await login(credentials);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleDemoAccountClick = (account: any) => {
    console.log('Demo account selected:', account);
    setCredentials({ email: account.email, password: 'password123' });
  };

  const demoAccounts = [
    {
      email: 'admin@bacchecker.com',
      name: 'BacChecker System Admin',
      role: 'System Administrator',
      description: 'Full system administration and global management'
    },
    {
      email: 'admin@gtec.edu.gh',
      name: 'GTEC Administrator',
      role: 'GTEC Admin',
      description: 'Manage tertiary institutions and verification processes'
    },
    {
      email: 'admin@ug.edu.gh',
      name: 'University of Ghana',
      role: 'Tertiary Institution User',
      description: 'Manage university profile and verification requests'
    },
    {
      email: 'admin@knust.edu.gh',
      name: 'KNUST',
      role: 'Tertiary Institution User',
      description: 'Manage KNUST profile and verification requests'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left Panel - Branding */}
          <div className="lg:w-1/2 bg-gradient-to-br from-blue-700 to-blue-900 p-8 lg:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-8">
                <img src="/logo.png" alt="BacChecker Logo" className="h-12 w-12 mr-4" />
                <div>
                  <h1 className="text-3xl font-bold">BacChecker</h1>
                  <p className="text-blue-200">Document Verification System</p>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Secure. Fast. Reliable.</h2>
                <p className="text-blue-100 leading-relaxed">
                  Ghana's premier platform for document verification and credential authentication. 
                  Join thousands of institutions in our secure verification network.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>End-to-end encryption</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Real-time verification</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Multi-institution network</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="lg:w-1/2 p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Sign in to your account to continue</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {state.error && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm">{state.error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full py-3"
                  disabled={state.isLoading}
                >
                  {state.isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-8">
                <div className="text-center text-sm text-gray-600 mb-4">
                  Demo Accounts (Development Only)
                </div>
                <div className="space-y-2">
                  {demoAccounts.map((account, index) => (
                    <button
                      key={index}
                      onClick={() => handleDemoAccountClick(account)}
                      className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{account.name}</div>
                      <div className="text-sm text-gray-600">{account.role}</div>
                      <div className="text-xs text-gray-500">{account.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}