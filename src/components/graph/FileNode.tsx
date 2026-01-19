import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileCode, FileText, FileJson, File } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { FileData } from '@/data/mockGraphData';

interface FileNodeProps {
  data: { 
    file: FileData;
    isFaded?: boolean;
    isPromptSelected?: boolean;
    isHotspot?: boolean;
  };
  selected?: boolean;
}

const extensionIcons: Record<string, React.ElementType> = {
  tsx: FileCode,
  ts: FileCode,
  jsx: FileCode,
  js: FileCode,
  json: FileJson,
  md: FileText,
};

const extensionColors: Record<string, string> = {
  tsx: 'bg-node-folder/20 text-node-folder border-node-folder/30',
  ts: 'bg-node-folder/20 text-node-folder border-node-folder/30',
  jsx: 'bg-badge-utils/20 text-badge-utils border-badge-utils/30',
  js: 'bg-badge-utils/20 text-badge-utils border-badge-utils/30',
  json: 'bg-badge-config/20 text-badge-config border-badge-config/30',
  md: 'bg-muted text-muted-foreground border-border',
  py: 'bg-badge-api/20 text-badge-api border-badge-api/30',
};

const FileNode = memo(({ data, selected }: FileNodeProps) => {
  const { file, isFaded, isPromptSelected, isHotspot } = data;
  const IconComponent = extensionIcons[file.extension] || File;
  const extColor = extensionColors[file.extension] || 'bg-muted text-muted-foreground border-border';
  
  return (
    <div
      className={`
        relative px-3 py-2.5 min-w-[200px] max-w-[260px] rounded-lg
        bg-card border transition-all duration-200
        ${selected 
          ? 'border-node-file node-glow-file scale-105' 
          : 'border-border hover:border-node-file/50'
        }
        ${isFaded ? 'opacity-20' : 'opacity-100'}
        ${isPromptSelected ? 'ring-2 ring-node-repository ring-offset-2 ring-offset-background' : ''}
        ${isHotspot ? 'border-l-2 border-l-destructive' : ''}
      `}
    >
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-node-file !border-2 !border-card"
      />
      
      {/* Header */}
      <div className="flex items-center gap-2">
        <IconComponent className="w-4 h-4 text-node-file flex-shrink-0" />
        <span className="font-medium text-sm text-foreground truncate">{file.name}</span>
        <Badge 
          variant="outline" 
          className={`text-[10px] px-1.5 py-0 h-4 ml-auto ${extColor}`}
        >
          .{file.extension}
        </Badge>
      </div>
      
      {/* Meta info */}
      <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
        <span>{file.lineCount} lines</span>
        <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
        <span className="truncate">{file.responsibility}</span>
      </div>
      
      {/* Output handle for imports */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-node-file !border-2 !border-card"
      />
      
      {/* Side handle for import connections */}
      <Handle
        type="source"
        position={Position.Right}
        id="imports"
        className="!w-2 !h-2 !bg-edge-imports !border-2 !border-card"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="imported-by"
        className="!w-2 !h-2 !bg-edge-imports !border-2 !border-card"
      />
    </div>
  );
});

FileNode.displayName = 'FileNode';

export default FileNode;
