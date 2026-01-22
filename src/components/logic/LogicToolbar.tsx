import { useState, useCallback, useEffect, useRef } from 'react';
import { Search, Sparkles, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LogicViewMode } from '@/hooks/useLogicGraphState';

interface LogicToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  viewMode: LogicViewMode;
  onViewModeChange: (mode: LogicViewMode) => void;
  onClear: () => void;
  hasData: boolean;
}

export const LogicToolbar = ({
  query,
  onQueryChange,
  onGenerate,
  isLoading,
  viewMode,
  onViewModeChange,
  onClear,
  hasData,
}: LogicToolbarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localQuery, setLocalQuery] = useState(query);
  
  useEffect(() => {
    setLocalQuery(query);
  }, [query]);
  
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onQueryChange(localQuery);
    onGenerate();
  }, [localQuery, onQueryChange, onGenerate]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);
  
  return (
    <div className="flex items-center gap-4 p-4 bg-card/80 backdrop-blur-sm border-b border-border">
      {/* Search / Prompt Input */}
      <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about a feature (e.g., authentication flow, payment logic…)"
            className="pl-10 pr-10 h-10 bg-background/50 border-border focus:border-primary"
          />
          {localQuery && (
            <button
              type="button"
              onClick={() => {
                setLocalQuery('');
                onQueryChange('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <Button
          type="submit"
          disabled={!localQuery.trim() || isLoading}
          className="h-10 px-4 gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Flow
            </>
          )}
        </Button>
      </form>
      
      {/* View Mode Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">View:</span>
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(v) => v && onViewModeChange(v as LogicViewMode)}
          className="bg-muted/50 rounded-lg p-1"
        >
          <ToggleGroupItem value="files" className="text-xs h-7 px-3 data-[state=on]:bg-background">
            Files only
          </ToggleGroupItem>
          <ToggleGroupItem value="flow" className="text-xs h-7 px-3 data-[state=on]:bg-background">
            Logic flow
          </ToggleGroupItem>
          <ToggleGroupItem value="both" className="text-xs h-7 px-3 data-[state=on]:bg-background">
            Both
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      {/* Clear Button */}
      {hasData && (
        <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
};

export default LogicToolbar;
