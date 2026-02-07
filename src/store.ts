// Global state store - resets on page reload (no persistence)
// This is intentional for automation testing practice

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // In real app, never store plain passwords!
  createdAt: Date;
  avatar: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  votedBy: Record<string, "up" | "down">; // userId -> vote type
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  parentId: string | null; // for nested comments
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  votedBy: Record<string, "up" | "down">;
}

export interface AuthState {
  currentUser: User | null;
  token: string | null;
}

// Generate random avatar color
function generateAvatarColor(): string {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Global store
class Store {
  users: Map<string, User> = new Map();
  posts: Map<string, Post> = new Map();
  comments: Map<string, Comment> = new Map();
  auth: AuthState = { currentUser: null, token: null };

  private listeners: Set<() => void> = new Set();

  constructor() {
    // Seed with some initial data for testing
    this.seedData();
  }

  private seedData() {
    // Create demo users
    const demoUser1: User = {
      id: "user-1",
      username: "demo_user",
      email: "demo@example.com",
      password: "password123",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      avatar: "#4ECDC4",
    };

    const demoUser2: User = {
      id: "user-2",
      username: "test_automation",
      email: "test@example.com",
      password: "test123",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      avatar: "#FF6B6B",
    };

    this.users.set(demoUser1.id, demoUser1);
    this.users.set(demoUser2.id, demoUser2);

    // Create demo posts
    const demoPost1: Post = {
      id: "post-1",
      title: "Welcome to LoveNamphetZa - A Testing Practice Site",
      content:
        "This is a mock Reddit clone designed for practicing automated testing. Feel free to create accounts, posts, and comments. All data resets on page reload!",
      authorId: "user-1",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      upvotes: 42,
      downvotes: 3,
      votedBy: {},
    };

    const demoPost2: Post = {
      id: "post-2",
      title: "Best practices for Selenium testing",
      content:
        "When writing Selenium tests, always use explicit waits instead of implicit waits. Use data-testid attributes for reliable element selection. Keep your tests independent and isolated.",
      authorId: "user-2",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      upvotes: 28,
      downvotes: 1,
      votedBy: {},
    };

    const demoPost3: Post = {
      id: "post-3",
      title: "How do you handle dynamic content in your tests?",
      content:
        "I'm struggling with testing pages that have dynamic content loaded via AJAX. What strategies do you use? Polling? WebSocket monitoring? Would love to hear your approaches.",
      authorId: "user-1",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      upvotes: 15,
      downvotes: 0,
      votedBy: {},
    };

    this.posts.set(demoPost1.id, demoPost1);
    this.posts.set(demoPost2.id, demoPost2);
    this.posts.set(demoPost3.id, demoPost3);

    // Create demo comments
    const demoComment1: Comment = {
      id: "comment-1",
      content:
        "Great resource for learning automation testing! Thanks for setting this up.",
      authorId: "user-2",
      postId: "post-1",
      parentId: null,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      upvotes: 5,
      downvotes: 0,
      votedBy: {},
    };

    const demoComment2: Comment = {
      id: "comment-2",
      content:
        "I always use data-testid, it makes selectors so much more reliable.",
      authorId: "user-1",
      postId: "post-2",
      parentId: null,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      upvotes: 8,
      downvotes: 0,
      votedBy: {},
    };

    this.comments.set(demoComment1.id, demoComment1);
    this.comments.set(demoComment2.id, demoComment2);
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // Auth methods
  register(
    username: string,
    email: string,
    password: string,
  ): { success: boolean; error?: string; user?: User } {
    // Validate
    if (!username || username.length < 3) {
      return {
        success: false,
        error: "Username must be at least 3 characters",
      };
    }
    if (!email || !email.includes("@")) {
      return { success: false, error: "Please enter a valid email address" };
    }
    if (!password || password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters",
      };
    }

    // Check if username exists
    for (const user of this.users.values()) {
      if (user.username.toLowerCase() === username.toLowerCase()) {
        return { success: false, error: "Username already taken" };
      }
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return { success: false, error: "Email already registered" };
      }
    }

    const user: User = {
      id: `user-${Date.now()}`,
      username,
      email,
      password,
      createdAt: new Date(),
      avatar: generateAvatarColor(),
    };

    this.users.set(user.id, user);
    this.auth = { currentUser: user, token: `token-${user.id}-${Date.now()}` };
    this.notify();

    return { success: true, user };
  }

  login(
    username: string,
    password: string,
  ): { success: boolean; error?: string; user?: User } {
    if (!username || !password) {
      return { success: false, error: "Please enter username and password" };
    }

    for (const user of this.users.values()) {
      if (
        user.username.toLowerCase() === username.toLowerCase() &&
        user.password === password
      ) {
        this.auth = {
          currentUser: user,
          token: `token-${user.id}-${Date.now()}`,
        };
        this.notify();
        return { success: true, user };
      }
    }

    return { success: false, error: "Invalid username or password" };
  }

  logout() {
    this.auth = { currentUser: null, token: null };
    this.notify();
  }

  // Post methods
  createPost(
    title: string,
    content: string,
  ): { success: boolean; error?: string; post?: Post } {
    if (!this.auth.currentUser) {
      return {
        success: false,
        error: "You must be logged in to create a post",
      };
    }
    if (!title || title.length < 5) {
      return { success: false, error: "Title must be at least 5 characters" };
    }
    if (!content || content.length < 10) {
      return {
        success: false,
        error: "Content must be at least 10 characters",
      };
    }

    const post: Post = {
      id: `post-${Date.now()}`,
      title,
      content,
      authorId: this.auth.currentUser.id,
      createdAt: new Date(),
      upvotes: 0,
      downvotes: 0,
      votedBy: {},
    };

    this.posts.set(post.id, post);
    this.notify();

    return { success: true, post };
  }

  deletePost(postId: string): { success: boolean; error?: string } {
    if (!this.auth.currentUser) {
      return { success: false, error: "You must be logged in" };
    }

    const post = this.posts.get(postId);
    if (!post) {
      return { success: false, error: "Post not found" };
    }

    if (post.authorId !== this.auth.currentUser.id) {
      return { success: false, error: "You can only delete your own posts" };
    }

    // Delete associated comments
    for (const [commentId, comment] of this.comments) {
      if (comment.postId === postId) {
        this.comments.delete(commentId);
      }
    }

    this.posts.delete(postId);
    this.notify();

    return { success: true };
  }

  votePost(
    postId: string,
    voteType: "up" | "down",
  ): { success: boolean; error?: string } {
    if (!this.auth.currentUser) {
      return { success: false, error: "You must be logged in to vote" };
    }

    const post = this.posts.get(postId);
    if (!post) {
      return { success: false, error: "Post not found" };
    }

    const userId = this.auth.currentUser.id;
    const currentVote = post.votedBy[userId];

    if (currentVote === voteType) {
      // Remove vote
      if (voteType === "up") post.upvotes--;
      else post.downvotes--;
      delete post.votedBy[userId];
    } else {
      // Change or add vote
      if (currentVote) {
        if (currentVote === "up") post.upvotes--;
        else post.downvotes--;
      }
      if (voteType === "up") post.upvotes++;
      else post.downvotes++;
      post.votedBy[userId] = voteType;
    }

    this.notify();
    return { success: true };
  }

  // Comment methods
  createComment(
    postId: string,
    content: string,
    parentId: string | null = null,
  ): { success: boolean; error?: string; comment?: Comment } {
    if (!this.auth.currentUser) {
      return { success: false, error: "You must be logged in to comment" };
    }
    if (!content || content.length < 2) {
      return { success: false, error: "Comment must be at least 2 characters" };
    }

    const post = this.posts.get(postId);
    if (!post) {
      return { success: false, error: "Post not found" };
    }

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      content,
      authorId: this.auth.currentUser.id,
      postId,
      parentId,
      createdAt: new Date(),
      upvotes: 0,
      downvotes: 0,
      votedBy: {},
    };

    this.comments.set(comment.id, comment);
    this.notify();

    return { success: true, comment };
  }

  deleteComment(commentId: string): { success: boolean; error?: string } {
    if (!this.auth.currentUser) {
      return { success: false, error: "You must be logged in" };
    }

    const comment = this.comments.get(commentId);
    if (!comment) {
      return { success: false, error: "Comment not found" };
    }

    if (comment.authorId !== this.auth.currentUser.id) {
      return { success: false, error: "You can only delete your own comments" };
    }

    this.comments.delete(commentId);
    this.notify();

    return { success: true };
  }

  voteComment(
    commentId: string,
    voteType: "up" | "down",
  ): { success: boolean; error?: string } {
    if (!this.auth.currentUser) {
      return { success: false, error: "You must be logged in to vote" };
    }

    const comment = this.comments.get(commentId);
    if (!comment) {
      return { success: false, error: "Comment not found" };
    }

    const userId = this.auth.currentUser.id;
    const currentVote = comment.votedBy[userId];

    if (currentVote === voteType) {
      if (voteType === "up") comment.upvotes--;
      else comment.downvotes--;
      delete comment.votedBy[userId];
    } else {
      if (currentVote) {
        if (currentVote === "up") comment.upvotes--;
        else comment.downvotes--;
      }
      if (voteType === "up") comment.upvotes++;
      else comment.downvotes++;
      comment.votedBy[userId] = voteType;
    }

    this.notify();
    return { success: true };
  }

  // Getters
  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  getPost(postId: string): Post | undefined {
    return this.posts.get(postId);
  }

  getAllPosts(): Post[] {
    return Array.from(this.posts.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  getPostComments(postId: string): Comment[] {
    return Array.from(this.comments.values())
      .filter((c) => c.postId === postId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getUserPosts(userId: string): Post[] {
    return Array.from(this.posts.values())
      .filter((p) => p.authorId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getUserComments(userId: string): Comment[] {
    return Array.from(this.comments.values())
      .filter((c) => c.authorId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

// Singleton instance
export const store = new Store();
