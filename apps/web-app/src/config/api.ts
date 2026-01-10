export const AUTH_API_URL = import.meta.env.DEV
  ? import.meta.env.VITE_AUTH_API_URL
  : 'REPLACE_WITH_VITE_AUTH_API_URL';

export const USERS_API_URL = import.meta.env.DEV
  ? import.meta.env.VITE_USERS_API_URL
  : 'REPLACE_WITH_VITE_USERS_API_URL';

export const POSTS_API_URL = import.meta.env.DEV
  ? import.meta.env.VITE_POSTS_API_URL
  : 'REPLACE_WITH_VITE_POSTS_API_URL';
