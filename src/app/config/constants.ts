export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    YOUTUBE_THUMBNAIL_BASE_URL: 'http://img.youtube.com/vi',
  };
  
  export const ERROR_MESSAGES = {
    VIDEOS_LOAD_ERROR: 'Failed to load videos. Please try again.',
    INVALID_VIDEO_URL: 'Invalid video URL provided.',
    LOGIN_REQUIRED: 'Please log in to view videos.',
  };