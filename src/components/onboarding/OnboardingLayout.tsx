import React from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { CheckCircle, Circle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  onNext?: () => void;
  onPrevious?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  canProceed?: boolean;
  showSkip?: boolean;
  onSkip?: () => void;
}

export function OnboardingLayout({
  children,
  title,
  description,
  onNext,
  onPrevious,
  nextLabel = 'Continue',
  previousLabel = 'Back',
  canProceed = true,
  showSkip = false,
  onSkip
}: OnboardingLayoutProps) {
  const { state } = useOnboarding();
  const { currentStep, steps } = state;

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/image.png" alt="BacChecker" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">BacChecker Government Suite™</h1>
              <p className="text-sm text-gray-600">Institution Setup</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Setup Progress</span>
              <span className="text-sm text-gray-500">{currentStep + 1} of {steps.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-600">Step {currentStep + 1}</p>
            <p className="text-xs text-gray-500">{steps[currentStep]?.title}</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar - Steps */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Setup Checklist</h3>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  index === currentStep
                    ? 'bg-red-50 border border-red-200'
                    : step.completed
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex-shrink-0">
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : index === currentStep ? (
                    <div className="h-5 w-5 bg-red-600 rounded-full flex items-center justify-center">
                      <div className="h-2 w-2 bg-white rounded-full" />
                    </div>
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    index === currentStep
                      ? 'text-red-900'
                      : step.completed
                      ? 'text-green-900'
                      : 'text-gray-700'
                  }`}>
                    {step.title}
                  </p>
                  <p className={`text-xs ${
                    index === currentStep
                      ? 'text-red-600'
                      : step.completed
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }`}>
                    {step.description}
                  </p>
                </div>
                {step.required && (
                  <span className="text-xs text-red-500 font-medium">Required</span>
                )}
              </div>
            ))}
          </div>

          {/* Help Section */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Need Help?</h4>
            <p className="text-xs text-blue-700 mb-3">
              Our setup wizard guides you through each step. You can always edit settings later.
            </p>
            <Button variant="outline" size="sm" className="w-full text-blue-700 border-blue-300">
              View Documentation
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Step Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
              <p className="text-lg text-gray-600">{description}</p>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
              {children}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <div>
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={onPrevious}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>{previousLabel}</span>
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-3">
                {showSkip && (
                  <Button variant="ghost" onClick={onSkip}>
                    Skip for now
                  </Button>
                )}
                {onNext && (
                  <Button
                    onClick={onNext}
                    disabled={!canProceed}
                    className="flex items-center space-x-2"
                  >
                    <span>{nextLabel}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}