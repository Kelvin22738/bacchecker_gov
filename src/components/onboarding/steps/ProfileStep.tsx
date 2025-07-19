import React, { useState } from 'react';
import { OnboardingLayout } from '../OnboardingLayout';
import { useOnboarding } from '../../../context/OnboardingContext';
import { Upload, Eye, Shield, Scale, GraduationCap, Building2 } from 'lucide-react';
import { Button } from '../../ui/Button';

export function ProfileStep() {
  const { state, dispatch } = useOnboarding();
  const [showPreview, setShowPreview] = useState(false);

  const institutionTypes = [
    { value: 'police', label: 'Police Service', icon: Shield, color: '#dc2626' },
    { value: 'court', label: 'Court System', icon: Scale, color: '#7c2d12' },
    { value: 'education', label: 'Education Ministry', icon: GraduationCap, color: '#991b1b' },
    { value: 'other', label: 'Other Ministry', icon: Building2, color: '#b91c1c' }
  ];

  const handleInputChange = (field: string, value: any) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: { [field]: value } });
  };

  const handleNext = () => {
    dispatch({ type: 'COMPLETE_STEP', payload: 'profile' });
    dispatch({ type: 'SET_CURRENT_STEP', payload: 2 });
  };

  const handlePrevious = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 0 });
  };

  const canProceed = state.profile.name && state.profile.type && state.profile.email;

  return (
    <OnboardingLayout
      title="Institution Profile"
      description="Set up your institution's basic information and branding"
      onNext={handleNext}
      onPrevious={handlePrevious}
      canProceed={canProceed}
    >
      <div className="space-y-8">
        {/* Institution Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Institution Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {institutionTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => handleInputChange('type', type.value)}
                className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                  state.profile.type === type.value
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${type.color}20` }}
                  >
                    <type.icon className="h-5 w-5" style={{ color: type.color }} />
                  </div>
                  <span className="font-medium text-gray-900">{type.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Institution Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={state.profile.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Ghana Police Service"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Name
            </label>
            <input
              type="text"
              value={state.profile.shortName || ''}
              onChange={(e) => handleInputChange('shortName', e.target.value)}
              placeholder="e.g., GPS"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={state.profile.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of your institution's role and services"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={state.profile.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="contact@institution.gov.gh"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={state.profile.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+233-XXX-XXXXXX"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              value={state.profile.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Physical address of your institution"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={state.profile.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://institution.gov.gh"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        {/* File Uploads */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Branding & Assets</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Institution Logo
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload logo</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                <input type="file" className="hidden" accept="image/*" />
              </div>
            </div>

            {/* Banner Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Header Banner
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload banner</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                <input type="file" className="hidden" accept="image/*" />
              </div>
            </div>

            {/* Digital Seal Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Digital Seal
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload seal</p>
                <p className="text-xs text-gray-500">PNG with transparency</p>
                <input type="file" className="hidden" accept="image/*" />
              </div>
            </div>
          </div>
        </div>

        {/* Color Customization */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Brand Colors</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={state.profile.primaryColor || '#dc2626'}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={state.profile.primaryColor || '#dc2626'}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={state.profile.secondaryColor || '#171717'}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={state.profile.secondaryColor || '#171717'}
                  onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accent Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={state.profile.accentColor || '#fafafa'}
                  onChange={(e) => handleInputChange('accentColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={state.profile.accentColor || '#fafafa'}
                  onChange={(e) => handleInputChange('accentColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
          </Button>
        </div>

        {/* Live Preview */}
        {showPreview && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div 
              className="px-6 py-4 text-white"
              style={{ backgroundColor: state.profile.primaryColor || '#dc2626' }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <img src="/image.png" alt="Logo" className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">{state.profile.name || 'Institution Name'}</h3>
                  <p className="text-sm opacity-90">{state.profile.shortName || 'Short Name'}</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50">
              <p className="text-gray-600">
                {state.profile.description || 'Institution description will appear here...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </OnboardingLayout>
  );
}