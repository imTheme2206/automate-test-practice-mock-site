import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { store } from '@/store';
import { PenLine, X } from 'lucide-react';

interface CreatePostFormProps {
  onSuccess?: (postId: string) => void;
  onCancel?: () => void;
}

export function CreatePostForm({ onSuccess, onCancel }: CreatePostFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = store.createPost(title, content);

    setIsLoading(false);

    if (result.success && result.post) {
      setTitle('');
      setContent('');
      onSuccess?.(result.post.id);
    } else {
      setError(result.error || 'Failed to create post');
    }
  };

  const charCountTitle = title.length;
  const charCountContent = content.length;

  return (
    <Card className="bg-card/95 backdrop-blur border-orange-500/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PenLine className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-bold" data-testid="create-post-title">
              Create Post
            </h2>
          </div>
          {onCancel && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              data-testid="create-post-cancel"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          data-testid="create-post-form"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="post-title">Title</Label>
              <span
                className={`text-xs ${
                  charCountTitle < 5
                    ? 'text-muted-foreground'
                    : 'text-orange-500'
                }`}
              >
                {charCountTitle}/300
              </span>
            </div>
            <Input
              id="post-title"
              data-testid="post-title-input"
              type="text"
              placeholder="An interesting title for your post (min 5 chars)"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 300))}
              disabled={isLoading}
              maxLength={300}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="post-content">Content</Label>
              <span
                className={`text-xs ${
                  charCountContent < 10
                    ? 'text-muted-foreground'
                    : 'text-orange-500'
                }`}
              >
                {charCountContent}/10000
              </span>
            </div>
            <textarea
              id="post-content"
              data-testid="post-content-input"
              className="flex min-h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/10 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
              placeholder="Share your thoughts, questions, or discoveries... (min 10 chars)"
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, 10000))}
              disabled={isLoading}
              maxLength={10000}
            />
          </div>

          {error && (
            <div
              className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md"
              data-testid="create-post-error"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="flex gap-3">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className={`bg-orange-500 hover:bg-orange-600 text-white ${
                onCancel ? 'flex-1' : 'w-full'
              }`}
              disabled={isLoading}
              data-testid="create-post-submit"
            >
              {isLoading ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
