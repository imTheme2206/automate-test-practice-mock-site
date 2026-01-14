import { serve } from "bun";
import index from "./index.html";

// In-memory store for API (mirrors frontend store for API testing)
interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  avatar: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
}

interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  parentId: string | null;
  createdAt: string;
  upvotes: number;
  downvotes: number;
}

// Simple in-memory store for API
const apiStore = {
  users: new Map<string, User>(),
  posts: new Map<string, Post>(),
  comments: new Map<string, Comment>(),
  sessions: new Map<string, string>(), // token -> userId
};

// Initialize with demo data
function initializeStore() {
  const demoUser1: User = {
    id: 'user-1',
    username: 'demo_user',
    email: 'demo@example.com',
    password: 'password123',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    avatar: '#4ECDC4'
  };

  const demoUser2: User = {
    id: 'user-2',
    username: 'test_automation',
    email: 'test@example.com',
    password: 'test123',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    avatar: '#FF6B6B'
  };

  apiStore.users.set(demoUser1.id, demoUser1);
  apiStore.users.set(demoUser2.id, demoUser2);

  const demoPost1: Post = {
    id: 'post-1',
    title: 'Welcome to MockReddit - A Testing Practice Site',
    content: 'This is a mock Reddit clone designed for practicing automated testing.',
    authorId: 'user-1',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 42,
    downvotes: 3
  };

  apiStore.posts.set(demoPost1.id, demoPost1);
}

initializeStore();

// Helper to get user from auth header
function getUserFromAuth(req: Request): User | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  
  const token = authHeader.slice(7);
  const userId = apiStore.sessions.get(token);
  if (!userId) return null;
  
  return apiStore.users.get(userId) || null;
}

// JSON response helper
function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes
    "/*": index,

    // Auth endpoints
    "/api/auth/register": {
      async POST(req) {
        try {
          const body = await req.json();
          const { username, email, password } = body;

          // Validation
          if (!username || username.length < 3) {
            return jsonResponse({ error: 'Username must be at least 3 characters' }, 400);
          }
          if (!email || !email.includes('@')) {
            return jsonResponse({ error: 'Please enter a valid email address' }, 400);
          }
          if (!password || password.length < 6) {
            return jsonResponse({ error: 'Password must be at least 6 characters' }, 400);
          }

          // Check if username/email exists
          for (const user of apiStore.users.values()) {
            if (user.username.toLowerCase() === username.toLowerCase()) {
              return jsonResponse({ error: 'Username already taken' }, 400);
            }
            if (user.email.toLowerCase() === email.toLowerCase()) {
              return jsonResponse({ error: 'Email already registered' }, 400);
            }
          }

          const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
          const user: User = {
            id: `user-${Date.now()}`,
            username,
            email,
            password,
            createdAt: new Date().toISOString(),
            avatar: colors[Math.floor(Math.random() * colors.length)]
          };

          apiStore.users.set(user.id, user);

          const token = `token-${user.id}-${Date.now()}`;
          apiStore.sessions.set(token, user.id);

          return jsonResponse({
            user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar },
            token
          }, 201);
        } catch {
          return jsonResponse({ error: 'Invalid request' }, 400);
        }
      }
    },

    "/api/auth/login": {
      async POST(req) {
        try {
          const body = await req.json();
          const { username, password } = body;

          for (const user of apiStore.users.values()) {
            if (user.username.toLowerCase() === username.toLowerCase() && user.password === password) {
              const token = `token-${user.id}-${Date.now()}`;
              apiStore.sessions.set(token, user.id);

              return jsonResponse({
                user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar },
                token
              });
            }
          }

          return jsonResponse({ error: 'Invalid username or password' }, 401);
        } catch {
          return jsonResponse({ error: 'Invalid request' }, 400);
        }
      }
    },

    "/api/auth/logout": {
      async POST(req) {
        const authHeader = req.headers.get('Authorization');
        if (authHeader?.startsWith('Bearer ')) {
          apiStore.sessions.delete(authHeader.slice(7));
        }
        return jsonResponse({ success: true });
      }
    },

    "/api/auth/me": {
      async GET(req) {
        const user = getUserFromAuth(req);
        if (!user) {
          return jsonResponse({ error: 'Unauthorized' }, 401);
        }
        return jsonResponse({
          user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar }
        });
      }
    },

    // Posts endpoints
    "/api/posts": {
      async GET() {
        const posts = Array.from(apiStore.posts.values())
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return jsonResponse({ posts });
      },
      async POST(req) {
        const user = getUserFromAuth(req);
        if (!user) {
          return jsonResponse({ error: 'Unauthorized' }, 401);
        }

        try {
          const body = await req.json();
          const { title, content } = body;

          if (!title || title.length < 5) {
            return jsonResponse({ error: 'Title must be at least 5 characters' }, 400);
          }
          if (!content || content.length < 10) {
            return jsonResponse({ error: 'Content must be at least 10 characters' }, 400);
          }

          const post: Post = {
            id: `post-${Date.now()}`,
            title,
            content,
            authorId: user.id,
            createdAt: new Date().toISOString(),
            upvotes: 0,
            downvotes: 0
          };

          apiStore.posts.set(post.id, post);

          return jsonResponse({ post }, 201);
        } catch {
          return jsonResponse({ error: 'Invalid request' }, 400);
        }
      }
    },

    "/api/posts/:id": {
      async GET(req) {
        const post = apiStore.posts.get(req.params.id);
        if (!post) {
          return jsonResponse({ error: 'Post not found' }, 404);
        }
        return jsonResponse({ post });
      },
      async DELETE(req) {
        const user = getUserFromAuth(req);
        if (!user) {
          return jsonResponse({ error: 'Unauthorized' }, 401);
        }

        const post = apiStore.posts.get(req.params.id);
        if (!post) {
          return jsonResponse({ error: 'Post not found' }, 404);
        }
        if (post.authorId !== user.id) {
          return jsonResponse({ error: 'Forbidden' }, 403);
        }

        // Delete associated comments
        for (const [commentId, comment] of apiStore.comments) {
          if (comment.postId === req.params.id) {
            apiStore.comments.delete(commentId);
          }
        }

        apiStore.posts.delete(req.params.id);
        return jsonResponse({ success: true });
      }
    },

    "/api/posts/:id/vote": {
      async POST(req) {
        const user = getUserFromAuth(req);
        if (!user) {
          return jsonResponse({ error: 'Unauthorized' }, 401);
        }

        const post = apiStore.posts.get(req.params.id);
        if (!post) {
          return jsonResponse({ error: 'Post not found' }, 404);
        }

        try {
          const body = await req.json();
          const { voteType } = body;

          if (voteType === 'up') {
            post.upvotes++;
          } else if (voteType === 'down') {
            post.downvotes++;
          }

          return jsonResponse({ post });
        } catch {
          return jsonResponse({ error: 'Invalid request' }, 400);
        }
      }
    },

    "/api/posts/:id/comments": {
      async GET(req) {
        const comments = Array.from(apiStore.comments.values())
          .filter(c => c.postId === req.params.id)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return jsonResponse({ comments });
      },
      async POST(req) {
        const user = getUserFromAuth(req);
        if (!user) {
          return jsonResponse({ error: 'Unauthorized' }, 401);
        }

        const post = apiStore.posts.get(req.params.id);
        if (!post) {
          return jsonResponse({ error: 'Post not found' }, 404);
        }

        try {
          const body = await req.json();
          const { content, parentId } = body;

          if (!content || content.length < 2) {
            return jsonResponse({ error: 'Comment must be at least 2 characters' }, 400);
          }

          const comment: Comment = {
            id: `comment-${Date.now()}`,
            content,
            authorId: user.id,
            postId: req.params.id,
            parentId: parentId || null,
            createdAt: new Date().toISOString(),
            upvotes: 0,
            downvotes: 0
          };

          apiStore.comments.set(comment.id, comment);

          return jsonResponse({ comment }, 201);
        } catch {
          return jsonResponse({ error: 'Invalid request' }, 400);
        }
      }
    },

    // Comments endpoints
    "/api/comments/:id": {
      async DELETE(req) {
        const user = getUserFromAuth(req);
        if (!user) {
          return jsonResponse({ error: 'Unauthorized' }, 401);
        }

        const comment = apiStore.comments.get(req.params.id);
        if (!comment) {
          return jsonResponse({ error: 'Comment not found' }, 404);
        }
        if (comment.authorId !== user.id) {
          return jsonResponse({ error: 'Forbidden' }, 403);
        }

        apiStore.comments.delete(req.params.id);
        return jsonResponse({ success: true });
      }
    },

    "/api/comments/:id/vote": {
      async POST(req) {
        const user = getUserFromAuth(req);
        if (!user) {
          return jsonResponse({ error: 'Unauthorized' }, 401);
        }

        const comment = apiStore.comments.get(req.params.id);
        if (!comment) {
          return jsonResponse({ error: 'Comment not found' }, 404);
        }

        try {
          const body = await req.json();
          const { voteType } = body;

          if (voteType === 'up') {
            comment.upvotes++;
          } else if (voteType === 'down') {
            comment.downvotes++;
          }

          return jsonResponse({ comment });
        } catch {
          return jsonResponse({ error: 'Invalid request' }, 400);
        }
      }
    },

    // Users endpoints
    "/api/users/:id": {
      async GET(req) {
        const user = apiStore.users.get(req.params.id);
        if (!user) {
          return jsonResponse({ error: 'User not found' }, 404);
        }
        return jsonResponse({
          user: { id: user.id, username: user.username, avatar: user.avatar, createdAt: user.createdAt }
        });
      }
    },

    "/api/users/:id/posts": {
      async GET(req) {
        const posts = Array.from(apiStore.posts.values())
          .filter(p => p.authorId === req.params.id)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return jsonResponse({ posts });
      }
    },

    // Health check
    "/api/health": {
      GET() {
        return jsonResponse({ 
          status: 'ok', 
          timestamp: new Date().toISOString(),
          userCount: apiStore.users.size,
          postCount: apiStore.posts.size,
          commentCount: apiStore.comments.size
        });
      }
    },

    // Reset endpoint for testing
    "/api/reset": {
      POST() {
        apiStore.users.clear();
        apiStore.posts.clear();
        apiStore.comments.clear();
        apiStore.sessions.clear();
        initializeStore();
        return jsonResponse({ success: true, message: 'Store reset to initial state' });
      }
    }
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🔥 MockReddit server running at ${server.url}`);
