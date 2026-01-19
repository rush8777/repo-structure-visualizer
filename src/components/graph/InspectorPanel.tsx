import { X, GitBranch, Star, GitFork, Calendar, Folder, FileCode, ArrowRight, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { RepositoryData, FolderData, FileData } from '@/data/mockGraphData';

interface InspectorPanelProps {
  selectedNode: {
    type: 'repository' | 'folder' | 'file';
    data: RepositoryData | FolderData | FileData;
  } | null;
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const RepositoryInspector = ({ data }: { data: RepositoryData }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-node-repository/20">
        <GitBranch className="w-5 h-5 text-node-repository" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{data.name}</h3>
        <p className="text-xs text-muted-foreground">@{data.owner}</p>
      </div>
    </div>
    
    <p className="text-sm text-muted-foreground leading-relaxed">
      {data.description}
    </p>
    
    <Separator className="bg-border" />
    
    <div className="grid grid-cols-2 gap-3">
      <div className="flex items-center gap-2 text-sm">
        <Star className="w-4 h-4 text-node-repository" />
        <span className="text-foreground">{data.stars.toLocaleString()}</span>
        <span className="text-muted-foreground">stars</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <GitFork className="w-4 h-4 text-muted-foreground" />
        <span className="text-foreground">{data.forks.toLocaleString()}</span>
        <span className="text-muted-foreground">forks</span>
      </div>
    </div>
    
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Default branch</span>
        <Badge variant="outline" className="font-mono">{data.defaultBranch}</Badge>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Size</span>
        <span className="text-foreground">{data.size} MB</span>
      </div>
    </div>
    
    <Separator className="bg-border" />
    
    <div className="space-y-2">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Tech Stack
      </span>
      <div className="flex flex-wrap gap-1.5">
        {data.techStack.map((tech) => (
          <Badge key={tech} variant="secondary" className="text-xs">
            {tech}
          </Badge>
        ))}
      </div>
    </div>
    
    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
      <Calendar className="w-3.5 h-3.5" />
      <span>Last updated {formatDate(data.lastUpdated)}</span>
    </div>
  </div>
);

const FolderInspector = ({ data }: { data: FolderData }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-node-folder/20">
        <Folder className="w-5 h-5 text-node-folder" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{data.name}</h3>
        <p className="text-xs text-muted-foreground font-mono">{data.path}</p>
      </div>
    </div>
    
    <Separator className="bg-border" />
    
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Role</span>
        <Badge variant="secondary" className="capitalize">{data.role}</Badge>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">State</span>
        <span className="text-foreground">{data.isExpanded ? 'Expanded' : 'Collapsed'}</span>
      </div>
    </div>
  </div>
);

const FileInspector = ({ data }: { data: FileData }) => (
  <Tabs defaultValue="overview" className="w-full">
    <TabsList className="grid w-full grid-cols-3 bg-muted/50">
      <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
      <TabsTrigger value="imports" className="text-xs">Imports</TabsTrigger>
      <TabsTrigger value="exports" className="text-xs">Exports</TabsTrigger>
    </TabsList>
    
    <TabsContent value="overview" className="mt-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-node-file/20">
          <FileCode className="w-5 h-5 text-node-file" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{data.name}</h3>
          <p className="text-xs text-muted-foreground font-mono">{data.path}</p>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground leading-relaxed">
        {data.responsibility}
      </p>
      
      <Separator className="bg-border" />
      
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50">
          <span className="text-xs text-muted-foreground">Lines</span>
          <span className="text-lg font-semibold text-foreground">{data.lineCount}</span>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50">
          <span className="text-xs text-muted-foreground">Extension</span>
          <span className="text-lg font-semibold text-foreground">.{data.extension}</span>
        </div>
      </div>
    </TabsContent>
    
    <TabsContent value="imports" className="mt-4">
      <div className="space-y-2">
        {data.imports.length > 0 ? (
          data.imports.map((imp, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-2 p-2 rounded-md bg-muted/30 text-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-edge-imports" />
              <code className="text-foreground font-mono text-xs">{imp}</code>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No imports</p>
        )}
      </div>
    </TabsContent>
    
    <TabsContent value="exports" className="mt-4">
      <div className="space-y-2">
        {data.exports.length > 0 ? (
          data.exports.map((exp, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-2 p-2 rounded-md bg-muted/30 text-sm"
            >
              <ArrowRight className="w-3.5 h-3.5 text-node-file" />
              <code className="text-foreground font-mono text-xs">{exp}</code>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No exports</p>
        )}
      </div>
    </TabsContent>
  </Tabs>
);

export const InspectorPanel = ({ selectedNode, onClose }: InspectorPanelProps) => {
  if (!selectedNode) return null;
  
  return (
    <div className="absolute top-4 right-4 bottom-4 w-80 inspector-panel rounded-xl border border-inspector-border overflow-hidden animate-slide-in-right z-10">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-sm font-medium text-foreground uppercase tracking-wider">
          Inspector
        </h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7" 
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(100%-56px)]">
        <div className="p-4">
          {selectedNode.type === 'repository' && (
            <RepositoryInspector data={selectedNode.data as RepositoryData} />
          )}
          {selectedNode.type === 'folder' && (
            <FolderInspector data={selectedNode.data as FolderData} />
          )}
          {selectedNode.type === 'file' && (
            <FileInspector data={selectedNode.data as FileData} />
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default InspectorPanel;
