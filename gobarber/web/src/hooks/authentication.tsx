import React, { createContext, useState, useCallback, useContext } from 'react';
import api from '../services/api';

interface User {
  id: string;
  avatar_url: string;
  name: string;
  email: string;
}

interface AuthenticationContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
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
  const [data, setData] = useState<AuthenticationState>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return {
        token,
        user: JSON.parse(user),
      };
    }

    return {} as AuthenticationState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');

    setData({} as AuthenticationState);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      setData({
        token: data.token,
        user,
      });

      localStorage.setItem('@GoBarber:user', JSON.stringify(user));
    },
    [data.token],
  );

  return (
    <AuthenticationContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

function useAuthentication(): AuthenticationContextData {
  const context = useContext(AuthenticationContext);

  return context;
}

export { AuthenticationProvider, useAuthentication };
