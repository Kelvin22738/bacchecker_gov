import React from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { WelcomeStep } from './steps/WelcomeStep';
import { ProfileStep } from './steps/ProfileStep';
import { ServicesStep } from './steps/ServicesStep';
import { TemplatesStep } from './steps/TemplatesStep';
import { SignaturesStep } from './steps/SignaturesStep';
import { RolesStep } from './steps/RolesStep';
import { RegistryStep } from './steps/RegistryStep';
import { ReviewStep } from './steps/ReviewStep';

export function OnboardingWizard() {
  const { state } = useOnboarding();

  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return <WelcomeStep />;
      case 1:
        return <ProfileStep />;
      case 2:
        return <ServicesStep />;
      case 3:
        return <TemplatesStep />;
      case 4:
        return <SignaturesStep />;
      case 5:
        return <RolesStep />;
      case 6:
        return <RegistryStep />;
      case 7:
        return <ReviewStep />;
      default:
        return <WelcomeStep />;
    }
  };

  // If onboarding is complete, don't render the wizard
  if (state.isComplete) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {renderStep()}
    </div>
  );
}