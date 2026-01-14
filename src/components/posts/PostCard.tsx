import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { store, type Post, type User } from '@/store';
import { ArrowUp, ArrowDown, MessageSquare, Trash2, Clock, User as UserIcon } from 'lucide-react';

interface PostCardProps {
  post: Post;
  author: User | undefined;
  currentUser: User | null;
  onClick?: () => void;
  showFullContent?: boolean;
  onDeleted?: () => void;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function PostCard({ post, author, currentUser, onClick, showFullContent = false, onDeleted }: PostCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const score = post.upvotes - post.downvotes;
  const userVote = currentUser ? post.votedBy[currentUser.id] : undefined;
  const commentCount = store.getPostComments(post.id).length;
  const isOwner = currentUser?.id === post.authorId;

  const handleVote = (e: React.MouseEvent, voteType: 'up' | 'down') => {
    e.stopPropagation();
    store.votePost(post.id, voteType);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    store.deletePost(post.id);
    onDeleted?.();
  };

  return (
    <Card 
      className={`bg-card/80 backdrop-blur border-border/50 hover:border-orange-500/30 transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      data-testid={`post-card-${post.id}`}
    >
      <CardContent className="p-0">
        <div className="flex">
          {/* Vote Section */}
          <div className="flex flex-col items-center gap-1 p-3 bg-muted/30 rounded-l-lg">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${userVote === 'up' ? 'text-orange-500 bg-orange-500/10' : 'text-muted-foreground hover:text-orange-500'}`}
              onClick={(e) => handleVote(e, 'up')}
              data-testid={`post-upvote-${post.id}`}
              disabled={!currentUser}
              title={currentUser ? 'Upvote' : 'Login to vote'}
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
            <span 
              className={`text-sm font-bold ${score > 0 ? 'text-orange-500' : score < 0 ? 'text-blue-500' : 'text-muted-foreground'}`}
              data-testid={`post-score-${post.id}`}
            >
              {score}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${userVote === 'down' ? 'text-blue-500 bg-blue-500/10' : 'text-muted-foreground hover:text-blue-500'}`}
              onClick={(e) => handleVote(e, 'down')}
              data-testid={`post-downvote-${post.id}`}
              disabled={!currentUser}
              title={currentUser ? 'Downvote' : 'Login to vote'}
            >
              <ArrowDown className="h-5 w-5" />
            </Button>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-4 min-w-0">
            {/* Meta */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                {author ? (
                  <>
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: author.avatar }}
                    >
                      {author.username[0].toUpperCase()}
                    </div>
                    <span className="font-medium text-foreground" data-testid={`post-author-${post.id}`}>
                      u/{author.username}
                    </span>
                  </>
                ) : (
                  <>
                    <UserIcon className="w-4 h-4" />
                    <span>[deleted]</span>
                  </>
                )}
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span data-testid={`post-time-${post.id}`}>{formatTimeAgo(post.createdAt)}</span>
              </div>
            </div>

            {/* Title */}
            <h3 
              className="text-lg font-semibold mb-2 text-foreground leading-snug"
              data-testid={`post-title-${post.id}`}
            >
              {post.title}
            </h3>

            {/* Content */}
            <p 
              className={`text-muted-foreground text-sm ${showFullContent ? '' : 'line-clamp-3'}`}
              data-testid={`post-content-${post.id}`}
            >
              {post.content}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-3 pt-2 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-8 px-2"
                onClick={(e) => { e.stopPropagation(); onClick?.(); }}
                data-testid={`post-comments-btn-${post.id}`}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</span>
              </Button>

              {isOwner && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-red-500 h-8 px-2"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  data-testid={`post-delete-${post.id}`}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


