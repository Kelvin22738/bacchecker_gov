import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';

export function Login() {
  const { state, login } = useAuth();
  const navigate = useNavigate(); // Add navigation hook
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  // Add effect to handle successful login
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      console.log('Login successful, redirecting...', state.user);
      navigate('/admin');
    }
  }, [state.isAuthenticated, state.user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted', credentials);
    
    try {
      const result = await login(credentials);
      console.log('Login result:', result);
      
      // If login doesn't automatically update state, handle success here
      if (result && result.success) {
        navigate('/admin');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Error should be handled by AuthContext, but log it here too
    }
  };

  const handleDemoAccountClick = (account) => {
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
      description: 'Manage tertiary institutions and accreditation'
    },
    {
      email: 'admin@ug.edu.gh',
      name: 'University of Ghana',
      role: 'Tertiary Institution User',
      description: 'Manage university profile and academic services'
    },
    {
      email: 'admin@knust.edu.gh',
      name: 'KNUST',
      role: 'Tertiary Institution User',
      description: 'Manage KNUST profile and academic services'
    },
    {
      email: 'admin@police.gov.gh',
      name: 'Ghana Police Service',
      role: 'Institution Admin',
      description: 'Traditional onboarding flow with full setup wizard'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Branding */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
              <img src="/image.png" alt="BacChecker" className="h-16 w-16" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">BacChecker Government Suite™</h1>
                <p className="text-gray-600">Sovereign Digital Verification Platform</p>
              </div>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <p className="text-lg">
                Secure, scalable government records management platform trusted by institutions across Ghana.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                  <Shield className="h-8 w-8 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Secure & Compliant</h3>
                    <p className="text-sm text-gray-600">Government-grade security</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                  <Shield className="h-8 w-8 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Multi-Institutional</h3>
                    <p className="text-sm text-gray-600">Unified platform for all agencies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to access your dashboard</p>
            </div>

            {state.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-700">{state.error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  placeholder="Enter your email"
                  required
                  disabled={state.isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors pr-12"
                    placeholder="Enter your password"
                    required
                    disabled={state.isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={state.isLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={state.isLoading}
                disabled={state.isLoading}
              >
                {state.isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Demo Accounts</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {demoAccounts.map((account) => (
                  <button
                    key={account.email}
                    onClick={() => handleDemoAccountClick(account)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    disabled={state.isLoading}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{account.name}</p>
                        <p className="text-sm text-gray-600">{account.description}</p>
                      </div>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        {account.role}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Debug Information (remove in production) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
                <p>Debug - Auth State: {JSON.stringify({ 
                  isAuthenticated: state.isAuthenticated, 
                  isLoading: state.isLoading, 
                  error: state.error,
                  hasUser: !!state.user
                })}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}