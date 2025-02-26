import type { EdVideo, NewVideo, VideoResponse } from '@/types/edvideo';
import { BASE_URL, handleResponse } from '@/lib/api/utils';

/**
 * Creates a new video.
 * POST /videos
 */
export async function createVideo(data: NewVideo) {
  const response = await fetch(`${BASE_URL}/videos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
}

/**
 * Retrieves all videos for a given user.
 * GET /videos?user_id=...
 */
export async function getUserVideos(user_id: string): Promise<EdVideo[]> {
  const response = await fetch(`${BASE_URL}/videos?user_id=${encodeURIComponent(user_id)}`, {
    method: 'GET'
  });
  const responseObj = await handleResponse<VideoResponse>(response);
  return responseObj.videos;
}