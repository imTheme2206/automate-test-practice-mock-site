import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { store } from '@/store';

interface CommentFormProps {
  postId: string;
  parentId?: string | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  compact?: boolean;
}

export function CommentForm({ 
  postId, 
  parentId = null, 
  onSuccess, 
  onCancel,
  placeholder = "What are your thoughts?",
  compact = false
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const result = store.createComment(postId, content, parentId);
    
    setIsLoading(false);
    
    if (result.success) {
      setContent('');
      onSuccess?.();
    } else {
      setError(result.error || 'Failed to post comment');
    }
  };

  const testIdSuffix = parentId ? `-reply-${parentId}` : '';

  return (
    <form onSubmit={handleSubmit} className="space-y-2" data-testid={`comment-form${testIdSuffix}`}>
      <textarea
        data-testid={`comment-input${testIdSuffix}`}
        className={`flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/10 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y ${compact ? 'min-h-16' : 'min-h-24'}`}
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isLoading}
      />

      {error && (
        <div 
          className="p-2 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-md"
          data-testid={`comment-error${testIdSuffix}`}
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size={compact ? "sm" : "default"}
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          size={compact ? "sm" : "default"}
          className="bg-orange-500 hover:bg-orange-600 text-white"
          disabled={isLoading || content.length < 2}
          data-testid={`comment-submit${testIdSuffix}`}
        >
          {isLoading ? 'Posting...' : parentId ? 'Reply' : 'Comment'}
        </Button>
      </div>
    </form>
  );
}


