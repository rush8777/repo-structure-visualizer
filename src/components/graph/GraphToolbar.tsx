import { ZoomIn, ZoomOut, Maximize, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface GraphToolbarProps {
  showFiles: boolean;
  onToggleFiles: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onReset: () => void;
}

export const GraphToolbar = ({
  showFiles,
  onToggleFiles,
  onZoomIn,
  onZoomOut,
  onFitView,
  onReset,
}: GraphToolbarProps) => {
  return (
    <div className="absolute top-4 left-4 z-10 flex items-center gap-1 p-1 rounded-lg bg-card/90 backdrop-blur border border-border shadow-lg">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Zoom In</TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Zoom Out</TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onFitView}>
            <Maximize className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Fit View</TooltipContent>
      </Tooltip>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={showFiles ? 'ghost' : 'secondary'} 
            size="icon" 
            className="h-8 w-8" 
            onClick={onToggleFiles}
          >
            {showFiles ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {showFiles ? 'Hide Files (Structure Only)' : 'Show Files'}
        </TooltipContent>
      </Tooltip>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Reset View</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default GraphToolbar;
