import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Info, Code, TestTube2, Github } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="space-y-4">
      {/* About */}
      <Card className="bg-card/80 backdrop-blur border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Info className="h-4 w-4 text-orange-500" />
            About MockReddit
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="mb-2">
            A mock Reddit-style application designed for practicing automated testing.
          </p>
          <p className="text-xs">
            All data is stored in memory and resets on page reload.
          </p>
        </CardContent>
      </Card>

      {/* Testing Tips */}
      <Card className="bg-card/80 backdrop-blur border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <TestTube2 className="h-4 w-4 text-orange-500" />
            Testing Tips
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">1.</span>
            <p>Use <code className="text-xs bg-muted px-1 rounded">data-testid</code> attributes for reliable element selection</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">2.</span>
            <p>Test form validations with edge cases</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">3.</span>
            <p>Verify state changes after user interactions</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">4.</span>
            <p>Check error handling and feedback messages</p>
          </div>
        </CardContent>
      </Card>

      {/* Testable Features */}
      <Card className="bg-card/80 backdrop-blur border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Code className="h-4 w-4 text-orange-500" />
            Testable Features
          </div>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          <ul className="space-y-1.5">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              User registration & login
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Form validation errors
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Create, view, delete posts
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Create, view, delete comments
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Nested comment replies
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Upvote/downvote system
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              User session management
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Dynamic content updates
            </li>
          </ul>
        </CardContent>
      </Card>
    </aside>
  );
}


