import { EdVideo } from "@/types/edvideo";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { NewVideo } from "@/types/edvideo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const videoFormSchema = z.object({
  user_id: z.string().min(1, "User ID is required"),
  title: z.string().min(1, "Title is required"),
  video_url: z.string().url("Must be a valid URL"),
  description: z.string().min(1, "Description is required"),
});

interface VideoListProps {
  videos: EdVideo[];
  selectedVideo: EdVideo | null;
  onVideoSelect: (video: EdVideo) => void;
  onAddVideo: (video: NewVideo) => Promise<void>;
  user_id: string;
}

export function VideoList({ videos, selectedVideo, onVideoSelect, onAddVideo, user_id }: VideoListProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof videoFormSchema>>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      user_id: user_id,
      title: "",
      video_url: "",
      description: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof videoFormSchema>) {
    try {
      setError(null);
      const newVideo: NewVideo = {
        ...values,
      };
      
      await onAddVideo(newVideo);
      setOpen(false);
      form.reset();
    } catch (error) {
      setError('Failed to add video. Please try again.');
      console.error('Error adding video:', error);
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b items-center">
        <div>
          <h2 className="text-2xl font-semibold">Other Videos</h2>
          <p className="text-sm text-muted-foreground mb-4 ">
            Browse through the video collection
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mb-2 w-full min-w-[120px]">
              <PlusCircle className="mr-1" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background">
            <DialogHeader>
              <DialogTitle>Add New Video</DialogTitle>
              <DialogDescription>
                Add a new video to the collection.
              </DialogDescription>
            </DialogHeader>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 relative z-50">
                <FormField
                  control={form.control}
                  name="user_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter User ID"
                          {...field}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter video title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="video_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter video description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Adding...' : 'Add Video'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="mt-5 max-h-[800px] min-w-[250px] rounded-md border">
        <div className="grid gap-4 p-4">
          {videos.length === 0 ? (
            <div className="text-center text-sm text-gray-500">
              No videos found
            </div>
          ) : (
            videos.map((video) => (
              <Card
                key={video.id}
                className={cn(
                  "cursor-pointer transition-colors hover:bg-accent",
                  selectedVideo?.id === video.id && "bg-accent"
                )}
                onClick={() => onVideoSelect(video)}
              >
                <CardContent className="p-4 grid grid-cols-[100px_1fr] gap-4">
                  <AspectRatio ratio={4 / 3} className="overflow-hidden rounded-md">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                      className="object-cover"
                      />
                    </AspectRatio>
                  <div className="space-y-1">
                    <h3 className="font-medium leading-none">
                        {video.title}
                      </h3>
                    {video.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {video.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground line-clamp-2">{video.user_id}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}