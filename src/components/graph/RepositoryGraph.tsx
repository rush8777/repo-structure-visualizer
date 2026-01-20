import { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import RepositoryNode from './RepositoryNode';
import FolderNode from './FolderNode';
import FileNode from './FileNode';
import GroupNode from './GroupNode';
import CustomEdge from './CustomEdge';
import InspectorPanel from './InspectorPanel';
import GraphToolbar from './GraphToolbar';
import ViewModeSwitcher from './ViewModeSwitcher';
import SearchBar from './SearchBar';
import PromptSelectionBar from './PromptSelectionBar';
import { useGraphState } from '@/hooks/useGraphState';
import { mockGraphData, type RepositoryData, type FolderData, type FileData } from '@/data/mockGraphData';

const nodeTypes = {
  repository: RepositoryNode,
  folder: FolderNode,
  file: FileNode,
  group: GroupNode,
};

const edgeTypes = { custom: CustomEdge };

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
      style={{ left: tooltip.x + 10, top: tooltip.y - 10 }}
    >
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{tooltip.type}</span>
      <p className="text-sm text-foreground mt-0.5">{tooltip.content}</p>
    </div>
  );
};

const RepositoryGraphInner = () => {
  const { state, nodes: graphNodes, edges: graphEdges, actions, computed } = useGraphState();
  const [nodes, setNodes, onNodesChange] = useNodesState(graphNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphEdges);
  const [selectedNode, setSelectedNode] = useState<{
    type: 'repository' | 'folder' | 'file';
    data: RepositoryData | FolderData | FileData;
  } | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { zoomIn, zoomOut, fitView, setViewport } = useReactFlow();

  // Sync nodes/edges when graph state changes (but preserve user-moved positions)
  useEffect(() => {
    setNodes((currentNodes) => {
      const positionMap = new Map(currentNodes.map(n => [n.id, n.position]));
      return graphNodes.map(node => ({
        ...node,
        position: positionMap.get(node.id) ?? node.position,
      }));
    });
    setEdges(graphEdges);
  }, [graphNodes, graphEdges, setNodes, setEdges]);

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const nodeData = node.data as Record<string, unknown>;
    actions.selectNode(node.id);
    
    if (state.viewMode === 'prompt') {
      actions.togglePromptSelection(node.id);
      return;
    }
    
    if (node.type === 'repository') {
      setSelectedNode({ type: 'repository', data: nodeData.repository as RepositoryData });
    } else if (node.type === 'folder') {
      setSelectedNode({ type: 'folder', data: nodeData.folder as FolderData });
    } else if (node.type === 'file') {
      setSelectedNode({ type: 'file', data: nodeData.file as FileData });
    }
  }, [actions, state.viewMode]);

  const handleNodeMouseEnter = useCallback((_: React.MouseEvent, node: Node) => {
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    const nodeData = node.data as Record<string, unknown>;
    let content = '', type = '';
    
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
      setTooltip({ x: (_ as React.MouseEvent).clientX, y: (_ as React.MouseEvent).clientY, content, type });
    }, 400);
  }, []);

  const handleNodeMouseLeave = useCallback(() => {
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    setTooltip(null);
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
    actions.selectNode(null);
  }, [actions]);

  const promptSelectedNames = Array.from(state.promptSelectedIds).map(id => {
    const file = mockGraphData.files.find(f => f.id === id);
    const folder = mockGraphData.folders.find(f => f.id === id);
    return file?.name || folder?.name || id;
  });

  return (
    <div className="relative w-full h-screen graph-container">
      {/* Top toolbar */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
        <GraphToolbar
          showFiles={state.viewMode !== 'structure'}
          onToggleFiles={() => {}}
          onZoomIn={() => zoomIn({ duration: 200 })}
          onZoomOut={() => zoomOut({ duration: 200 })}
          onFitView={() => fitView({ duration: 300, padding: 0.2 })}
          onReset={() => setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 300 })}
        />
      </div>
      
      {/* Mode switcher & search */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        <ViewModeSwitcher currentMode={state.viewMode} onModeChange={actions.setViewMode} />
        <SearchBar 
          onSearch={actions.setSearchQuery} 
          onClear={() => actions.setSearchQuery('')}
          resultCount={computed.searchResultCount ?? undefined}
        />
      </div>
      
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
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="hsl(220, 10%, 20%)" />
        <MiniMap 
          className="!bg-card/80 !border-border"
          nodeColor={(n) => n.type === 'repository' ? 'hsl(38, 92%, 50%)' : n.type === 'folder' ? 'hsl(217, 91%, 60%)' : 'hsl(160, 84%, 39%)'}
          maskColor="rgba(0,0,0,0.8)"
        />
      </ReactFlow>
      
      <NodeTooltip tooltip={tooltip} />
      <InspectorPanel selectedNode={selectedNode} onClose={() => setSelectedNode(null)} />
      <PromptSelectionBar 
        selectedCount={state.promptSelectedIds.size}
        selectedItems={promptSelectedNames}
        onClearSelection={actions.clearPromptSelection}
      />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 p-3 rounded-lg bg-card/90 backdrop-blur border border-border">
        <p className="text-xs font-medium text-muted-foreground mb-2">Legend</p>
        <div className="flex flex-col gap-1.5 text-xs">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-node-repository" /><span>Repository</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-node-folder" /><span>Folder</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-node-file" /><span>File</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded border-2 border-dashed border-badge-ui" /><span>Group</span></div>
        </div>
      </div>
    </div>
  );
};

export const RepositoryGraph = () => (
  <ReactFlowProvider>
    <RepositoryGraphInner />
  </ReactFlowProvider>
);

export default RepositoryGraph;
