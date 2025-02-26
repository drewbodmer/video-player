
import { BASE_URL, handleResponse } from '@/lib/api/utils';
import { Comment, NewComment, CommentResponse } from '@/types/comment';



/**
 * Create a new comment on a video
 * POST /videos/comments
 */
export async function createComment(data: NewComment) {
  const response = await fetch(`${BASE_URL}/videos/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

/**
 * Retrieve all comments for a given video
 * GET /videos/comments?video_id=...
 */
export async function getVideoComments(video_id: string): Promise<Comment[]> {
  const response = await fetch(`${BASE_URL}/videos/comments?video_id=${encodeURIComponent(video_id)}`, {
    method: 'GET'
  });
  const responseObj = await handleResponse<CommentResponse>(response);
  return responseObj.comments;
}