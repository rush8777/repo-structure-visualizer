import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Layers, ChevronRight, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { GroupData } from '@/data/mockGraphData';

interface GroupNodeProps {
  data: { 
    group: GroupData;
    onToggleExpand?: (groupId: string) => void;
    isFaded?: boolean;
    isPromptSelected?: boolean;
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
  state: 'bg-badge-utils/20 text-badge-utils border-badge-utils/30',
  auth: 'bg-badge-api/20 text-badge-api border-badge-api/30',
};

const GroupNode = memo(({ data, selected }: GroupNodeProps) => {
  const { group, onToggleExpand, isFaded, isPromptSelected } = data;
  
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand?.(group.id);
  };
  
  return (
    <div
      className={`
        relative px-4 py-3 min-w-[180px] rounded-lg
        bg-gradient-to-br from-card to-muted/50 border-2 border-dashed
        transition-all duration-200
        ${selected 
          ? 'border-badge-ui scale-105' 
          : 'border-border hover:border-badge-ui/50'
        }
        ${isFaded ? 'opacity-20' : 'opacity-100'}
        ${isPromptSelected ? 'ring-2 ring-node-repository ring-offset-2 ring-offset-background' : ''}
      `}
    >
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-badge-ui !border-2 !border-card"
      />
      
      {/* Header */}
      <div className="flex items-center gap-2">
        <button 
          onClick={handleToggle}
          className="p-0.5 rounded hover:bg-accent transition-colors"
        >
          {group.isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>
        <Layers className="w-4 h-4 text-badge-ui" />
        <span className="font-medium text-sm text-foreground">{group.name}</span>
      </div>
      
      {/* Meta info */}
      <div className="mt-2 ml-7 flex items-center gap-2">
        <Badge 
          variant="outline" 
          className={`text-[10px] px-1.5 py-0 h-4 ${roleColors[group.role] || roleColors.core}`}
        >
          {group.role}
        </Badge>
        <span className="text-[10px] text-muted-foreground">
          Click to expand
        </span>
      </div>
      
      {/* Count indicator */}
      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-badge-ui text-background text-xs font-bold flex items-center justify-center">
        {group.count}
      </div>
      
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-badge-ui !border-2 !border-card"
      />
    </div>
  );
});

GroupNode.displayName = 'GroupNode';

export default GroupNode;
