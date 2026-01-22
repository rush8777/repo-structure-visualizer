import { useState, useCallback, useMemo } from 'react';
import { Node, Edge } from '@xyflow/react';
import {
  LogicGraphData,
  emptyLogicData,
  sampleAuthLogicData,
  getLogicEdgeStyle,
} from '@/data/mockLogicData';

export type LogicViewMode = 'files' | 'flow' | 'both';

interface LogicGraphState {
  data: LogicGraphData;
  isLoading: boolean;
  viewMode: LogicViewMode;
  expandedFolders: Set<string>;
  selectedFileId: string | null;
  selectedLogicNodeId: string | null;
  highlightedNodeIds: Set<string>;
  query: string;
}

const FOLDER_START_X = 50;
const FOLDER_START_Y = 100;
const FOLDER_GAP_Y = 180;
const FILE_OFFSET_X = 30;
const FILE_OFFSET_Y = 60;
const FILE_GAP_Y = 50;

const LOGIC_START_X = 400;
const LOGIC_START_Y = 100;
const LOGIC_GAP_X = 280;
const LOGIC_GAP_Y = 100;

export const useLogicGraphState = () => {
  const [state, setState] = useState<LogicGraphState>({
    data: emptyLogicData,
    isLoading: false,
    viewMode: 'both',
    expandedFolders: new Set(['folder-auth', 'folder-utils']),
    selectedFileId: null,
    selectedLogicNodeId: null,
    highlightedNodeIds: new Set(),
    query: '',
  });

  // Actions
  const setQuery = useCallback((query: string) => {
    setState((s) => ({ ...s, query }));
  }, []);

  const generateFlow = useCallback(() => {
    if (!state.query.trim()) return;
    
    setState((s) => ({ ...s, isLoading: true }));
    
    // Simulate API call
    setTimeout(() => {
      setState((s) => ({
        ...s,
        data: sampleAuthLogicData,
        isLoading: false,
      }));
    }, 1500);
  }, [state.query]);

  const setViewMode = useCallback((viewMode: LogicViewMode) => {
    setState((s) => ({ ...s, viewMode }));
  }, []);

  const toggleFolder = useCallback((folderId: string) => {
    setState((s) => {
      const newExpanded = new Set(s.expandedFolders);
      if (newExpanded.has(folderId)) {
        newExpanded.delete(folderId);
      } else {
        newExpanded.add(folderId);
      }
      return { ...s, expandedFolders: newExpanded };
    });
  }, []);

  const selectFile = useCallback((fileId: string | null) => {
    setState((s) => {
      if (!fileId) {
        return { ...s, selectedFileId: null, highlightedNodeIds: new Set() };
      }
      
      const file = s.data.files.find((f) => f.id === fileId);
      const highlighted = new Set(file?.logicNodeIds || []);
      
      return {
        ...s,
        selectedFileId: fileId,
        selectedLogicNodeId: null,
        highlightedNodeIds: highlighted,
      };
    });
  }, []);

  const selectLogicNode = useCallback((nodeId: string | null) => {
    setState((s) => {
      if (!nodeId) {
        return { ...s, selectedLogicNodeId: null, highlightedNodeIds: new Set() };
      }
      
      // Find upstream and downstream connections
      const upstream = new Set<string>();
      const downstream = new Set<string>();
      
      const findUpstream = (id: string) => {
        s.data.edges
          .filter((e) => e.target === id)
          .forEach((e) => {
            upstream.add(e.source);
            findUpstream(e.source);
          });
      };
      
      const findDownstream = (id: string) => {
        s.data.edges
          .filter((e) => e.source === id)
          .forEach((e) => {
            downstream.add(e.target);
            findDownstream(e.target);
          });
      };
      
      findUpstream(nodeId);
      findDownstream(nodeId);
      
      const highlighted = new Set([nodeId, ...upstream, ...downstream]);
      
      return {
        ...s,
        selectedLogicNodeId: nodeId,
        selectedFileId: null,
        highlightedNodeIds: highlighted,
      };
    });
  }, []);

  const clearSelection = useCallback(() => {
    setState((s) => ({
      ...s,
      selectedFileId: null,
      selectedLogicNodeId: null,
      highlightedNodeIds: new Set(),
    }));
  }, []);

  const clearData = useCallback(() => {
    setState((s) => ({
      ...s,
      data: emptyLogicData,
      query: '',
      selectedFileId: null,
      selectedLogicNodeId: null,
      highlightedNodeIds: new Set(),
    }));
  }, []);

  // Computed nodes and edges for React Flow
  const { nodes, edges } = useMemo(() => {
    const flowNodes: Node[] = [];
    const flowEdges: Edge[] = [];
    const { data, expandedFolders, viewMode, highlightedNodeIds, selectedFileId, selectedLogicNodeId } = state;
    
    if (!data.folders.length && !data.logicNodes.length) {
      return { nodes: flowNodes, edges: flowEdges };
    }

    const showFiles = viewMode === 'files' || viewMode === 'both';
    const showFlow = viewMode === 'flow' || viewMode === 'both';

    // Create folder and file nodes (left panel simulation in canvas for now)
    if (showFiles) {
      let folderY = FOLDER_START_Y;
      
      data.folders.forEach((folder) => {
        const isExpanded = expandedFolders.has(folder.id);
        const folderFiles = data.files.filter((f) => folder.fileIds.includes(f.id));
        
        // Folder node
        flowNodes.push({
          id: folder.id,
          type: 'folderGroup',
          position: { x: FOLDER_START_X, y: folderY },
          data: {
            folder,
            isExpanded,
            onToggleExpand: toggleFolder,
          },
        });
        
        // File nodes (children of folder)
        if (isExpanded) {
          folderFiles.forEach((file, fileIndex) => {
            const isSelected = selectedFileId === file.id;
            const isFaded = highlightedNodeIds.size > 0 && !file.logicNodeIds.some((id) => highlightedNodeIds.has(id));
            
            flowNodes.push({
              id: file.id,
              type: 'logicFile',
              position: { x: FILE_OFFSET_X, y: FILE_OFFSET_Y + fileIndex * FILE_GAP_Y },
              parentId: folder.id,
              extent: 'parent' as const,
              data: {
                file,
                isSelected,
                isFaded,
                onClick: () => selectFile(file.id),
              },
            });
          });
        }
        
        // Calculate folder height
        const folderHeight = isExpanded 
          ? FILE_OFFSET_Y + folderFiles.length * FILE_GAP_Y + 20
          : 60;
        folderY += folderHeight + 30;
      });
    }

    // Create logic nodes
    if (showFlow) {
      // Group nodes by type for layout
      const nodesByType = {
        entry: data.logicNodes.filter((n) => n.type === 'entry'),
        middleware: data.logicNodes.filter((n) => n.type === 'middleware'),
        function: data.logicNodes.filter((n) => n.type === 'function'),
        utility: data.logicNodes.filter((n) => n.type === 'utility'),
        service: data.logicNodes.filter((n) => n.type === 'service'),
      };
      
      let colX = LOGIC_START_X;
      
      Object.entries(nodesByType).forEach(([_type, typeNodes]) => {
        if (typeNodes.length === 0) return;
        
        typeNodes.forEach((logicNode, index) => {
          const isSelected = selectedLogicNodeId === logicNode.id;
          const isHighlighted = highlightedNodeIds.has(logicNode.id);
          const isFaded = highlightedNodeIds.size > 0 && !isHighlighted;
          
          flowNodes.push({
            id: logicNode.id,
            type: 'logicNode',
            position: { x: colX, y: LOGIC_START_Y + index * LOGIC_GAP_Y },
            data: {
              logicNode,
              isSelected,
              isHighlighted,
              isFaded,
              onClick: () => selectLogicNode(logicNode.id),
            },
          });
        });
        
        colX += LOGIC_GAP_X;
      });

      // Create edges
      data.edges.forEach((edge) => {
        const isHighlighted = highlightedNodeIds.has(edge.source) && highlightedNodeIds.has(edge.target);
        const isFaded = highlightedNodeIds.size > 0 && !isHighlighted;
        const style = getLogicEdgeStyle(edge.type);
        
        flowEdges.push({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: 'logicEdge',
          animated: edge.type === 'middleware',
          style: {
            ...style,
            opacity: isFaded ? 0.2 : 1,
          },
          data: {
            label: edge.label,
            edgeType: edge.type,
            isHighlighted,
          },
        });
      });
    }

    return { nodes: flowNodes, edges: flowEdges };
  }, [state, toggleFolder, selectFile, selectLogicNode]);

  return {
    state,
    nodes,
    edges,
    actions: {
      setQuery,
      generateFlow,
      setViewMode,
      toggleFolder,
      selectFile,
      selectLogicNode,
      clearSelection,
      clearData,
    },
    computed: {
      isEmpty: state.data.logicNodes.length === 0,
      hasSelection: state.selectedFileId !== null || state.selectedLogicNodeId !== null,
    },
  };
};
