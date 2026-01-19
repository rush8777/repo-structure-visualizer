import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { GitBranch, Globe, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { RepositoryData } from '@/data/mockGraphData';

interface RepositoryNodeProps {
  data: { repository: RepositoryData };
  selected?: boolean;
}

const RepositoryNode = memo(({ data, selected }: RepositoryNodeProps) => {
  const { repository } = data;
  
  return (
    <div
      className={`
        relative px-4 py-3 min-w-[220px] rounded-lg
        bg-card border-2 transition-all duration-200
        ${selected 
          ? 'border-node-repository node-glow-repository scale-105' 
          : 'border-border hover:border-node-repository/50'
        }
      `}
    >
      {/* Accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg bg-gradient-to-r from-node-repository to-node-repository/60" />
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 pt-1">
        <GitBranch className="w-4 h-4 text-node-repository" />
        <span className="font-semibold text-foreground truncate">{repository.name}</span>
      </div>
      
      {/* Owner */}
      <p className="text-xs text-muted-foreground mb-2">@{repository.owner}</p>
      
      {/* Badges */}
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-node-repository/20 text-node-repository border-node-repository/30">
          {repository.primaryLanguage}
        </Badge>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 text-muted-foreground">
          {repository.size} MB
        </Badge>
        <Badge 
          variant="outline" 
          className={`text-[10px] px-1.5 py-0 h-5 flex items-center gap-1 ${
            repository.visibility === 'public' 
              ? 'text-node-file border-node-file/30' 
              : 'text-muted-foreground'
          }`}
        >
          {repository.visibility === 'public' ? (
            <Globe className="w-2.5 h-2.5" />
          ) : (
            <Lock className="w-2.5 h-2.5" />
          )}
          {repository.visibility}
        </Badge>
      </div>
      
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-node-repository !border-2 !border-card"
      />
    </div>
  );
});

RepositoryNode.displayName = 'RepositoryNode';

export default RepositoryNode;
