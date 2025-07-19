import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, AuthAction, AuthUser, LoginCredentials } from '../types/auth';
import { supabase } from '../utils/supabase';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: true, 
        isLoading: false, 
        error: null 
      };
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: action.payload 
      };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: null 
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Mock users for demo
  const mockUsers: AuthUser[] = [
    {
      id: 'bacchecker-admin-1',
      email: 'admin@bacchecker.com',
      name: 'BacChecker System Administrator',
      role: 'bacchecker_admin',
      permissions: ['manage_all_institutions', 'system_administration', 'global_settings', 'view_all_data', 'manage_global_templates'],
      createdAt: new Date('2024-01-01'),
      avatar: '/image.png'
    },
    {
      id: 'gtec-admin-1',
      email: 'admin@gtec.edu.gh',
      name: 'GTEC Administrator',
      role: 'gtec_admin',
      institutionId: 'gtec',
      permissions: ['view_all_institutions', 'manage_institutions', 'view_all_requests', 'system_analytics', 'manage_settings'],
      createdAt: new Date('2024-01-01'),
      avatar: '/GTEC-LOGO-removebg-preview.png'
    },
    {
      id: 'gps-admin',
      email: 'admin@police.gov.gh',
      name: 'Ghana Police Service Admin',
      role: 'institution_admin',
      institutionId: 'gps',
      permissions: ['manage_profile', 'manage_services', 'process_requests', 'view_analytics', 'manage_templates', 'manage_users'],
      createdAt: new Date('2024-01-01'),
      avatar: '/image.png'
    },
    {
      id: 'ug-admin',
      email: 'admin@ug.edu.gh',
      name: 'University of Ghana Admin',
      role: 'tertiary_institution_user',
      institutionId: 'ug',
      permissions: ['manage_profile', 'upload_documents', 'manage_courses', 'view_analytics'],
      createdAt: new Date('2024-01-01'),
      avatar: '/GTEC-LOGO-removebg-preview.png'
    },
    {
      id: 'knust-admin',
      email: 'admin@knust.edu.gh',
      name: 'KNUST Administrator',
      role: 'tertiary_institution_user',
      institutionId: 'knust',
      permissions: ['manage_profile', 'upload_documents', 'manage_courses', 'view_analytics'],
      createdAt: new Date('2024-01-01'),
      avatar: '/GTEC-LOGO-removebg-preview.png'
    }
  ];

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Use Supabase authentication
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });
      
      if (authError) {
        // If user doesn't exist in Supabase auth, try to sign them up first
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password
        });
        
        if (signUpError) {
          throw new Error('Authentication failed');
        }
        
        // Now try to sign in again
        const { data: retryAuthData, error: retryAuthError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password
        });
        
        if (retryAuthError) {
          throw new Error('Authentication failed after signup');
        }
      }
      
      // Find the mock user data for the authenticated email
      const user = mockUsers.find(u => u.email === credentials.email);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Store in localStorage immediately
      localStorage.setItem('bacchecker_user', JSON.stringify(user));
      
      // Dispatch success immediately
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      
      // Force a small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: (error as Error).message });
    }
  };

  const logout = () => {
    // Sign out from Supabase
    supabase.auth.signOut();
    localStorage.removeItem('bacchecker_user');
    // Clear all onboarding data for all institutions
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('onboarding_completed_')) {
        localStorage.removeItem(key);
      }
    });
    dispatch({ type: 'LOGOUT' });
  };

  // Check for stored user on mount
  useEffect(() => {
    // Check Supabase auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        const user = mockUsers.find(u => u.email === session.user.email);
        if (user) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
          return;
        }
      }
    });
    
    // Fallback to localStorage check
    const storedUser = localStorage.getItem('bacchecker_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('bacchecker_user');
      }
    }
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('bacchecker_user');
        dispatch({ type: 'LOGOUT' });
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}