import React from 'react';
import { useAuth } from '../context/AuthContext';
import { DocumentVerification } from '../pages/DocumentVerification';

export function DocumentVerificationWrapper() {
  const { state } = useAuth();
  const { user } = state;

  // For user routes, DocumentVerification is already wrapped in UserLayout
  // For admin routes, DocumentVerification is already wrapped in AdminLayout
  // This wrapper just passes through the component without additional layout
  
  return <DocumentVerification />;
}