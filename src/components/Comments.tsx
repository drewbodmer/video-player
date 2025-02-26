import { ScrollArea } from "@/components/ui/scroll-area";
import { Comment, NewComment } from "@/types/comment";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, MessageCircle, PlusCircle, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { createComment, getVideoComments } from "@/lib/api/comments";
import { EdVideo } from "@/types/edvideo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay
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

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDate } from "@/lib/utils";

interface CommentListProps {
  video: EdVideo;
  user_id: string;
}

interface ExpandableCommentProps {
  comment: Comment;
  maxLength?: number;
  maxLines?: number;
}

const ExpandableComment = ({ comment, maxLength = 150, maxLines = 6 }: ExpandableCommentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const lines = comment.content.split(/\r?\n/);
  const shouldTruncateLines = (lines.length > maxLines);
  const shouldTruncateText = (comment.content.length > maxLength);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  let displayContent = shouldTruncateText && !isExpanded
    ? `${comment.content.slice(0, maxLength)}...`
    : comment.content;

  displayContent = shouldTruncateLines && !isExpanded && lines.length > maxLines
    ? lines.slice(0, maxLines).join("\n") + "..."
    : displayContent;

  return (
    <div className="space-y-2 m-4">
      <Separator />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium">{comment.user_id}</span>
        <span>•</span>
        <span>
          {formatDate(comment.created_at)}
        </span>
      </div>
      <div>
        <p className="text-sm whitespace-pre-wrap">{displayContent}</p>
        {(shouldTruncateText || shouldTruncateLines) && (
          <button
            onClick={toggleExpand}
            className="text-xs text-primary hover:underline mt-1 flex items-center gap-1"
          >
            {isExpanded ? (
              <>Show Less <ChevronUp className="h-3 w-3" /></>
            ) : (
              <>Show More <ChevronDown className="h-3 w-3" /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const commentFormSchema = z.object({
  user_id: z.string().min(1, "User ID is required"),
  content: z.string().min(1, "Content is required"),
});

export function CommentList({ video, user_id }: CommentListProps) {
  const [commentsOpen, setCommentsOpen] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof commentFormSchema>>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      user_id: user_id,
      content: "",
    },
  });

  const fetchComments = async () => {
    try {
      setError(null);
      const videoComments = await getVideoComments(video.id);
      setComments(videoComments);
    } catch (error) {
      setError('Failed to load comments');
      console.error('Error fetching comments:', error);
    }
  };

  // Fetch comments when video changes
  useEffect(() => {
    fetchComments();
  }, [video.id]);

  async function onSubmit(values: z.infer<typeof commentFormSchema>) {
    try {
      const newComment: NewComment = {
        ...values,
        video_id: video.id
      };
      await createComment(newComment);
      await fetchComments(); // Refresh comments after posting
      setFormOpen(false);
      form.reset();
    } catch (error) {
      setError('Failed to post comment');
      console.error('Error posting comment:', error);
    } finally {
    }
  }

  return (
    <Collapsible
      open={commentsOpen}
      onOpenChange={setCommentsOpen}
      className="mt-3 w-full space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <h2 className="text-xl font-semibold tracking-tight">Comments ({comments.length})</h2>
          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button className="w-25 mr-2">
                <PlusCircle className="mr-1" />
                Add Comment
              </Button>
            </DialogTrigger>
            <DialogContent >
              <DialogHeader>
                <DialogTitle>Add New Comment</DialogTitle>
                <DialogDescription>
                  Express an opinion or ask a question!
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="user_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter User ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter comment"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit">Add Comment</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>

            <DialogOverlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" style={{ zIndex: -1 }} />
          </Dialog>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {commentsOpen ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="relative border-0">
          <ScrollArea className="h-[400px] pr-4 border rounded-md">
            <div className="space-y-4 mb-2">
              {comments.length === 0 ? (
                <div className="flex justify-center items-center h-[200px]">
                  <p className="text-center text-muted-foreground">No comments yet</p>
                </div>
              ) : (
                comments.map((comment, i) => (
                  <ExpandableComment key={i} comment={comment} maxLength={150} />
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}