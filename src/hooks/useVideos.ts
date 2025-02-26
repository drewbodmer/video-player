import { useState, useEffect } from 'react';
import { EdVideo, NewVideo } from '@/types/edvideo';
import { getUserVideos, createVideo } from '@/lib/api/videos';
import getVideoId from 'get-video-id';

export function useVideos(userId: string, isLoggedIn: boolean) {
  const [videos, setVideos] = useState<EdVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<EdVideo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      loadVideos();
    }
  }, [isLoggedIn, userId]);

  const loadVideos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const loadedVideos = await getUserVideos(userId);
      const videosWithThumbnails = loadThumbnails(loadedVideos);
      setVideos(videosWithThumbnails);
      setSelectedVideo(videosWithThumbnails[0]);
    } catch (error) {
      setError('Failed to load videos. Please try again.');
      console.error('Error loading videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addVideo = async (newVideo: NewVideo) => {
    setIsLoading(true);
    setError(null);
    try {
      await createVideo(newVideo);
      await loadVideos(); // Reload the videos list after adding
    } catch (error) {
      setError('Failed to add video. Please try again.');
      console.error('Error adding video:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loadThumbnails = (videos: EdVideo[]): EdVideo[] => {
    return videos.map(video => ({
      ...video,
      thumbnail: parseYTThumbnailUrl(video.video_url),
    }));
  };

  const parseYTThumbnailUrl = (url: string): string => {
    const video_id = getVideoId(url).id;
    return `http://img.youtube.com/vi/${video_id}/0.jpg`;
  };

  return {
    videos,
    selectedVideo,
    isLoading,
    error,
    setSelectedVideo,
    loadVideos,
    addVideo,
  };
}
