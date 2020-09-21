import React from 'react';
import { AuthenticationProvider } from './authentication';
import { ToastProvider } from './toast';

const AppProvider: React.FC = ({ children }) => (
  <AuthenticationProvider>
    <ToastProvider>{children}</ToastProvider>
  </AuthenticationProvider>
);

export default AppProvider;
