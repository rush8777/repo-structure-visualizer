import { FileQuestion, Sparkles, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface EmptyStateProps {
  isLoading: boolean;
}

export const EmptyState = ({ isLoading }: EmptyStateProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-foreground mb-1">Analyzing repository…</p>
          <p className="text-sm text-muted-foreground">Extracting logic flow from your codebase</p>
        </div>
        
        {/* Skeleton nodes preview */}
        <div className="flex gap-4 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-20 w-48 rounded-xl" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
        <FileQuestion className="w-10 h-10 text-muted-foreground" />
      </div>
      <div className="text-center max-w-md">
        <p className="text-lg font-medium text-foreground mb-2">
          Ask a question to generate a logic flow
        </p>
        <p className="text-sm text-muted-foreground">
          Enter a feature or concept in the search bar above (e.g., "authentication flow", 
          "payment processing", "user registration") to visualize how it works in your repository.
        </p>
      </div>
      
      {/* Example prompts */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {[
          'Authentication flow',
          'API request handling',
          'State management',
          'Database queries',
        ].map((example) => (
          <button
            key={example}
            className="px-3 py-1.5 rounded-full text-xs bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3" />
            {example}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
