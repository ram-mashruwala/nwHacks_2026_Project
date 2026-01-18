import {loginWithGoogle} from '@/lib/auth'
import { Button } from '@/components/ui/button';
import { LogIn, TrendingUp } from 'lucide-react';
const Index = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="glass-card p-8 md:p-12 max-w-md w-full space-y-8 text-center">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-4 rounded-xl bg-primary/10 mb-2">
            <TrendingUp className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Options Lab</h1>
          <p className="text-muted-foreground">
            Build, visualize, and analyze options strategies
          </p>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Sign in to continue</span>
          </div>
        </div>

        {/* Google Login Button */}
        <Button
          variant="outline"
          size="lg"
          onClick={loginWithGoogle}
          className="w-full bg-background/50 border-border/50 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
        >
          <LogIn className="h-5 w-5 mr-3" />
          <span className="font-medium text-foreground">Sign in with Google</span>
        </Button>

        {/* Footer text */}
        <p className="text-xs text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};
export default Index