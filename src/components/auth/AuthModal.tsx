import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  if (!isOpen) return null;

  const handleSuccess = () => {
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      data-testid="auth-modal"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        data-testid="auth-modal-backdrop"
      />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-20 p-2 bg-card rounded-full border border-border hover:bg-accent transition-colors"
          data-testid="auth-modal-close"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>
        
        {mode === 'login' ? (
          <LoginForm 
            onSuccess={handleSuccess}
            onSwitchToRegister={() => setMode('register')}
          />
        ) : (
          <RegisterForm 
            onSuccess={handleSuccess}
            onSwitchToLogin={() => setMode('login')}
          />
        )}
      </div>
    </div>
  );
}


