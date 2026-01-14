# MockReddit

A 100% vibe-coded project for my girlfriend to practice her automate test lesson.

## Prompt

```
I want you to create a mock website for practicing automate test.

This site will consist of several common feature that should be tested during the automate test process.

I was thinking of a reddit-like site that user can register / login / create posts, comment posts.

as for backend connection, no real database needed. right now save it as a global state that will be reset everytime a page gets full reload, will suffice.
```

A Reddit-like mock website designed for practicing automated testing. All data is stored in memory and resets on page reload, making it perfect for isolated test runs.

## Features

### User Authentication

- **Registration** with validation (username min 3 chars, valid email, password min 6 chars)
- **Login/Logout** with error handling and feedback
- **Session management** (persists until page reload)

### Posts

- View all posts sorted by newest first
- Create new posts (title min 5 chars, content min 10 chars)
- Upvote/downvote posts
- Delete your own posts
- View post details with comments

### Comments

- Add comments to posts
- Reply to comments (nested up to 4 levels deep)
- Upvote/downvote comments
- Delete your own comments

### User Profiles

- View user profile with posts and comments tabs
- See join date and activity stats

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0 or later)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd automate-test-practice-mock-site

# Install dependencies
bun install
```

### Running the Development Server

```bash
bun run dev
```

The server will start at **http://localhost:3000**

### Building for Production

```bash
bun run build
```

This outputs static files to the `dist` directory.

## Deployment

### GitHub Pages

This project is configured to auto-deploy to GitHub Pages on push to `main` branch.

1. Go to your repository **Settings** → **Pages**
2. Under **Build and deployment**, select **GitHub Actions** as the source
3. Push to `main` branch - the workflow will build and deploy automatically

> **Note**: On GitHub Pages, only the frontend is available (all state is client-side). The API endpoints require running the dev server locally.

### Demo Credentials

```
Username: demo_user
Password: password123
```

or

```
Username: test_automation
Password: test123
```

## Testing Guide

### Data-TestId Attributes

All interactive elements have `data-testid` attributes for reliable element selection in tests:

#### Authentication

| Element                   | data-testid                 |
| ------------------------- | --------------------------- |
| Login form                | `login-form`                |
| Login username input      | `login-username`            |
| Login password input      | `login-password`            |
| Login submit button       | `login-submit`              |
| Login error message       | `login-error`               |
| Register form             | `register-form`             |
| Register username input   | `register-username`         |
| Register email input      | `register-email`            |
| Register password input   | `register-password`         |
| Register confirm password | `register-confirm-password` |
| Register submit button    | `register-submit`           |
| Register error message    | `register-error`            |
| Switch to register link   | `switch-to-register`        |
| Switch to login link      | `switch-to-login`           |
| Auth modal                | `auth-modal`                |
| Auth modal close button   | `auth-modal-close`          |

#### Navigation

| Element                  | data-testid        |
| ------------------------ | ------------------ |
| Navbar                   | `navbar`           |
| Logo/home link           | `navbar-logo`      |
| Login button             | `login-btn`        |
| Register button          | `register-btn`     |
| Create post button       | `create-post-btn`  |
| User profile button      | `user-profile-btn` |
| Current username display | `current-username` |
| Logout button            | `logout-btn`       |

#### Posts

| Element                 | data-testid                  |
| ----------------------- | ---------------------------- |
| Post list container     | `post-list`                  |
| Empty post list message | `empty-post-list`            |
| Individual post card    | `post-card-{postId}`         |
| Post title              | `post-title-{postId}`        |
| Post content            | `post-content-{postId}`      |
| Post author             | `post-author-{postId}`       |
| Post timestamp          | `post-time-{postId}`         |
| Post score              | `post-score-{postId}`        |
| Post upvote button      | `post-upvote-{postId}`       |
| Post downvote button    | `post-downvote-{postId}`     |
| Post comments button    | `post-comments-btn-{postId}` |
| Post delete button      | `post-delete-{postId}`       |

#### Create Post

| Element            | data-testid          |
| ------------------ | -------------------- |
| Create post form   | `create-post-form`   |
| Post title input   | `post-title-input`   |
| Post content input | `post-content-input` |
| Create post submit | `create-post-submit` |
| Create post error  | `create-post-error`  |
| Create post cancel | `create-post-cancel` |

#### Comments

| Element                    | data-testid                       |
| -------------------------- | --------------------------------- |
| Comment list container     | `comment-list`                    |
| Empty comment list message | `empty-comment-list`              |
| Individual comment         | `comment-{commentId}`             |
| Comment content            | `comment-content-{commentId}`     |
| Comment author             | `comment-author-{commentId}`      |
| Comment timestamp          | `comment-time-{commentId}`        |
| Comment score              | `comment-score-{commentId}`       |
| Comment upvote             | `comment-upvote-{commentId}`      |
| Comment downvote           | `comment-downvote-{commentId}`    |
| Comment reply button       | `comment-reply-btn-{commentId}`   |
| Comment delete button      | `comment-delete-{commentId}`      |
| Comment form               | `comment-form`                    |
| Comment input              | `comment-input`                   |
| Comment submit             | `comment-submit`                  |
| Reply form                 | `comment-form-reply-{parentId}`   |
| Reply input                | `comment-input-reply-{parentId}`  |
| Reply submit               | `comment-submit-reply-{parentId}` |

#### Pages

| Element                 | data-testid             |
| ----------------------- | ----------------------- |
| App container           | `app`                   |
| Home page title         | `home-title`            |
| Post count              | `post-count`            |
| Post page container     | `post-page`             |
| Comments section title  | `comments-title`        |
| Back to home button     | `back-to-home`          |
| Login to comment prompt | `login-to-comment`      |
| Login to comment button | `login-to-comment-btn`  |
| Profile page container  | `profile-page`          |
| Profile avatar          | `profile-avatar`        |
| Profile username        | `profile-username`      |
| Profile joined date     | `profile-joined`        |
| Profile post count      | `profile-post-count`    |
| Profile comment count   | `profile-comment-count` |
| Posts tab               | `tab-posts`             |
| Comments tab            | `tab-comments`          |
| Profile posts list      | `profile-posts`         |
| Profile comments list   | `profile-comments`      |

## API Endpoints

The backend provides RESTful API endpoints for API testing practice:

### Authentication

| Method | Endpoint             | Description           | Auth Required |
| ------ | -------------------- | --------------------- | ------------- |
| POST   | `/api/auth/register` | Register a new user   | No            |
| POST   | `/api/auth/login`    | Login and get token   | No            |
| POST   | `/api/auth/logout`   | Invalidate token      | Yes           |
| GET    | `/api/auth/me`       | Get current user info | Yes           |

### Posts

| Method | Endpoint                  | Description         | Auth Required |
| ------ | ------------------------- | ------------------- | ------------- |
| GET    | `/api/posts`              | List all posts      | No            |
| POST   | `/api/posts`              | Create a new post   | Yes           |
| GET    | `/api/posts/:id`          | Get a specific post | No            |
| DELETE | `/api/posts/:id`          | Delete a post       | Yes (owner)   |
| POST   | `/api/posts/:id/vote`     | Vote on a post      | Yes           |
| GET    | `/api/posts/:id/comments` | Get post comments   | No            |
| POST   | `/api/posts/:id/comments` | Add a comment       | Yes           |

### Comments

| Method | Endpoint                 | Description       | Auth Required |
| ------ | ------------------------ | ----------------- | ------------- |
| DELETE | `/api/comments/:id`      | Delete a comment  | Yes (owner)   |
| POST   | `/api/comments/:id/vote` | Vote on a comment | Yes           |

### Users

| Method | Endpoint               | Description      | Auth Required |
| ------ | ---------------------- | ---------------- | ------------- |
| GET    | `/api/users/:id`       | Get user profile | No            |
| GET    | `/api/users/:id/posts` | Get user's posts | No            |

### Utility

| Method | Endpoint      | Description                  | Auth Required |
| ------ | ------------- | ---------------------------- | ------------- |
| GET    | `/api/health` | Health check with stats      | No            |
| POST   | `/api/reset`  | Reset store to initial state | No            |

### Authentication Header

For authenticated endpoints, include the token in the Authorization header:

```
Authorization: Bearer <token>
```

### Example API Requests

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "newuser", "email": "new@example.com", "password": "password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "demo_user", "password": "password123"}'

# Create Post (with token)
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title": "My Test Post", "content": "This is test content for automation."}'

# Reset store (useful between tests)
curl -X POST http://localhost:3000/api/reset
```

## Test Scenarios

Here are some suggested test scenarios to practice:

### Authentication Tests

- [ ] Register with valid credentials
- [ ] Register with existing username (should fail)
- [ ] Register with invalid email (should fail)
- [ ] Register with short password (should fail)
- [ ] Login with valid credentials
- [ ] Login with wrong password (should fail)
- [ ] Logout and verify session cleared

### Post Tests

- [ ] Create a post while logged in
- [ ] Try to create post while logged out (should prompt login)
- [ ] Upvote a post
- [ ] Downvote a post
- [ ] Remove vote by clicking same button again
- [ ] Delete own post
- [ ] Verify cannot delete others' posts

### Comment Tests

- [ ] Add a comment to a post
- [ ] Reply to a comment
- [ ] Nested reply (up to 4 levels)
- [ ] Upvote/downvote comments
- [ ] Delete own comment

### Navigation Tests

- [ ] Navigate from home to post detail
- [ ] Navigate back to home
- [ ] View user profile
- [ ] Switch between posts and comments tabs

### Form Validation Tests

- [ ] Submit empty forms
- [ ] Submit with minimum character counts
- [ ] Submit with maximum character counts
- [ ] Verify error messages display correctly

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Frontend**: React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## Notes

- All data is stored in memory and **resets on page reload**
- There are simulated network delays (300-500ms) for realistic async testing
- The frontend and backend share the same port (3000) when running locally
- On GitHub Pages, only the frontend works (API endpoints require local server)
- Perfect for Selenium, Playwright, Cypress, or any other testing framework
