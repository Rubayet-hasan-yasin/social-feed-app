
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string; 
}


export interface Post {
  id: string;
  text: string;
  userId: string;
  username: string;
  createdAt: string; 
  likeCount: number;
  commentCount: number;
  isLiked: boolean; 
}


export interface Comment {
  id: string;
  text: string;
  postId: string;
  userId: string;
  username: string;
  createdAt: string; 
}
