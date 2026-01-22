import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileCode, FileJson, FileType } from 'lucide-react';
import { LogicFileData } from '@/data/mockLogicData';

interface LogicFileNodeProps {
  data: {
    file: LogicFileData;
    isSelected?: boolean;
    isFaded?: boolean;
    onClick?: () => void;
  };
  selected?: boolean;
}

const extensionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  ts: FileCode,
  tsx: FileCode,
  js: FileCode,
  jsx: FileCode,
  json: FileJson,
};

const extensionColors: Record<string, string> = {
  ts: 'bg-blue-500/20 text-blue-400',
  tsx: 'bg-blue-500/20 text-blue-400',
  js: 'bg-yellow-500/20 text-yellow-400',
  jsx: 'bg-yellow-500/20 text-yellow-400',
  json: 'bg-amber-500/20 text-amber-400',
};

export const LogicFileNode = memo(({ data, selected }: LogicFileNodeProps) => {
  const { file, isSelected, isFaded, onClick } = data;
  
  const Icon = extensionIcons[file.extension] || FileType;
  const colorClass = extensionColors[file.extension] || 'bg-muted text-muted-foreground';
  const isActive = selected || isSelected;
  
  return (
    <div
      onClick={onClick}
      className={`
        relative px-3 py-2 rounded-lg border min-w-[160px]
        bg-card/80 backdrop-blur-sm cursor-pointer
        transition-all duration-200
        ${isActive ? 'border-node-file shadow-md shadow-node-file/20' : 'border-border'}
        ${isFaded ? 'opacity-20' : 'opacity-100'}
        hover:border-node-file/60
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-node-file !border-2 !border-background"
      />
      
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-node-file" />
        <span className="font-mono text-xs text-foreground truncate">
          {file.name}
        </span>
        <span className={`ml-auto px-1.5 py-0.5 rounded text-[9px] uppercase font-semibold ${colorClass}`}>
          {file.extension}
        </span>
      </div>
      
      <p className="text-[10px] text-muted-foreground mt-1 truncate">
        {file.logicNodeIds.length} logic nodes
      </p>
      
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-node-file !border-2 !border-background"
      />
    </div>
  );
});

LogicFileNode.displayName = 'LogicFileNode';

export default LogicFileNode;
