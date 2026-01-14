import { PostList } from '@/components/posts/PostList';
import { CreatePostForm } from '@/components/posts/CreatePostForm';
import { Sidebar } from '@/components/layout/Sidebar';
import { store, type User } from '@/store';
import { useState, useEffect } from 'react';

interface HomePageProps {
  currentUser: User | null;
  onPostClick: (postId: string) => void;
  showCreatePost: boolean;
  onCreatePostSuccess: (postId: string) => void;
  onCreatePostCancel: () => void;
}

export function HomePage({ 
  currentUser, 
  onPostClick, 
  showCreatePost, 
  onCreatePostSuccess,
  onCreatePostCancel 
}: HomePageProps) {
  const [posts, setPosts] = useState(store.getAllPosts());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setPosts(store.getAllPosts());
    });
    return unsubscribe;
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {showCreatePost && currentUser && (
            <div className="mb-6">
              <CreatePostForm 
                onSuccess={onCreatePostSuccess}
                onCancel={onCreatePostCancel}
              />
            </div>
          )}

          <div className="mb-4">
            <h1 className="text-2xl font-bold" data-testid="home-title">
              Latest Posts
            </h1>
            <p className="text-sm text-muted-foreground mt-1" data-testid="post-count">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </p>
          </div>

          <PostList 
            posts={posts} 
            currentUser={currentUser}
            onPostClick={onPostClick}
          />
        </main>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}


