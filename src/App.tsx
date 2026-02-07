import { AuthModal } from "@/components/auth/AuthModal";
import { Navbar } from "@/components/layout/Navbar";
import { HomePage } from "@/pages/HomePage";
import { PostPage } from "@/pages/PostPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { store, type User } from "@/store";
import { useEffect, useState } from "react";
import "./index.css";

type Page =
  | { type: "home" }
  | { type: "post"; postId: string }
  | { type: "profile"; userId: string };

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(
    store.auth.currentUser,
  );
  const [page, setPage] = useState<Page>({ type: "home" });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">(
    "login",
  );
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCurrentUser(store.auth.currentUser);
    });
    return unsubscribe;
  }, []);

  const handleLoginClick = () => {
    setAuthModalMode("login");
    setShowAuthModal(true);
  };

  const handleRegisterClick = () => {
    setAuthModalMode("register");
    setShowAuthModal(true);
  };

  const handleCreatePostClick = () => {
    if (!currentUser) {
      handleLoginClick();
      return;
    }
    setShowCreatePost(true);
  };

  const handlePostClick = (postId: string) => {
    setPage({ type: "post", postId });
  };

  const handleProfileClick = () => {
    if (currentUser) {
      setPage({ type: "profile", userId: currentUser.id });
    }
  };

  const handleGoHome = () => {
    setPage({ type: "home" });
    setShowCreatePost(false);
  };

  const handleCreatePostSuccess = (postId: string) => {
    setShowCreatePost(false);
    setPage({ type: "post", postId });
  };

  return (
    <div className="min-h-screen bg-background" data-testid="app">
      <Navbar
        currentUser={currentUser}
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
        onCreatePostClick={handleCreatePostClick}
        onLogoClick={handleGoHome}
        onProfileClick={handleProfileClick}
      />

      <main>
        {page.type === "home" && (
          <HomePage
            currentUser={currentUser}
            onPostClick={handlePostClick}
            showCreatePost={showCreatePost}
            onCreatePostSuccess={handleCreatePostSuccess}
            onCreatePostCancel={() => setShowCreatePost(false)}
          />
        )}

        {page.type === "post" && (
          <PostPage
            postId={page.postId}
            currentUser={currentUser}
            onBack={handleGoHome}
            onLoginRequired={handleLoginClick}
          />
        )}

        {page.type === "profile" && (
          <ProfilePage
            userId={page.userId}
            currentUser={currentUser}
            onBack={handleGoHome}
            onPostClick={handlePostClick}
          />
        )}
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authModalMode}
      />

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12 py-6 text-center text-sm text-muted-foreground">
        <p>LoveNamphetZa - A testing practice site</p>
        <p className="text-xs mt-1">
          All data resets on page reload • Built for automation testing practice
        </p>
      </footer>
    </div>
  );
}

export default App;
