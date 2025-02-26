import { useState } from 'react';
import type { EdVideo } from '@/types/edvideo';

interface AddVideoFormProps {
  onAddVideo: (url: string) => Promise<EdVideo>;
  isLoading: boolean;
}

export const AddVideoForm = ({ onAddVideo, isLoading }: AddVideoFormProps) => {
  const [videoUrl, setVideoUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) return;

    try {
      await onAddVideo(videoUrl);
      setVideoUrl('');
    } catch (error) {
      console.error('Error adding video:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-4">
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter video URL"
          className="flex-1 p-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Adding...' : 'Add Video'}
        </button>
      </div>
    </form>
  );
};