// Use relative URL for API routes
export const BASE_URL = '/api';

// The actual external API URL
export const EXTERNAL_API_URL = 'https://take-home-assessment-423502.uc.r.appspot.com/api';

// Helper function to handle responses
export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail || 'API request failed');
  }
  return response.json();
}