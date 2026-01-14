import { CommentCard } from './CommentCard';
import { store, type Comment, type User } from '@/store';

interface CommentListProps {
  comments: Comment[];
  currentUser: User | null;
}

export function CommentList({ comments, currentUser }: CommentListProps) {
  // Only show top-level comments (parentId === null)
  const topLevelComments = comments.filter(c => c.parentId === null);

  if (comments.length === 0) {
    return (
      <div 
        className="text-center py-8 text-muted-foreground"
        data-testid="empty-comment-list"
      >
        <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-0 divide-y divide-border/50" data-testid="comment-list">
      {topLevelComments.map(comment => (
        <CommentCard
          key={comment.id}
          comment={comment}
          author={store.getUser(comment.authorId)}
          currentUser={currentUser}
          allComments={comments}
        />
      ))}
    </div>
  );
}

