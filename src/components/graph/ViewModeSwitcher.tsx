import { Layers, GitBranch, AlertTriangle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { ViewMode } from '@/data/mockGraphData';

interface ViewModeSwitcherProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

const modes: { id: ViewMode; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'structure', label: 'Structure', icon: Layers, description: 'Repository → Folders → Files' },
  { id: 'dependencies', label: 'Dependencies', icon: GitBranch, description: 'Import relationships on selection' },
  { id: 'risk', label: 'Risk', icon: AlertTriangle, description: 'Hotspots & large folders' },
  { id: 'prompt', label: 'Prompt', icon: MessageSquare, description: 'Select context for prompts' },
];

export const ViewModeSwitcher = ({ currentMode, onModeChange }: ViewModeSwitcherProps) => {
  return (
    <div className="flex items-center gap-0.5 p-1 rounded-lg bg-card/90 backdrop-blur border border-border">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = currentMode === mode.id;
        
        return (
          <Tooltip key={mode.id}>
            <TooltipTrigger asChild>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                size="sm"
                className={`h-8 px-3 gap-1.5 text-xs transition-all ${
                  isActive 
                    ? 'bg-secondary text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => onModeChange(mode.id)}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{mode.label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[200px]">
              <p className="font-medium">{mode.label}</p>
              <p className="text-xs text-muted-foreground">{mode.description}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default ViewModeSwitcher;
