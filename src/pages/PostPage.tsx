import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PostCard } from '@/components/posts/PostCard';
import { CommentList } from '@/components/comments/CommentList';
import { CommentForm } from '@/components/comments/CommentForm';
import { Sidebar } from '@/components/layout/Sidebar';
import { store, type User, type Post, type Comment } from '@/store';
import { ArrowLeft, MessageSquare } from 'lucide-react';

interface PostPageProps {
  postId: string;
  currentUser: User | null;
  onBack: () => void;
  onLoginRequired: () => void;
}

export function PostPage({ postId, currentUser, onBack, onLoginRequired }: PostPageProps) {
  const [post, setPost] = useState<Post | undefined>(store.getPost(postId));
  const [comments, setComments] = useState<Comment[]>(store.getPostComments(postId));
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setPost(store.getPost(postId));
      setComments(store.getPostComments(postId));
      forceUpdate({});
    });
    return unsubscribe;
  }, [postId]);

  const handleCommentSuccess = () => {
    setComments(store.getPostComments(postId));
  };

  const handlePostDeleted = () => {
    onBack();
  };

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
          <p className="text-muted-foreground mb-4">This post may have been deleted or doesn't exist.</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const author = store.getUser(post.authorId);

  return (
    <div className="container mx-auto px-4 py-6" data-testid="post-page">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <main className="flex-1 min-w-0 space-y-4">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-2"
            data-testid="back-to-home"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Button>

          {/* Post */}
          <PostCard
            post={post}
            author={author}
            currentUser={currentUser}
            showFullContent
            onDeleted={handlePostDeleted}
          />

          {/* Comments Section */}
          <Card className="bg-card/80 backdrop-blur border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-semibold" data-testid="comments-title">
                  Comments ({comments.length})
                </h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Comment Form */}
              {currentUser ? (
                <CommentForm
                  postId={postId}
                  onSuccess={handleCommentSuccess}
                />
              ) : (
                <div 
                  className="p-4 border border-dashed border-border rounded-lg text-center"
                  data-testid="login-to-comment"
                >
                  <p className="text-muted-foreground text-sm mb-2">
                    Log in to join the discussion
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onLoginRequired}
                    data-testid="login-to-comment-btn"
                  >
                    Log In
                  </Button>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-border/50" />

              {/* Comments List */}
              <CommentList 
                comments={comments}
                currentUser={currentUser}
              />
            </CardContent>
          </Card>
        </main>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}


