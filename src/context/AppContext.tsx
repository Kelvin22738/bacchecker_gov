import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, AppAction } from '../types';
import { generateMockData } from '../utils/mockData';

const initialState: AppState = {
  user: null,
  currentInstitution: null,
  institutions: [],
  registries: [],
  services: [],
  requests: [],
  workflows: [],
  apiKeys: [],
  templates: [],
  isLoading: false,
  error: null,
  sidebarCollapsed: false,
  currentView: 'dashboard'
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_CURRENT_INSTITUTION':
      return { ...state, currentInstitution: action.payload };
    case 'SET_INSTITUTIONS':
      return { ...state, institutions: action.payload };
    case 'ADD_INSTITUTION':
      return { ...state, institutions: [...state.institutions, action.payload] };
    case 'UPDATE_INSTITUTION':
      return {
        ...state,
        institutions: state.institutions.map(inst =>
          inst.id === action.payload.id ? action.payload : inst
        ),
      };
    case 'SET_REGISTRIES':
      return { ...state, registries: action.payload };
    case 'ADD_REGISTRY':
      return { ...state, registries: [...state.registries, action.payload] };
    case 'UPDATE_REGISTRY':
      return {
        ...state,
        registries: state.registries.map(reg =>
          reg.id === action.payload.id ? action.payload : reg
        ),
      };
    case 'SET_SERVICES':
      return { ...state, services: action.payload };
    case 'ADD_SERVICE':
      return { ...state, services: [...state.services, action.payload] };
    case 'UPDATE_SERVICE':
      return {
        ...state,
        services: state.services.map(service =>
          service.id === action.payload.id ? action.payload : service
        ),
      };
    case 'SET_REQUESTS':
      return { ...state, requests: action.payload };
    case 'ADD_REQUEST':
      return { ...state, requests: [...state.requests, action.payload] };
    case 'UPDATE_REQUEST':
      return {
        ...state,
        requests: state.requests.map(req =>
          req.id === action.payload.id ? action.payload : req
        ),
      };
    case 'SET_WORKFLOWS':
      return { ...state, workflows: action.payload };
    case 'ADD_WORKFLOW':
      return { ...state, workflows: [...state.workflows, action.payload] };
    case 'UPDATE_WORKFLOW':
      return {
        ...state,
        workflows: state.workflows.map(workflow =>
          workflow.id === action.payload.id ? action.payload : workflow
        ),
      };
    case 'SET_API_KEYS':
      return { ...state, apiKeys: action.payload };
    case 'ADD_API_KEY':
      return { ...state, apiKeys: [...state.apiKeys, action.payload] };
    case 'UPDATE_API_KEY':
      return {
        ...state,
        apiKeys: state.apiKeys.map(key =>
          key.id === action.payload.id ? action.payload : key
        ),
      };
    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload };
    case 'ADD_TEMPLATE':
      return { ...state, templates: [...state.templates, action.payload] };
    case 'UPDATE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.map(template =>
          template.id === action.payload.id ? action.payload : template
        ),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Load mock data on app initialization
    const mockData = generateMockData();
    
    dispatch({ type: 'SET_INSTITUTIONS', payload: mockData.institutions });
    dispatch({ type: 'SET_REGISTRIES', payload: mockData.registries });
    dispatch({ type: 'SET_SERVICES', payload: mockData.services });
    dispatch({ type: 'SET_REQUESTS', payload: mockData.requests });
    dispatch({ type: 'SET_WORKFLOWS', payload: mockData.workflows });
    dispatch({ type: 'SET_API_KEYS', payload: mockData.apiKeys });
    dispatch({ type: 'SET_TEMPLATES', payload: mockData.templates });
    
    // Don't set default institution for GTEC admins
    dispatch({ type: 'SET_USER', payload: mockData.users[0] });
    // Only set current institution for BacChecker admins
    // GTEC admins should not have a current institution selected
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}