import api from './axios';
import { AUTH_API_URL } from '../config/api';
import { AuthResponse, User } from '../types';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await api.post(`${AUTH_API_URL}/auth/login`, { email, password });
  // normalize id → userId
  const { user, access_token } = res.data;
  return {
    access_token,
    user: {
      userId: user.id || user.userId,
      username: user.username,
      email: user.email,
    },
  };
};

export const signup = async (email: string, username: string, password: string): Promise<void> => {
  await api.post(`${AUTH_API_URL}/auth/signup`, { email, username, password });
};

export const getMe = async (): Promise<User> => {
  const res = await api.get(`${AUTH_API_URL}/auth/me`);
  return res.data; // already returns { userId, username, email }
};
