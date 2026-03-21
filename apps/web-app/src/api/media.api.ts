import api from './axios';
import { MEDIA_API_URL } from '../config/api';

export type UploadBucket = 'posts-images' | 'profile-pictures' | 'videos';

export const uploadFile = async (
  file: File,
  bucket: UploadBucket,
): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post(`${MEDIA_API_URL}/media/upload/${bucket}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};
