import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';
import { LogicFolderData } from '@/data/mockLogicData';

interface FolderGroupNodeProps {
  data: {
    folder: LogicFolderData;
    isExpanded?: boolean;
    onToggleExpand?: (folderId: string) => void;
  };
  selected?: boolean;
}

export const FolderGroupNode = memo(({ data, selected }: FolderGroupNodeProps) => {
  const { folder, isExpanded, onToggleExpand } = data;
  
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand?.(folder.id);
  };
  
  const FolderIcon = isExpanded ? FolderOpen : Folder;
  const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;
  
  return (
    <div
      className={`
        relative px-3 py-2 rounded-lg border-2 min-w-[200px]
        bg-node-folder/10 backdrop-blur-sm cursor-pointer
        transition-all duration-200
        ${selected ? 'border-node-folder shadow-lg' : 'border-node-folder/40'}
        ${isExpanded ? 'min-h-[120px]' : ''}
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-node-folder !border-2 !border-background"
      />
      
      <div className="flex items-center gap-2" onClick={handleToggle}>
        <button className="p-0.5 rounded hover:bg-muted/50 transition-colors">
          <ChevronIcon className="w-4 h-4 text-muted-foreground" />
        </button>
        <FolderIcon className="w-4 h-4 text-node-folder" />
        <span className="font-medium text-sm text-foreground">{folder.name}</span>
        <span className="text-[10px] text-muted-foreground ml-auto">
          {folder.fileIds.length} files
        </span>
      </div>
      
      <p className="text-[10px] text-muted-foreground mt-1 ml-7 truncate">
        {folder.path}
      </p>
      
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-node-folder !border-2 !border-background"
      />
    </div>
  );
});

FolderGroupNode.displayName = 'FolderGroupNode';

export default FolderGroupNode;
