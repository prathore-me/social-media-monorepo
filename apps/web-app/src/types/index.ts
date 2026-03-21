export interface User {
  userId: string;
  username: string;
  email: string;
}

export interface Profile {
  _id: string;
  userId: string;
  username: string;
  bio: string;
  profilePic: string;
  followers: string[];
  following: string[];
  createdAt: string;
}

export interface Comment {
  _id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  userId: string;
  username: string;
  imageUrl: string;
  caption: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
