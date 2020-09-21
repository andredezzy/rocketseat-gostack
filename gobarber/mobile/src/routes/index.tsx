import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import { useAuthentication } from '../hooks/authentication';

import AuthenticationRoutes from './authentication.routes';
import AppRoutes from './app.routes';

const Routes: React.FC = () => {
  const { user, loading } = useAuthentication();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  return user ? <AppRoutes /> : <AuthenticationRoutes />;
};

export default Routes;
