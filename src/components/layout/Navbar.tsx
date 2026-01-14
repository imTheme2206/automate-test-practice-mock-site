import { Button } from '@/components/ui/button';
import { store, type User } from '@/store';
import { LogOut, Plus, Flame, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onCreatePostClick: () => void;
  onLogoClick: () => void;
  onProfileClick?: () => void;
}

export function Navbar({ 
  currentUser, 
  onLoginClick, 
  onRegisterClick, 
  onCreatePostClick, 
  onLogoClick,
  onProfileClick 
}: NavbarProps) {
  const handleLogout = () => {
    store.logout();
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/50 bg-card/80 backdrop-blur-lg" data-testid="navbar">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-orange-500 transition-colors"
          data-testid="navbar-logo"
        >
          <Flame className="h-7 w-7 text-orange-500" />
          <span className="hidden sm:inline">MockReddit</span>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <Button
                variant="default"
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={onCreatePostClick}
                data-testid="create-post-btn"
              >
                <Plus className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Create Post</span>
                <span className="sm:hidden">Post</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onProfileClick}
                className="flex items-center gap-2"
                data-testid="user-profile-btn"
              >
                <div 
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: currentUser.avatar }}
                >
                  {currentUser.username[0].toUpperCase()}
                </div>
                <span className="hidden md:inline text-sm font-medium" data-testid="current-username">
                  {currentUser.username}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                data-testid="logout-btn"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLoginClick}
                data-testid="login-btn"
              >
                Log In
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={onRegisterClick}
                data-testid="register-btn"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

