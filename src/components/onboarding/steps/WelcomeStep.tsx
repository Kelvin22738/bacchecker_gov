import React from 'react';
import { OnboardingLayout } from '../OnboardingLayout';
import { useOnboarding } from '../../../context/OnboardingContext';
import { Shield, Scale, GraduationCap, Building2, CheckCircle, Users, FileText, Settings } from 'lucide-react';

export function WelcomeStep() {
  const { dispatch } = useOnboarding();

  const handleNext = () => {
    dispatch({ type: 'COMPLETE_STEP', payload: 'welcome' });
    dispatch({ type: 'SET_CURRENT_STEP', payload: 1 });
  };

  const features = [
    {
      icon: FileText,
      title: 'Digital Records Management',
      description: 'Streamline document processing and verification'
    },
    {
      icon: Users,
      title: 'Multi-User Collaboration',
      description: 'Role-based access for your entire team'
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'Government-grade security and audit trails'
    },
    {
      icon: Settings,
      title: 'Fully Customizable',
      description: 'Adapt the platform to your institution\'s needs'
    }
  ];

  const institutionTypes = [
    {
      icon: Shield,
      name: 'Police Services',
      description: 'Criminal records, clearance certificates',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Scale,
      name: 'Court Systems',
      description: 'Legal records, case management',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: GraduationCap,
      name: 'Education Ministry',
      description: 'Academic verification, certificates',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Building2,
      name: 'Other Ministries',
      description: 'Custom government services',
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  return (
    <OnboardingLayout
      title="Welcome to BacChecker Government Suite™"
      description="Transform your institution's digital infrastructure with our comprehensive records management platform"
      onNext={handleNext}
      nextLabel="Start Setup"
    >
      <div className="space-y-8">
        {/* Mission Statement */}
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full mb-6">
            <img src="/image.png" alt="BacChecker" className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Sovereign Digital Verification Platform
          </h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Empower your government institution with cutting-edge technology for managing public records, 
            processing requests, and delivering digital services to citizens and businesses.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Institution Types */}
        <div>
          <h4 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Designed for Government Institutions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {institutionTypes.map((type, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${type.color}`}>
                  <type.icon className="h-6 w-6" />
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">{type.name}</h5>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Setup Preview */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <h4 className="text-lg font-semibold text-red-900 mb-4">What's Next?</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">Institution Profile Setup</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">Service Configuration</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">User & Permission Setup</span>
            </div>
          </div>
          <p className="text-red-700 mt-4 text-sm">
            This setup wizard will guide you through configuring your institution's digital platform. 
            The entire process takes about 10-15 minutes. You can always update these settings later.
          </p>
        </div>
      </div>
    </OnboardingLayout>
  );
}