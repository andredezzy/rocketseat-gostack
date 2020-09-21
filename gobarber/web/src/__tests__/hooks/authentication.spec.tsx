import MockAdapter from 'axios-mock-adapter';

import { renderHook, act } from '@testing-library/react-hooks';

import api from '../../services/api';
import {
  useAuthentication,
  AuthenticationProvider,
} from '../../hooks/authentication';

const apiMock = new MockAdapter(api);

describe('Authentication hook', () => {
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: 'user-id',
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
      token: 'user-token',
    };

    apiMock.onPost('sessions').reply(200, apiResponse);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(
      () => useAuthentication(),
      {
        wrapper: AuthenticationProvider,
      },
    );

    result.current.signIn({
      email: 'johndoe@example.com',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:token',
      apiResponse.token,
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user),
    );

    expect(result.current.user.id).toEqual('user-id');
    expect(result.current.user.email).toEqual('johndoe@example.com');
  });

  it('should restore saved data from storage when authentication inits', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'user-token';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user-id',
            name: 'John Doe',
            email: 'johndoe@example.com',
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuthentication(), {
      wrapper: AuthenticationProvider,
    });

    expect(result.current.user.id).toEqual('user-id');
    expect(result.current.user.email).toEqual('johndoe@example.com');
  });

  it('should be able to sign out', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'user-token';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user-id',
            name: 'John Doe',
            email: 'johndoe@example.com',
          });
        default:
          return null;
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuthentication(), {
      wrapper: AuthenticationProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(removeItemSpy).toHaveBeenCalledWith('@GoBarber:token');
    expect(removeItemSpy).toHaveBeenCalledWith('@GoBarber:user');

    expect(result.current.user).toBeUndefined();
  });

  it('should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuthentication(), {
      wrapper: AuthenticationProvider,
    });

    const user = {
      id: 'user-id',
      name: 'John Doe',
      email: 'johndoe@example.com',
      avatar_url: 'image-test.jpg',
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );

    expect(result.current.user).toEqual(user);
  });
});
