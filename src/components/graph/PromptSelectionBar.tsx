import { CheckSquare, X, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PromptSelectionBarProps {
  selectedCount: number;
  selectedItems: string[];
  onClearSelection: () => void;
  onCopySelection?: () => void;
}

export const PromptSelectionBar = ({ 
  selectedCount, 
  selectedItems,
  onClearSelection,
  onCopySelection,
}: PromptSelectionBarProps) => {
  if (selectedCount === 0) return null;
  
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 animate-fade-in">
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-node-repository" />
          <span className="text-sm font-medium text-foreground">
            {selectedCount} selected
          </span>
        </div>
        
        <div className="w-px h-5 bg-border" />
        
        <div className="flex items-center gap-1 max-w-[300px] overflow-hidden">
          {selectedItems.slice(0, 3).map((item) => (
            <Badge 
              key={item} 
              variant="secondary" 
              className="text-[10px] px-1.5 py-0 h-5 truncate max-w-[80px]"
            >
              {item}
            </Badge>
          ))}
          {selectedItems.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{selectedItems.length - 3} more
            </span>
          )}
        </div>
        
        <div className="w-px h-5 bg-border" />
        
        <div className="flex items-center gap-1">
          {onCopySelection && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={onCopySelection}
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={onClearSelection}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromptSelectionBar;
