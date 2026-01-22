import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Code, Layers, Wrench, Server, Play } from 'lucide-react';
import { LogicNodeData, getLogicNodeTypeColor } from '@/data/mockLogicData';

interface LogicNodeProps {
  data: {
    logicNode: LogicNodeData;
    isSelected?: boolean;
    isHighlighted?: boolean;
    isFaded?: boolean;
    onClick?: () => void;
  };
  selected?: boolean;
}

const typeIcons: Record<LogicNodeData['type'], React.ComponentType<{ className?: string }>> = {
  entry: Play,
  function: Code,
  middleware: Layers,
  utility: Wrench,
  service: Server,
};

const typeLabels: Record<LogicNodeData['type'], string> = {
  entry: 'Entry',
  function: 'Function',
  middleware: 'Middleware',
  utility: 'Utility',
  service: 'Service',
};

export const LogicNodeComponent = memo(({ data, selected }: LogicNodeProps) => {
  const { logicNode, isSelected, isHighlighted, isFaded, onClick } = data;
  const Icon = typeIcons[logicNode.type];
  const colorClass = getLogicNodeTypeColor(logicNode.type);
  
  const isActive = selected || isSelected || isHighlighted;
  
  return (
    <div
      onClick={onClick}
      className={`
        relative px-4 py-3 rounded-xl border-2 min-w-[200px] max-w-[260px]
        bg-card/95 backdrop-blur-sm cursor-pointer
        transition-all duration-200 ease-out
        ${isActive ? 'border-primary shadow-lg shadow-primary/20 scale-105' : 'border-border'}
        ${isFaded ? 'opacity-20' : 'opacity-100'}
        hover:border-primary/60 hover:shadow-md
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-muted-foreground !border-2 !border-background"
      />
      
      {/* Type badge */}
      <div className={`
        absolute -top-2.5 left-3 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider
        border ${colorClass}
      `}>
        <Icon className="inline-block w-3 h-3 mr-1" />
        {typeLabels[logicNode.type]}
      </div>
      
      {/* Function name */}
      <p className="font-mono text-sm font-medium text-foreground mt-2">
        {logicNode.name}
      </p>
      
      {/* Description */}
      {logicNode.description && (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {logicNode.description}
        </p>
      )}
      
      {/* Parameters & Returns */}
      <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
        {logicNode.parameters && logicNode.parameters.length > 0 && (
          <span className="px-1.5 py-0.5 rounded bg-muted">
            ({logicNode.parameters.length} params)
          </span>
        )}
        {logicNode.returns && (
          <span className="px-1.5 py-0.5 rounded bg-muted">
            → {logicNode.returns}
          </span>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !bg-muted-foreground !border-2 !border-background"
      />
    </div>
  );
});

LogicNodeComponent.displayName = 'LogicNodeComponent';

export default LogicNodeComponent;
