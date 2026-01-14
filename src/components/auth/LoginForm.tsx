import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { store } from '@/store';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for realistic testing
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = store.login(username, password);
    
    setIsLoading(false);
    
    if (result.success) {
      onSuccess?.();
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <Card className="w-full max-w-md bg-card/95 backdrop-blur border-orange-500/20">
      <CardHeader className="space-y-1 pb-4">
        <h2 className="text-2xl font-bold text-center" data-testid="login-title">
          Welcome Back
        </h2>
        <p className="text-sm text-muted-foreground text-center">
          Enter your credentials to access your account
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" data-testid="login-form">
          <div className="space-y-2">
            <Label htmlFor="login-username">Username</Label>
            <Input
              id="login-username"
              data-testid="login-username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              autoComplete="username"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              data-testid="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div 
              className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md"
              data-testid="login-error"
              role="alert"
            >
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isLoading}
            data-testid="login-submit"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-orange-500 hover:underline font-medium"
              data-testid="switch-to-register"
            >
              Sign up
            </button>
          </div>

          <div className="mt-4 p-3 bg-muted/50 rounded-md text-xs text-muted-foreground">
            <p className="font-medium mb-1">Demo Credentials:</p>
            <p>Username: <code className="text-orange-500">demo_user</code></p>
            <p>Password: <code className="text-orange-500">password123</code></p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

