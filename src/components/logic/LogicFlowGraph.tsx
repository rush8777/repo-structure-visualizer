import { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
  Node,
  Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import LogicNodeComponent from './LogicNode';
import LogicEdgeComponent from './LogicEdge';
import FolderGroupNode from './FolderGroupNode';
import LogicFileNode from './LogicFileNode';
import LogicToolbar from './LogicToolbar';
import LogicLegend from './LogicLegend';
import EmptyState from './EmptyState';
import { useLogicGraphState } from '@/hooks/useLogicGraphState';

const nodeTypes = {
  logicNode: LogicNodeComponent,
  folderGroup: FolderGroupNode,
  logicFile: LogicFileNode,
};

const edgeTypes = {
  logicEdge: LogicEdgeComponent,
};

const LogicFlowGraphInner = () => {
  const { state, nodes: graphNodes, edges: graphEdges, actions, computed } = useLogicGraphState();
  const [nodes, setNodes, onNodesChange] = useNodesState(graphNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphEdges);
  const { fitView } = useReactFlow();
  
  // Store user-modified positions persistently
  const userPositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map());

  // Sync nodes/edges when graph state changes
  useEffect(() => {
    setNodes((currentNodes) => {
      const currentPosMap = new Map(currentNodes.map(n => [n.id, n.position]));
      
      return graphNodes.map(graphNode => {
        const userPos = userPositionsRef.current.get(graphNode.id);
        const currentPos = currentPosMap.get(graphNode.id);
        const position = userPos ?? currentPos ?? graphNode.position;
        
        return {
          ...graphNode,
          position,
        };
      });
    });
    setEdges(graphEdges);
  }, [graphNodes, graphEdges, setNodes, setEdges]);

  // Fit view when data loads
  useEffect(() => {
    if (!computed.isEmpty) {
      setTimeout(() => fitView({ padding: 0.2, duration: 300 }), 100);
    }
  }, [computed.isEmpty, fitView]);

  const handleNodeDragStop = useCallback((_: React.MouseEvent, node: Node) => {
    userPositionsRef.current.set(node.id, { x: node.position.x, y: node.position.y });
  }, []);

  const handlePaneClick = useCallback(() => {
    actions.clearSelection();
  }, [actions]);

  return (
    <div className="flex flex-col w-full h-screen bg-background">
      {/* Top toolbar */}
      <LogicToolbar
        query={state.query}
        onQueryChange={actions.setQuery}
        onGenerate={actions.generateFlow}
        isLoading={state.isLoading}
        viewMode={state.viewMode}
        onViewModeChange={actions.setViewMode}
        onClear={actions.clearData}
        hasData={!computed.isEmpty}
      />
      
      {/* Main canvas area */}
      <div className="flex-1 relative">
        {/* Dynamic title */}
        {state.data.title && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-lg bg-card/90 backdrop-blur-sm border border-border">
            <h2 className="text-sm font-semibold text-foreground">{state.data.title}</h2>
            <p className="text-xs text-muted-foreground text-center mt-0.5">
              {state.data.logicNodes.length} logic nodes • {state.data.files.length} files
            </p>
          </div>
        )}
        
        {computed.isEmpty && !state.isLoading ? (
          <EmptyState isLoading={state.isLoading} />
        ) : state.isLoading ? (
          <EmptyState isLoading={true} />
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeDragStop={handleNodeDragStop}
            onPaneClick={handlePaneClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.2}
            maxZoom={2}
            proOptions={{ hideAttribution: true }}
            defaultEdgeOptions={{
              type: 'logicEdge',
            }}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="hsl(220, 10%, 20%)" />
            <Controls className="!bg-card !border-border !rounded-lg" />
            <MiniMap 
              className="!bg-card/80 !border-border"
              nodeColor={(n) => {
                if (n.type === 'logicNode') return 'hsl(217, 91%, 60%)';
                if (n.type === 'folderGroup') return 'hsl(217, 91%, 60%)';
                return 'hsl(160, 84%, 39%)';
              }}
              maskColor="rgba(0,0,0,0.8)"
            />
          </ReactFlow>
        )}
        
        {/* Legend (only show when there's data) */}
        {!computed.isEmpty && <LogicLegend />}
      </div>
    </div>
  );
};

export const LogicFlowGraph = () => (
  <ReactFlowProvider>
    <LogicFlowGraphInner />
  </ReactFlowProvider>
);

export default LogicFlowGraph;
