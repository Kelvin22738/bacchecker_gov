import React, { useState } from 'react';
import { OnboardingLayout } from '../OnboardingLayout';
import { useOnboarding } from '../../../context/OnboardingContext';
import { Upload, Shield, Pen, FileSignature, Settings, Check } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';

export function SignaturesStep() {
  const { state, dispatch } = useOnboarding();
  const [signatureMode, setSignatureMode] = useState<'digital' | 'electronic' | 'both'>('digital');
  const [sealUploaded, setSealUploaded] = useState(false);

  const signatureModes = [
    {
      value: 'digital',
      title: 'Digital Signatures',
      description: 'Cryptographic signatures with certificates',
      icon: Shield,
      features: ['Highest security', 'Legal compliance', 'Non-repudiation', 'Certificate-based']
    },
    {
      value: 'electronic',
      title: 'Electronic Signatures',
      description: 'Simple electronic signature capture',
      icon: Pen,
      features: ['Easy to use', 'Quick setup', 'Image-based', 'Basic authentication']
    },
    {
      value: 'both',
      title: 'Hybrid Approach',
      description: 'Both digital and electronic signatures',
      icon: FileSignature,
      features: ['Maximum flexibility', 'Service-specific', 'User choice', 'Comprehensive coverage']
    }
  ];

  const handleNext = () => {
    dispatch({ type: 'COMPLETE_STEP', payload: 'signatures' });
    dispatch({ type: 'SET_CURRENT_STEP', payload: 5 });
  };

  const handlePrevious = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 3 });
  };

  return (
    <OnboardingLayout
      title="Signature Settings"
      description="Configure digital signatures and official seals for your documents"
      onNext={handleNext}
      onPrevious={handlePrevious}
      showSkip={true}
      onSkip={handleNext}
    >
      <div className="space-y-8">
        {/* Signature Mode Selection */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Choose Signature Method
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {signatureModes.map((mode) => (
              <div
                key={mode.value}
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                  signatureMode === mode.value
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSignatureMode(mode.value as any)}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    signatureMode === mode.value ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <mode.icon className={`h-5 w-5 ${
                      signatureMode === mode.value ? 'text-red-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">{mode.title}</h5>
                    {signatureMode === mode.value && (
                      <Badge variant="primary" size="sm">Selected</Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{mode.description}</p>
                
                <ul className="space-y-1">
                  {mode.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <Check className="h-3 w-3 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Seal Upload */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Official Digital Seal
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                sealUploaded ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-gray-400'
              }`}>
                {sealUploaded ? (
                  <div>
                    <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h5 className="text-lg font-semibold text-green-900 mb-2">
                      Seal Uploaded Successfully
                    </h5>
                    <p className="text-green-700 mb-4">
                      Your official seal is ready for use
                    </p>
                    <Button variant="outline" size="sm">
                      Replace Seal
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h5 className="text-lg font-semibold text-gray-900 mb-2">
                      Upload Official Seal
                    </h5>
                    <p className="text-gray-600 mb-4">
                      Upload your institution's official seal or stamp
                    </p>
                    <Button onClick={() => setSealUploaded(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Seal
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG with transparency recommended
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h5 className="font-semibold text-gray-900">Seal Requirements</h5>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm text-gray-600">High resolution (minimum 300 DPI)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm text-gray-600">PNG format with transparent background</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm text-gray-600">Square aspect ratio preferred</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <span className="text-sm text-gray-600">Maximum file size: 5MB</span>
                </li>
              </ul>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <h6 className="font-semibold text-blue-900 mb-2">Security Note</h6>
                <p className="text-blue-700 text-sm">
                  Your digital seal will be securely stored and can only be applied to 
                  official documents through authorized processes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Configuration */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Signature Configuration
          </h4>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Signature Position
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option>Bottom Right</option>
                  <option>Bottom Left</option>
                  <option>Bottom Center</option>
                  <option>Custom Position</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signature Size
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option>Small (100x50px)</option>
                  <option>Medium (150x75px)</option>
                  <option>Large (200x100px)</option>
                  <option>Custom Size</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                  <span className="text-sm text-gray-700">Include timestamp with signature</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                  <span className="text-sm text-gray-700">Require two-factor authentication</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Management */}
        {(signatureMode === 'digital' || signatureMode === 'both') && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Digital Certificate Management
            </h4>
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h5 className="font-semibold text-gray-900">Certificate Status</h5>
                  <p className="text-sm text-gray-600">Manage your digital signing certificates</p>
                </div>
                <Badge variant="warning">Setup Required</Badge>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div>
                    <h6 className="font-medium text-yellow-900">Certificate Installation</h6>
                    <p className="text-sm text-yellow-700">Install your institution's digital certificate</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
                
                <p className="text-sm text-gray-600">
                  Digital certificates will be configured after the initial setup. 
                  You can use electronic signatures until digital certificates are installed.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </OnboardingLayout>
  );
}