import api from './axios';
import { POSTS_API_URL } from '../config/api';
import { Post } from '../types';

export const getFeed = async (): Promise<Post[]> => {
  const res = await api.get(`${POSTS_API_URL}/posts/feed`);
  return res.data;
};

export const getPostsByUser = async (userId: string): Promise<Post[]> => {
  const res = await api.get(`${POSTS_API_URL}/posts/user/${userId}`);
  return res.data;
};

export const createPost = async (data: { imageUrl: string; caption?: string }): Promise<Post> => {
  const res = await api.post(`${POSTS_API_URL}/posts`, data);
  return res.data;
};

export const updatePost = async (postId: string, caption: string): Promise<Post> => {
  const res = await api.patch(`${POSTS_API_URL}/posts/${postId}`, { caption });
  return res.data;
};

export const deletePost = async (postId: string): Promise<void> => {
  await api.delete(`${POSTS_API_URL}/posts/${postId}`);
};

export const toggleLike = async (postId: string): Promise<{ liked: boolean; likesCount: number }> => {
  const res = await api.post(`${POSTS_API_URL}/posts/${postId}/like`);
  return res.data;
};

export const addComment = async (postId: string, text: string): Promise<Post> => {
  const res = await api.post(`${POSTS_API_URL}/posts/${postId}/comments`, { text });
  return res.data;
};

export const deleteComment = async (postId: string, commentId: string): Promise<Post> => {
  const res = await api.delete(`${POSTS_API_URL}/posts/${postId}/comments/${commentId}`);
  return res.data;
};
