import type { EdVideo } from '@/types/edvideo';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { Poster } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import { SeekButton } from '@vidstack/react';
import { SeekForward10Icon, SeekBackward10Icon } from '@vidstack/react/icons';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import { formatDate } from '@/lib/utils';

interface VideoPlayerProps {
  video: EdVideo;
}

const isValidUrl = (urlString: string) => {
  try {
    return Boolean(new URL(urlString));
  } catch {
    return false;
  }
};

export const VideoPlayer = ({ video }: VideoPlayerProps) => {
  const [url, setUrl] = useState('');
  const [validUrl, setValidUrl] = useState(false);

  useEffect(() => {
    if (video?.video_url && isValidUrl(video.video_url)) {
      setUrl(video.video_url);
      setValidUrl(true);
    } else {
      setValidUrl(false);
    }
  }, [video]);


  const Seek = ({ icon: IconComponent, seconds }: { icon: React.ComponentType<{ className?: string }>, seconds: number }) => (
    <SeekButton
      className="ring-sky-400 relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md outline-none ring-inset hover:bg-white/20 data-[focus]:ring-4 aria-hidden:hidden"
      seconds={seconds}
    >
      <IconComponent className="h-8 w-8" />
    </SeekButton>
  );

  return (
    <>
      {!validUrl ? (
        <Alert className="mb-4" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Invalid video URL format</AlertDescription>
        </Alert>
      ) : null}
      <div style={{ visibility: validUrl ? 'visible' : 'hidden' }}>
        <MediaPlayer
          src={url}
          playsInline
          load="visible"
          title={video.title}
        >
          <MediaProvider>
            <Poster className="vds-poster" />
          </MediaProvider>
          <DefaultVideoLayout
            icons={defaultLayoutIcons}
            slots={{
              afterPlayButton: <><Seek icon={SeekBackward10Icon} seconds={-10} /><Seek icon={SeekForward10Icon} seconds={10} /></>,
            }}
          />
        </MediaPlayer>
        <div className='mt-4'>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">{video.title}</h1>
            <span>
              {formatDate(video.created_at)}
            </span>
          </div>
          <p className="text-muted-foreground">{video.description}</p>
        </div>
        <Separator className='mt-5 mb-5' />
      </div>
    </>
  );
};