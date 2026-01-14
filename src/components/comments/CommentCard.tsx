import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { store, type Comment, type User } from '@/store';
import { ArrowUp, ArrowDown, Trash2, Clock, User as UserIcon, Reply } from 'lucide-react';
import { CommentForm } from './CommentForm';

interface CommentCardProps {
  comment: Comment;
  author: User | undefined;
  currentUser: User | null;
  depth?: number;
  allComments: Comment[];
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

export function CommentCard({ comment, author, currentUser, depth = 0, allComments }: CommentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [, forceUpdate] = useState({});
  
  const score = comment.upvotes - comment.downvotes;
  const userVote = currentUser ? comment.votedBy[currentUser.id] : undefined;
  const isOwner = currentUser?.id === comment.authorId;
  const maxDepth = 4;

  // Get child comments
  const childComments = allComments.filter(c => c.parentId === comment.id);

  const handleVote = (voteType: 'up' | 'down') => {
    store.voteComment(comment.id, voteType);
    forceUpdate({});
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    store.deleteComment(comment.id);
  };

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    forceUpdate({});
  };

  const depthColors = [
    'border-l-orange-500',
    'border-l-blue-500',
    'border-l-green-500',
    'border-l-purple-500',
    'border-l-pink-500'
  ];

  return (
    <div 
      className={`${depth > 0 ? `ml-4 pl-4 border-l-2 ${depthColors[depth % depthColors.length]}` : ''}`}
      data-testid={`comment-${comment.id}`}
    >
      <div className="py-3">
        {/* Comment Header */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          {author ? (
            <>
              <div 
                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: author.avatar }}
              >
                {author.username[0].toUpperCase()}
              </div>
              <span className="font-medium text-foreground" data-testid={`comment-author-${comment.id}`}>
                u/{author.username}
              </span>
            </>
          ) : (
            <>
              <UserIcon className="w-4 h-4" />
              <span>[deleted]</span>
            </>
          )}
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span data-testid={`comment-time-${comment.id}`}>{formatTimeAgo(comment.createdAt)}</span>
          </div>
        </div>

        {/* Comment Content */}
        <p 
          className="text-sm text-foreground mb-2"
          data-testid={`comment-content-${comment.id}`}
        >
          {comment.content}
        </p>

        {/* Comment Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 ${userVote === 'up' ? 'text-orange-500 bg-orange-500/10' : 'text-muted-foreground hover:text-orange-500'}`}
              onClick={() => handleVote('up')}
              data-testid={`comment-upvote-${comment.id}`}
              disabled={!currentUser}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <span 
              className={`text-xs font-medium min-w-[1.5rem] text-center ${score > 0 ? 'text-orange-500' : score < 0 ? 'text-blue-500' : 'text-muted-foreground'}`}
              data-testid={`comment-score-${comment.id}`}
            >
              {score}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 ${userVote === 'down' ? 'text-blue-500 bg-blue-500/10' : 'text-muted-foreground hover:text-blue-500'}`}
              onClick={() => handleVote('down')}
              data-testid={`comment-downvote-${comment.id}`}
              disabled={!currentUser}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>

          {currentUser && depth < maxDepth && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setShowReplyForm(!showReplyForm)}
              data-testid={`comment-reply-btn-${comment.id}`}
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>
          )}

          {isOwner && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground hover:text-red-500"
              onClick={handleDelete}
              disabled={isDeleting}
              data-testid={`comment-delete-${comment.id}`}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          )}
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-3">
            <CommentForm
              postId={comment.postId}
              parentId={comment.id}
              onSuccess={handleReplySuccess}
              onCancel={() => setShowReplyForm(false)}
              placeholder="Write a reply..."
              compact
            />
          </div>
        )}
      </div>

      {/* Child Comments */}
      {childComments.length > 0 && (
        <div className="space-y-0">
          {childComments.map(child => (
            <CommentCard
              key={child.id}
              comment={child}
              author={store.getUser(child.authorId)}
              currentUser={currentUser}
              depth={depth + 1}
              allComments={allComments}
            />
          ))}
        </div>
      )}
    </div>
  );
}


