import { Comment } from "./comment";

export interface EdVideo {
    id: string;
    title: string;
    video_url: string;
    created_at: Date;
    description: string;
    num_comments: number;
    thumbnail?: string;
    comments?: Comment[];
    user_id: string;
  }

export interface NewVideo {
    user_id: string;
    description: string;
    video_url: string;
    title: string;
  }

export interface VideoResponse {
    videos: EdVideo[];
}