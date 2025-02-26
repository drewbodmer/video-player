export interface Comment {
    video_id: string;
    content: string;
    user_id: string;
    created_at: Date;
}

export interface CommentResponse {
  comments: Comment[]
}

export interface NewComment{
    video_id: string;
    content: string;
    user_id: string;
}