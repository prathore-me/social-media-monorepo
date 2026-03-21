import api from './axios';
import { USERS_API_URL } from '../config/api';
import { Profile } from '../types';

export const getProfileByUsername = async (username: string): Promise<Profile> => {
  const res = await api.get(`${USERS_API_URL}/profiles/${username}`);
  return res.data;
};

export const getProfileByUserId = async (userId: string): Promise<Profile> => {
  const res = await api.get(`${USERS_API_URL}/profiles/id/${userId}`);
  return res.data;
};

export const searchProfiles = async (query: string): Promise<Profile[]> => {
  const res = await api.get(`${USERS_API_URL}/profiles/search?q=${query}`);
  return res.data;
};

export const updateProfile = async (data: { bio?: string; profilePic?: string }): Promise<Profile> => {
  const res = await api.patch(`${USERS_API_URL}/profiles`, data);
  return res.data;
};

export const toggleFollow = async (userId: string): Promise<{ following: boolean }> => {
  const res = await api.post(`${USERS_API_URL}/profiles/${userId}/follow`);
  return res.data;
};
