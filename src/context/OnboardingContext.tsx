import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { OnboardingState, OnboardingStep } from '../types/onboarding';

const initialSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    description: 'Get started with BacChecker',
    completed: false,
    required: true,
    order: 1
  },
  {
    id: 'profile',
    title: 'Institution Profile',
    description: 'Set up your institution details',
    completed: false,
    required: true,
    order: 2
  },
  {
    id: 'services',
    title: 'Services Setup',
    description: 'Configure your services',
    completed: false,
    required: true,
    order: 3
  },
  {
    id: 'templates',
    title: 'Document Templates',
    description: 'Upload and configure templates',
    completed: false,
    required: false,
    order: 4
  },
  {
    id: 'signatures',
    title: 'Signature Settings',
    description: 'Configure digital signatures',
    completed: false,
    required: false,
    order: 5
  },
  {
    id: 'roles',
    title: 'User Roles',
    description: 'Set up user permissions',
    completed: false,
    required: true,
    order: 6
  },
  {
    id: 'registry',
    title: 'Registry Schema',
    description: 'Build your data registries',
    completed: false,
    required: true,
    order: 7
  },
  {
    id: 'review',
    title: 'Review & Launch',
    description: 'Final review and launch',
    completed: false,
    required: true,
    order: 8
  }
];

const initialState: OnboardingState = {
  currentStep: 0,
  steps: initialSteps,
  profile: {
    primaryColor: '#dc2626',
    secondaryColor: '#171717',
    accentColor: '#fafafa'
  },
  services: [],
  templates: [],
  roles: [],
  registries: [],
  isComplete: false
};

type OnboardingAction = 
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'UPDATE_PROFILE'; payload: Partial<OnboardingState['profile']> }
  | { type: 'UPDATE_SERVICES'; payload: OnboardingState['services'] }
  | { type: 'UPDATE_TEMPLATES'; payload: OnboardingState['templates'] }
  | { type: 'UPDATE_ROLES'; payload: OnboardingState['roles'] }
  | { type: 'UPDATE_REGISTRIES'; payload: OnboardingState['registries'] }
  | { type: 'COMPLETE_STEP'; payload: string }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'RESET_ONBOARDING' };

function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'UPDATE_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case 'UPDATE_SERVICES':
      return { ...state, services: action.payload };
    case 'UPDATE_TEMPLATES':
      return { ...state, templates: action.payload };
    case 'UPDATE_ROLES':
      return { ...state, roles: action.payload };
    case 'UPDATE_REGISTRIES':
      return { ...state, registries: action.payload };
    case 'COMPLETE_STEP':
      return {
        ...state,
        steps: state.steps.map(step =>
          step.id === action.payload ? { ...step, completed: true } : step
        )
      };
    case 'COMPLETE_ONBOARDING':
      return { ...state, isComplete: true };
    case 'RESET_ONBOARDING':
      return initialState;
    default:
      return state;
  }
}

const OnboardingContext = createContext<{
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
} | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  return (
    <OnboardingContext.Provider value={{ state, dispatch }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}