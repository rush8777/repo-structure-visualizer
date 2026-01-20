import { useState, useCallback, useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { 
  mockGraphData, 
  type ViewMode, 
  type RepositoryData, 
  type FolderData, 
  type FileData,
  type GroupData,
  getFileImports,
  getFileImportedBy,
} from '@/data/mockGraphData';

// Stable layout positions - same repo = same layout every render
const LAYOUT = {
  REPO_Y: 50,
  FOLDER_L1_Y: 200,
  FOLDER_L2_Y: 380,
  FOLDER_L3_Y: 560,
  FILE_Y: 740,
  SPACING_X: 280,
  SPACING_Y: 120,
  GROUP_OFFSET_Y: 140,
};

interface GraphState {
  viewMode: ViewMode;
  expandedFolders: Set<string>;
  expandedGroups: Set<string>;
  selectedNodeId: string | null;
  searchQuery: string;
  promptSelectedIds: Set<string>;
}

export const useGraphState = () => {
const [state, setState] = useState<GraphState>({
    viewMode: 'structure',
    expandedFolders: new Set(), // Start collapsed
    expandedGroups: new Set(),
    selectedNodeId: null,
    searchQuery: '',
    promptSelectedIds: new Set(),
  });

  // Actions
  const setViewMode = useCallback((mode: ViewMode) => {
    setState(prev => ({ ...prev, viewMode: mode }));
  }, []);

  const toggleFolder = useCallback((folderId: string) => {
    setState(prev => {
      const newExpanded = new Set(prev.expandedFolders);
      if (newExpanded.has(folderId)) {
        newExpanded.delete(folderId);
      } else {
        newExpanded.add(folderId);
      }
      return { ...prev, expandedFolders: newExpanded };
    });
  }, []);

  const toggleGroup = useCallback((groupId: string) => {
    setState(prev => {
      const newExpanded = new Set(prev.expandedGroups);
      if (newExpanded.has(groupId)) {
        newExpanded.delete(groupId);
      } else {
        newExpanded.add(groupId);
      }
      return { ...prev, expandedGroups: newExpanded };
    });
  }, []);

  const selectNode = useCallback((nodeId: string | null) => {
    setState(prev => ({ ...prev, selectedNodeId: nodeId }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const togglePromptSelection = useCallback((nodeId: string) => {
    setState(prev => {
      const newSelected = new Set(prev.promptSelectedIds);
      if (newSelected.has(nodeId)) {
        newSelected.delete(nodeId);
      } else {
        newSelected.add(nodeId);
      }
      return { ...prev, promptSelectedIds: newSelected };
    });
  }, []);

  const clearPromptSelection = useCallback(() => {
    setState(prev => ({ ...prev, promptSelectedIds: new Set() }));
  }, []);

  // Computed: which files should be visible based on folder expansion
  const visibleFileIds = useMemo(() => {
    const visible = new Set<string>();

    mockGraphData.files.forEach((file) => {
      // NOTE: keep initial render clean (Repo + top-level folders only)
      // so we do not show repo-root files unless we explicitly add a repo-expand concept.
      if (file.parentId === mockGraphData.repository.id) {
        return;
      }

      // Check if parent folder chain is expanded
      let parentId = file.parentId;
      let isVisible = true;

      while (parentId && parentId !== mockGraphData.repository.id) {
        if (!state.expandedFolders.has(parentId)) {
          isVisible = false;
          break;
        }
        const parent = mockGraphData.folders.find((f) => f.id === parentId);
        parentId = parent?.parentId || '';
      }

      if (isVisible) {
        visible.add(file.id);
      }
    });

    return visible;
  }, [state.expandedFolders]);

  // Computed: related nodes for dependency highlighting
  const relatedNodeIds = useMemo(() => {
    if (!state.selectedNodeId || state.viewMode !== 'dependencies') {
      return new Set<string>();
    }
    
    const related = new Set<string>();
    related.add(state.selectedNodeId);
    
    // Files this node imports
    getFileImports(state.selectedNodeId).forEach(id => related.add(id));
    
    // Files that import this node
    getFileImportedBy(state.selectedNodeId).forEach(id => related.add(id));
    
    return related;
  }, [state.selectedNodeId, state.viewMode]);

  // Computed: search matches
  const searchMatchIds = useMemo(() => {
    if (!state.searchQuery.trim()) {
      return null; // null means no filtering
    }
    
    const query = state.searchQuery.toLowerCase();
    const matches = new Set<string>();
    
    mockGraphData.folders.forEach(f => {
      if (f.name.toLowerCase().includes(query) || f.path.toLowerCase().includes(query)) {
        matches.add(f.id);
      }
    });
    
    mockGraphData.files.forEach(f => {
      if (f.name.toLowerCase().includes(query) || f.responsibility.toLowerCase().includes(query)) {
        matches.add(f.id);
      }
    });
    
    mockGraphData.groups.forEach(g => {
      if (g.name.toLowerCase().includes(query)) {
        matches.add(g.id);
      }
    });
    
    return matches;
  }, [state.searchQuery]);

  // Generate nodes based on current state
  const generateNodes = useCallback((): Node[] => {
    const nodes: Node[] = [];
    const positionMap = new Map<string, { x: number; y: number }>();
    
    // Repository node (always visible)
    const repoX = 500;
    nodes.push({
      id: mockGraphData.repository.id,
      type: 'repository',
      position: { x: repoX, y: LAYOUT.REPO_Y },
      data: { 
        repository: mockGraphData.repository,
        isFaded: state.searchQuery && !searchMatchIds?.has(mockGraphData.repository.id),
      },
    });
    positionMap.set(mockGraphData.repository.id, { x: repoX, y: LAYOUT.REPO_Y });
    
    // Root folders (L1)
    const rootFolders = mockGraphData.folders.filter(f => f.parentId === 'repo-1');
    const l1StartX = repoX - ((rootFolders.length - 1) * LAYOUT.SPACING_X) / 2;
    
    rootFolders.forEach((folder, idx) => {
      const x = l1StartX + idx * LAYOUT.SPACING_X;
      const y = LAYOUT.FOLDER_L1_Y;
      positionMap.set(folder.id, { x, y });
      
      const isFaded = (state.searchQuery && !searchMatchIds?.has(folder.id)) ||
        (state.viewMode === 'dependencies' && state.selectedNodeId && !relatedNodeIds.has(folder.id));
      
      const isExpanded = state.expandedFolders.has(folder.id);

      nodes.push({
        id: folder.id,
        type: 'folder',
        position: { x, y },
        data: { 
          folder,
          isExpanded,
          onToggleExpand: toggleFolder,
          isFaded,
          isPromptSelected: state.promptSelectedIds.has(folder.id),
        },
      });
    });
    
    // L2 folders
    let l2Index = 0;
    mockGraphData.folders
      .filter(f => rootFolders.some(rf => rf.id === f.parentId))
      .forEach((folder) => {
        const parentId = folder.parentId;
        const parentPos = positionMap.get(parentId);
        
        // Use a stable offset for layout
        const x = 100 + l2Index * LAYOUT.SPACING_X;
        const y = LAYOUT.FOLDER_L2_Y;
        positionMap.set(folder.id, { x, y });
        l2Index++;
        
        const isFaded = (state.searchQuery && !searchMatchIds?.has(folder.id)) ||
          (state.viewMode === 'dependencies' && state.selectedNodeId && !relatedNodeIds.has(folder.id));
        
        const isExpanded = state.expandedFolders.has(folder.id);
        const parentExpanded = state.expandedFolders.has(parentId);

        const group = mockGraphData.groups.find(g => g.parentId === folder.id);
        const shouldShowGroup = group && !state.expandedGroups.has(group.id) && 
          (folder.fileCount || 0) >= 10;
        
        nodes.push({
          id: folder.id,
          type: 'folder',
          // Position relative to parent, but with layout offset
          position: { 
            x: (parentPos ? x - parentPos.x : 0), 
            y: (parentPos ? y - parentPos.y : 0) 
          },
          parentId,
          extent: 'parent',
          hidden: !parentExpanded,
          data: { 
            folder,
            isExpanded,
            onToggleExpand: toggleFolder,
            isFaded,
            isPromptSelected: state.promptSelectedIds.has(folder.id),
            hasGroup: shouldShowGroup,
          },
        } as any);
      });
    
    // L3 folders
    const l2Folders = mockGraphData.folders.filter(f => rootFolders.some(rf => rf.id === f.parentId));
    let l3Index = 0;
    mockGraphData.folders
      .filter(f => l2Folders.some(l2 => l2.id === f.parentId))
      .forEach((folder) => {
        const parentId = folder.parentId;
        const parentPos = positionMap.get(parentId);
        
        const x = parentPos ? parentPos.x - 100 + l3Index * LAYOUT.SPACING_X : 100 + l3Index * LAYOUT.SPACING_X;
        const y = LAYOUT.FOLDER_L3_Y;
        positionMap.set(folder.id, { x, y });
        l3Index++;
        
        const isFaded = (state.searchQuery && !searchMatchIds?.has(folder.id)) ||
          (state.viewMode === 'dependencies' && state.selectedNodeId && !relatedNodeIds.has(folder.id));
        
        const isExpanded = state.expandedFolders.has(folder.id);
        const parentExpanded = state.expandedFolders.has(parentId);

        nodes.push({
          id: folder.id,
          type: 'folder',
          position: { 
            x: (parentPos ? x - parentPos.x : 0), 
            y: (parentPos ? y - parentPos.y : 0) 
          },
          parentId,
          extent: 'parent',
          hidden: !parentExpanded,
          data: { 
            folder,
            isExpanded,
            onToggleExpand: toggleFolder,
            isFaded,
            isPromptSelected: state.promptSelectedIds.has(folder.id),
          },
        } as any);
      });
    
    // Group nodes
    mockGraphData.groups.forEach((group) => {
      const parentId = group.parentId;
      const parentPos = positionMap.get(parentId);
      if (!parentPos) return;
      
      const isFaded = (state.searchQuery && !searchMatchIds?.has(group.id)) ||
        (state.viewMode === 'dependencies' && state.selectedNodeId && !relatedNodeIds.has(group.id));
      
      const isExpanded = state.expandedGroups.has(group.id);
      const parentExpanded = state.expandedFolders.has(parentId);

      nodes.push({
        id: group.id,
        type: 'group',
        position: { x: 0, y: LAYOUT.GROUP_OFFSET_Y },
        parentId,
        extent: 'parent',
        hidden: !parentExpanded || isExpanded,
        data: {
          group,
          onToggleExpand: toggleGroup,
          isFaded,
          isPromptSelected: state.promptSelectedIds.has(group.id),
        },
      } as any);
    });
    
    // Files
    const filesByParent = new Map<string, typeof mockGraphData.files>();
    mockGraphData.files.forEach(file => {
      const files = filesByParent.get(file.parentId) || [];
      files.push(file);
      filesByParent.set(file.parentId, files);
    });
    
    filesByParent.forEach((files, parentId) => {
      const parentPos = positionMap.get(parentId);
      const baseX = parentPos?.x ?? 200;
      const baseY = parentPos ? parentPos.y + LAYOUT.SPACING_Y : LAYOUT.FILE_Y;
      const cols = Math.min(4, files.length);
      const colWidth = 220;
      const rowHeight = 100;
      
      files.forEach((file, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = baseX + (col - (cols - 1) / 2) * colWidth;
        const y = baseY + row * rowHeight;
        
        const isFaded = (state.searchQuery && !searchMatchIds?.has(file.id)) ||
          (state.viewMode === 'dependencies' && state.selectedNodeId && !relatedNodeIds.has(file.id));
        
        // Visibility logic
        let isVisible = visibleFileIds.has(file.id);
        const group = mockGraphData.groups.find(g => g.childIds.includes(file.id));
        if (group && !state.expandedGroups.has(group.id)) {
          isVisible = false;
        }
        if (state.viewMode === 'risk' && !file.isHotspot) {
          isVisible = false;
        }

        nodes.push({
          id: file.id,
          type: 'file',
          position: { 
            x: (parentPos ? x - parentPos.x : 0), 
            y: (parentPos ? y - parentPos.y : 0) 
          },
          parentId,
          extent: 'parent',
          hidden: !isVisible,
          data: { 
            file,
            isFaded,
            isPromptSelected: state.promptSelectedIds.has(file.id),
            isHotspot: file.isHotspot,
          },
        } as any);
      });
    });
    
    return nodes;
  }, [state, visibleFileIds, searchMatchIds, relatedNodeIds, toggleFolder, toggleGroup]);

  // Generate edges based on current state
  const generateEdges = useCallback((): Edge[] => {
    const edges: Edge[] = [];
    const visibleNodeIds = new Set(generateNodes().map(n => n.id));
    
    mockGraphData.edges.forEach((edge) => {
      // Only show edges between visible nodes
      if (!visibleNodeIds.has(edge.source) || !visibleNodeIds.has(edge.target)) {
        return;
      }
      
      // In structure mode, only show CONTAINS edges
      if (state.viewMode === 'structure' && edge.label === 'IMPORTS') {
        return;
      }
      
      // In dependencies mode, only show edges for selected node
      if (state.viewMode === 'dependencies' && edge.label === 'IMPORTS') {
        if (!state.selectedNodeId) return;
        if (edge.source !== state.selectedNodeId && edge.target !== state.selectedNodeId) {
          return;
        }
      }
      
      const isHighlighted = state.selectedNodeId && 
        (edge.source === state.selectedNodeId || edge.target === state.selectedNodeId);
      
      edges.push({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'custom',
        data: { 
          label: edge.label,
          isHighlighted,
          weight: edge.weight || 1,
        },
      });
    });
    
    // Limit to 15 IMPORT edges max
    const containsEdges = edges.filter(e => e.data?.label === 'CONTAINS');
    const importEdges = edges.filter(e => e.data?.label === 'IMPORTS').slice(0, 15);
    
    return [...containsEdges, ...importEdges];
  }, [state, generateNodes]);

  return {
    state,
    nodes: generateNodes(),
    edges: generateEdges(),
    actions: {
      setViewMode,
      toggleFolder,
      toggleGroup,
      selectNode,
      setSearchQuery,
      togglePromptSelection,
      clearPromptSelection,
    },
    computed: {
      visibleFileIds,
      relatedNodeIds,
      searchMatchIds,
      searchResultCount: searchMatchIds?.size ?? null,
    },
  };
};
