import { useState, useCallback, useMemo, useRef } from 'react';
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import RepositoryNode from './RepositoryNode';
import FolderNode from './FolderNode';
import FileNode from './FileNode';
import CustomEdge from './CustomEdge';
import InspectorPanel from './InspectorPanel';
import GraphToolbar from './GraphToolbar';
import { mockGraphData, type RepositoryData, type FolderData, type FileData } from '@/data/mockGraphData';

const nodeTypes = {
  repository: RepositoryNode,
  folder: FolderNode,
  file: FileNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

// Tooltip component
interface TooltipData {
  x: number;
  y: number;
  content: string;
  type: string;
}

const NodeTooltip = ({ tooltip }: { tooltip: TooltipData | null }) => {
  if (!tooltip) return null;
  
  return (
    <div
      className="fixed z-50 px-3 py-2 rounded-lg bg-popover border border-border shadow-lg pointer-events-none animate-fade-in max-w-xs"
      style={{
        left: tooltip.x + 10,
        top: tooltip.y - 10,
      }}
    >
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {tooltip.type}
      </span>
      <p className="text-sm text-foreground mt-0.5">{tooltip.content}</p>
    </div>
  );
};

// Generate initial node positions using a hierarchical layout
const generateLayout = (data: typeof mockGraphData, showFiles: boolean) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Repository node at top
  nodes.push({
    id: data.repository.id,
    type: 'repository',
    position: { x: 400, y: 0 },
    data: { repository: data.repository },
  });
  
  // First level folders (connected to repo)
  const rootFolders = data.folders.filter(f => f.parentId === data.repository.id);
  const folderSpacing = 280;
  const startX = 400 - ((rootFolders.length - 1) * folderSpacing) / 2;
  
  rootFolders.forEach((folder, idx) => {
    nodes.push({
      id: folder.id,
      type: 'folder',
      position: { x: startX + idx * folderSpacing, y: 140 },
      data: { folder },
    });
  });
  
  // Second level folders (connected to src)
  const srcFolder = data.folders.find(f => f.name === 'src');
  if (srcFolder) {
    const subFolders = data.folders.filter(f => f.parentId === srcFolder.id);
    const subStartX = 100;
    
    subFolders.forEach((folder, idx) => {
      nodes.push({
        id: folder.id,
        type: 'folder',
        position: { x: subStartX + idx * 200, y: 280 },
        data: { folder },
      });
    });
  }
  
  // Files
  if (showFiles) {
    // Files in src root
    const srcFiles = data.files.filter(f => f.parentId === 'folder-src');
    srcFiles.forEach((file, idx) => {
      nodes.push({
        id: file.id,
        type: 'file',
        position: { x: 700 + idx * 240, y: 280 },
        data: { file },
      });
    });
    
    // Files in components
    const componentFiles = data.files.filter(f => f.parentId === 'folder-components');
    componentFiles.forEach((file, idx) => {
      nodes.push({
        id: file.id,
        type: 'file',
        position: { x: 0 + idx * 240, y: 420 },
        data: { file },
      });
    });
    
    // Files in hooks
    const hookFiles = data.files.filter(f => f.parentId === 'folder-hooks');
    hookFiles.forEach((file, idx) => {
      nodes.push({
        id: file.id,
        type: 'file',
        position: { x: 180 + idx * 240, y: 560 },
        data: { file },
      });
    });
    
    // Files in api
    const apiFiles = data.files.filter(f => f.parentId === 'folder-api');
    apiFiles.forEach((file, idx) => {
      nodes.push({
        id: file.id,
        type: 'file',
        position: { x: 580 + idx * 240, y: 420 },
        data: { file },
      });
    });
    
    // Root files (README)
    const rootFiles = data.files.filter(f => f.parentId === 'repo-1');
    rootFiles.forEach((file) => {
      nodes.push({
        id: file.id,
        type: 'file',
        position: { x: 700, y: 140 },
        data: { file },
      });
    });
  }
  
  // Edges
  data.edges.forEach((edge) => {
    // Skip file edges if files are hidden
    const isFileEdge = edge.source.startsWith('file-') || edge.target.startsWith('file-');
    if (!showFiles && isFileEdge) return;
    
    edges.push({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'custom',
      data: { label: edge.label },
      sourceHandle: edge.label === 'IMPORTS' ? 'imports' : undefined,
      targetHandle: edge.label === 'IMPORTS' ? 'imported-by' : undefined,
    });
  });
  
  return { nodes, edges };
};

const RepositoryGraphInner = () => {
  const [showFiles, setShowFiles] = useState(true);
  const [selectedNode, setSelectedNode] = useState<{
    type: 'repository' | 'folder' | 'file';
    data: RepositoryData | FolderData | FileData;
  } | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => generateLayout(mockGraphData, showFiles),
    [showFiles]
  );
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { zoomIn, zoomOut, fitView, setViewport } = useReactFlow();
  
  // Update nodes when showFiles changes
  useMemo(() => {
    const { nodes: newNodes, edges: newEdges } = generateLayout(mockGraphData, showFiles);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [showFiles, setNodes, setEdges]);
  
  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const nodeData = node.data as Record<string, unknown>;
    
    if (node.type === 'repository') {
      setSelectedNode({ type: 'repository', data: nodeData.repository as RepositoryData });
    } else if (node.type === 'folder') {
      setSelectedNode({ type: 'folder', data: nodeData.folder as FolderData });
    } else if (node.type === 'file') {
      setSelectedNode({ type: 'file', data: nodeData.file as FileData });
    }
    
    // Highlight connected edges
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        data: {
          ...edge.data,
          isHighlighted: edge.source === node.id || edge.target === node.id,
        },
      }))
    );
  }, [setEdges]);
  
  const handleNodeMouseEnter = useCallback((_: React.MouseEvent, node: Node) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    
    const nodeData = node.data as Record<string, unknown>;
    let content = '';
    let type = '';
    
    if (node.type === 'repository') {
      const repo = nodeData.repository as RepositoryData;
      content = repo.description.slice(0, 80) + '...';
      type = 'Repository';
    } else if (node.type === 'folder') {
      const folder = nodeData.folder as FolderData;
      content = `${folder.path} • ${folder.role}`;
      type = 'Folder';
    } else if (node.type === 'file') {
      const file = nodeData.file as FileData;
      content = file.responsibility;
      type = 'File';
    }
    
    tooltipTimeoutRef.current = setTimeout(() => {
      const event = _ as React.MouseEvent;
      setTooltip({
        x: event.clientX,
        y: event.clientY,
        content,
        type,
      });
    }, 400);
  }, []);
  
  const handleNodeMouseLeave = useCallback(() => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setTooltip(null);
  }, []);
  
  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        data: { ...edge.data, isHighlighted: false },
      }))
    );
  }, [setEdges]);
  
  const handleReset = useCallback(() => {
    setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 300 });
    setSelectedNode(null);
  }, [setViewport]);
  
  return (
    <div className="relative w-full h-screen graph-container">
      <GraphToolbar
        showFiles={showFiles}
        onToggleFiles={() => setShowFiles(!showFiles)}
        onZoomIn={() => zoomIn({ duration: 200 })}
        onZoomOut={() => zoomOut({ duration: 200 })}
        onFitView={() => fitView({ duration: 300, padding: 0.2 })}
        onReset={handleReset}
      />
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'custom',
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={24} 
          size={1.5}
          color="hsl(220, 10%, 20%)"
        />
      </ReactFlow>
      
      <NodeTooltip tooltip={tooltip} />
      <InspectorPanel selectedNode={selectedNode} onClose={() => setSelectedNode(null)} />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 p-3 rounded-lg bg-card/90 backdrop-blur border border-border">
        <p className="text-xs font-medium text-muted-foreground mb-2">Legend</p>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded bg-node-repository" />
            <span className="text-foreground">Repository</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded bg-node-folder" />
            <span className="text-foreground">Folder</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded bg-node-file" />
            <span className="text-foreground">File</span>
          </div>
          <div className="flex items-center gap-2 text-xs mt-1">
            <div className="w-6 h-0.5 bg-edge-active" />
            <span className="text-foreground">Contains</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-6 h-0.5 bg-edge-imports" style={{ borderTopStyle: 'dashed' }} />
            <span className="text-foreground">Imports</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RepositoryGraph = () => {
  return (
    <ReactFlowProvider>
      <RepositoryGraphInner />
    </ReactFlowProvider>
  );
};

export default RepositoryGraph;
