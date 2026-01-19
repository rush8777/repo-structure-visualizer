import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { FolderData } from '@/data/mockGraphData';

interface FolderNodeProps {
  data: { 
    folder: FolderData;
    onToggleExpand?: (folderId: string) => void;
  };
  selected?: boolean;
}

const roleColors: Record<string, string> = {
  ui: 'bg-badge-ui/20 text-badge-ui border-badge-ui/30',
  api: 'bg-badge-api/20 text-badge-api border-badge-api/30',
  utils: 'bg-badge-utils/20 text-badge-utils border-badge-utils/30',
  tests: 'bg-badge-tests/20 text-badge-tests border-badge-tests/30',
  config: 'bg-badge-config/20 text-badge-config border-badge-config/30',
  core: 'bg-node-folder/20 text-node-folder border-node-folder/30',
};

const FolderNode = memo(({ data, selected }: FolderNodeProps) => {
  const { folder, onToggleExpand } = data;
  const isExpanded = folder.isExpanded;
  
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand?.(folder.id);
  };
  
  return (
    <div
      className={`
        relative px-3 py-2.5 min-w-[180px] rounded-lg
        bg-card border transition-all duration-200
        ${selected 
          ? 'border-node-folder node-glow-folder scale-105' 
          : 'border-border hover:border-node-folder/50'
        }
      `}
    >
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-node-folder !border-2 !border-card"
      />
      
      {/* Header */}
      <div className="flex items-center gap-2">
        <button 
          onClick={handleToggle}
          className="p-0.5 rounded hover:bg-accent transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>
        {isExpanded ? (
          <FolderOpen className="w-4 h-4 text-node-folder" />
        ) : (
          <Folder className="w-4 h-4 text-node-folder" />
        )}
        <span className="font-medium text-sm text-foreground">{folder.name}</span>
      </div>
      
      {/* Path & Role */}
      <div className="mt-1.5 ml-7 flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
          {folder.path}
        </span>
        <Badge 
          variant="outline" 
          className={`text-[10px] px-1.5 py-0 h-4 ${roleColors[folder.role] || roleColors.core}`}
        >
          {folder.role}
        </Badge>
      </div>
      
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-node-folder !border-2 !border-card"
      />
    </div>
  );
});

FolderNode.displayName = 'FolderNode';

export default FolderNode;
