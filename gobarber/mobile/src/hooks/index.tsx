import React from 'react';
import { AuthenticationProvider } from './authentication';

const AppProvider: React.FC = ({ children }) => (
  <AuthenticationProvider>{children}</AuthenticationProvider>
);

export default AppProvider;
