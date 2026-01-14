import { PostCard } from './PostCard';
import { store, type Post, type User } from '@/store';

interface PostListProps {
  posts: Post[];
  currentUser: User | null;
  onPostClick?: (postId: string) => void;
}

export function PostList({ posts, currentUser, onPostClick }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div 
        className="text-center py-12 text-muted-foreground"
        data-testid="empty-post-list"
      >
        <p className="text-lg mb-2">No posts yet</p>
        <p className="text-sm">Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="post-list">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          author={store.getUser(post.authorId)}
          currentUser={currentUser}
          onClick={() => onPostClick?.(post.id)}
        />
      ))}
    </div>
  );
}

