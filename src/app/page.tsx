'use client';

import { useState } from 'react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { VideoList } from '@/components/VideoList';
import { CommentList } from '@/components/Comments';
import { Header } from '@/components/layout/Header';
import { useVideos } from '@/hooks/useVideos';
import { LoginForm } from '@/components/auth/LoginForm';



import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Home() {
  const [userId, setUserId] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {
    videos,
    selectedVideo,
    setSelectedVideo,
    addVideo
  } = useVideos(userId, isLoggedIn);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim()) {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <LoginForm
        userId={userId}
        onUserIdChange={setUserId}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <main className="min-h-screen p-8 scrollbar-hide">
      <div className="max-w-[1800px] mx-auto">
        <Header userId={userId} />
        <ResizablePanelGroup className="w-full" direction="horizontal">
          <ResizablePanel defaultSize={75}  minSize={40}>
            {selectedVideo && <VideoPlayer video={selectedVideo} />}
            {selectedVideo && <CommentList video={selectedVideo} user_id={userId} />}
          </ResizablePanel>
          <ResizableHandle className="ml-5 mr-5" />
          <ResizablePanel defaultSize={30} minSize={25}>
            <VideoList videos={videos} onVideoSelect={setSelectedVideo} onAddVideo={addVideo} selectedVideo={selectedVideo} user_id={userId} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
}
