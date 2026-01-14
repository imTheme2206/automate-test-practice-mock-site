import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PostCard } from '@/components/posts/PostCard';
import { Sidebar } from '@/components/layout/Sidebar';
import { store, type User, type Post, type Comment } from '@/store';
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  FileText,
  User as UserIcon,
} from 'lucide-react';

interface ProfilePageProps {
  userId: string;
  currentUser: User | null;
  onBack: () => void;
  onPostClick: (postId: string) => void;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function ProfilePage({
  userId,
  currentUser,
  onBack,
  onPostClick,
}: ProfilePageProps) {
  const [user, setUser] = useState<User | undefined>(store.getUser(userId));
  const [posts, setPosts] = useState<Post[]>(store.getUserPosts(userId));
  const [comments, setComments] = useState<Comment[]>(
    store.getUserComments(userId)
  );
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setUser(store.getUser(userId));
      setPosts(store.getUserPosts(userId));
      setComments(store.getUserComments(userId));
    });
    return unsubscribe;
  }, [userId]);

  if (!user || !user.username) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
          <p className="text-muted-foreground mb-4">This user doesn't exist.</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userId;

  return (
    <div className="container mx-auto px-4 py-6" data-testid="profile-page">
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

          {/* Profile Header */}
          <Card className="bg-card/80 backdrop-blur border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                  style={{ backgroundColor: user.avatar }}
                  data-testid="profile-avatar"
                >
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h1
                    className="text-2xl font-bold"
                    data-testid="profile-username"
                  >
                    u/{user.username}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span data-testid="profile-joined">
                        Joined {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span data-testid="profile-post-count">
                        {posts.length} posts
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span data-testid="profile-comment-count">
                        {comments.length} comments
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-border/50 pb-2">
            <Button
              variant={activeTab === 'posts' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('posts')}
              data-testid="tab-posts"
              className={
                activeTab === 'posts' ? 'bg-orange-500 hover:bg-orange-600' : ''
              }
            >
              <FileText className="h-4 w-4 mr-1" />
              Posts ({posts.length})
            </Button>
            <Button
              variant={activeTab === 'comments' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('comments')}
              data-testid="tab-comments"
              className={
                activeTab === 'comments'
                  ? 'bg-orange-500 hover:bg-orange-600'
                  : ''
              }
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Comments ({comments.length})
            </Button>
          </div>

          {/* Content */}
          {activeTab === 'posts' ? (
            <div className="space-y-4" data-testid="profile-posts">
              {posts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>
                    {isOwnProfile ? "You haven't" : `u/${user.username} hasn't`}{' '}
                    created any posts yet.
                  </p>
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    author={user}
                    currentUser={currentUser}
                    onClick={() => onPostClick(post.id)}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3" data-testid="profile-comments">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>
                    {isOwnProfile ? "You haven't" : `u/${user.username} hasn't`}{' '}
                    made any comments yet.
                  </p>
                </div>
              ) : (
                comments.map((comment) => {
                  const post = store.getPost(comment.postId);
                  return (
                    <Card
                      key={comment.id}
                      className="bg-card/60 backdrop-blur border-border/50 cursor-pointer hover:border-orange-500/30"
                      onClick={() => onPostClick(comment.postId)}
                      data-testid={`profile-comment-${comment.id}`}
                    >
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground mb-2">
                          Comment on:{' '}
                          <span className="font-medium text-foreground">
                            {post?.title || '[deleted post]'}
                          </span>
                        </p>
                        <p className="text-sm">{comment.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {comment.upvotes - comment.downvotes} points
                        </p>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </main>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
