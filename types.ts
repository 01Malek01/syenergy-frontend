// axiosError.ts
export interface AxiosErrorResponse {
  message: string;
}

export interface AxiosError {
  response?: {
    data: AxiosErrorResponse;
    status: number;
    statusText: string;
  };
  request?: unknown;
  message?: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  postId?: string;
}

export type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  user?: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export type User = {
  name: string;
  email?: string;
  isAuthenticated?: boolean;
  _id?: string;
  bio?: string;
};

export type Comment = {
  id: string;
  author: string;
  content: string;
  publishDate?: string;
  createdAt?: string;
};
export type PostComment = {
  author: string;
  content: string;
  createdAt: string;
  _id: string;
  post: string;
  authorName: string;
};

export interface PostContextValue {
  posts: Post[];
  isLoading: boolean;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}
