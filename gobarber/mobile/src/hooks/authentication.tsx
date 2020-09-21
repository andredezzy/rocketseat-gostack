import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface User {
  id: string;
  avatar_url: string;
  name: string;
  email: string;
}

interface AuthenticationContextData {
  user: User;
  loading: boolean;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): Promise<void>;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthenticationState {
  token: string;
  user: User;
}

const AuthenticationContext = createContext<AuthenticationContextData>(
  {} as AuthenticationContextData,
);

const AuthenticationProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthenticationState>(
    {} as AuthenticationState,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [[, token], [, user]] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);

      if (token && user) {
        api.defaults.headers.authorization = `Bearer ${token}`;

        setData({
          token,
          user: JSON.parse(user),
        });
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)],
    ]);

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);

    setData({} as AuthenticationState);
  }, []);

  const updateUser = useCallback(
    async (user: User) => {
      setData({
        token: data.token,
        user,
      });

      await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));
    },
    [data.token],
  );

  return (
    <AuthenticationContext.Provider
      value={{ user: data.user, loading, signIn, signOut, updateUser }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

function useAuthentication(): AuthenticationContextData {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error(
      "'useAuthentication' must be used within an 'AuthenticationProvider'",
    );
  }

  return context;
}

export { AuthenticationProvider, useAuthentication };
