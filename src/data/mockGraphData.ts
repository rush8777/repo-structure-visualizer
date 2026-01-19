// Mock data structure for the GitHub Repository Graph
// All nodes and edges are rendered from this single JSON object

export interface RepositoryData {
  id: string;
  name: string;
  owner: string;
  description: string;
  primaryLanguage: string;
  size: number; // in MB
  visibility: 'public' | 'private';
  stars: number;
  forks: number;
  defaultBranch: string;
  lastUpdated: string;
  techStack: string[];
}

export interface FolderData {
  id: string;
  name: string;
  path: string;
  role: 'ui' | 'api' | 'utils' | 'tests' | 'config' | 'core';
  parentId: string;
  isExpanded: boolean;
}

export interface FileData {
  id: string;
  name: string;
  extension: string;
  path: string;
  lineCount: number;
  responsibility: string;
  parentId: string;
  imports: string[];
  exports: string[];
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
  label: 'CONTAINS' | 'IMPORTS';
}

export interface GraphData {
  repository: RepositoryData;
  folders: FolderData[];
  files: FileData[];
  edges: EdgeData[];
}

export const mockGraphData: GraphData = {
  repository: {
    id: 'repo-1',
    name: 'awesome-dashboard',
    owner: 'acme-corp',
    description: 'A modern dashboard application built with React and TypeScript for real-time data visualization and analytics.',
    primaryLanguage: 'TypeScript',
    size: 24.5,
    visibility: 'public',
    stars: 1247,
    forks: 189,
    defaultBranch: 'main',
    lastUpdated: '2024-01-15T14:32:00Z',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'React Query', 'Zustand', 'Vitest'],
  },
  folders: [
    {
      id: 'folder-src',
      name: 'src',
      path: '/src',
      role: 'core',
      parentId: 'repo-1',
      isExpanded: true,
    },
    {
      id: 'folder-components',
      name: 'components',
      path: '/src/components',
      role: 'ui',
      parentId: 'folder-src',
      isExpanded: true,
    },
    {
      id: 'folder-hooks',
      name: 'hooks',
      path: '/src/hooks',
      role: 'utils',
      parentId: 'folder-src',
      isExpanded: false,
    },
    {
      id: 'folder-api',
      name: 'api',
      path: '/src/api',
      role: 'api',
      parentId: 'folder-src',
      isExpanded: true,
    },
    {
      id: 'folder-tests',
      name: '__tests__',
      path: '/src/__tests__',
      role: 'tests',
      parentId: 'folder-src',
      isExpanded: false,
    },
    {
      id: 'folder-config',
      name: 'config',
      path: '/config',
      role: 'config',
      parentId: 'repo-1',
      isExpanded: false,
    },
  ],
  files: [
    {
      id: 'file-app',
      name: 'App.tsx',
      extension: 'tsx',
      path: '/src/App.tsx',
      lineCount: 145,
      responsibility: 'Main application component with routing setup',
      parentId: 'folder-src',
      imports: ['react', 'react-router-dom', './components/Dashboard', './hooks/useAuth'],
      exports: ['App'],
    },
    {
      id: 'file-dashboard',
      name: 'Dashboard.tsx',
      extension: 'tsx',
      path: '/src/components/Dashboard.tsx',
      lineCount: 234,
      responsibility: 'Primary dashboard view with widget grid',
      parentId: 'folder-components',
      imports: ['react', './Chart', './MetricCard', '../hooks/useData'],
      exports: ['Dashboard', 'DashboardProps'],
    },
    {
      id: 'file-chart',
      name: 'Chart.tsx',
      extension: 'tsx',
      path: '/src/components/Chart.tsx',
      lineCount: 189,
      responsibility: 'Reusable chart component with multiple variants',
      parentId: 'folder-components',
      imports: ['react', 'recharts', '../utils/formatters'],
      exports: ['Chart', 'ChartConfig'],
    },
    {
      id: 'file-metric',
      name: 'MetricCard.tsx',
      extension: 'tsx',
      path: '/src/components/MetricCard.tsx',
      lineCount: 78,
      responsibility: 'Displays single metric with trend indicator',
      parentId: 'folder-components',
      imports: ['react', 'lucide-react'],
      exports: ['MetricCard'],
    },
    {
      id: 'file-useauth',
      name: 'useAuth.ts',
      extension: 'ts',
      path: '/src/hooks/useAuth.ts',
      lineCount: 92,
      responsibility: 'Authentication state management hook',
      parentId: 'folder-hooks',
      imports: ['react', 'zustand', '../api/authClient'],
      exports: ['useAuth', 'AuthState'],
    },
    {
      id: 'file-usedata',
      name: 'useData.ts',
      extension: 'ts',
      path: '/src/hooks/useData.ts',
      lineCount: 156,
      responsibility: 'Data fetching and caching with React Query',
      parentId: 'folder-hooks',
      imports: ['@tanstack/react-query', '../api/dataClient'],
      exports: ['useData', 'useDataMutation'],
    },
    {
      id: 'file-authclient',
      name: 'authClient.ts',
      extension: 'ts',
      path: '/src/api/authClient.ts',
      lineCount: 67,
      responsibility: 'API client for authentication endpoints',
      parentId: 'folder-api',
      imports: ['axios', '../config/api'],
      exports: ['authClient', 'login', 'logout'],
    },
    {
      id: 'file-dataclient',
      name: 'dataClient.ts',
      extension: 'ts',
      path: '/src/api/dataClient.ts',
      lineCount: 124,
      responsibility: 'API client for data fetching operations',
      parentId: 'folder-api',
      imports: ['axios', '../config/api'],
      exports: ['dataClient', 'fetchMetrics', 'fetchChartData'],
    },
    {
      id: 'file-readme',
      name: 'README.md',
      extension: 'md',
      path: '/README.md',
      lineCount: 89,
      responsibility: 'Project documentation and setup guide',
      parentId: 'repo-1',
      imports: [],
      exports: [],
    },
  ],
  edges: [
    // Repository -> Folders
    { id: 'edge-1', source: 'repo-1', target: 'folder-src', label: 'CONTAINS' },
    { id: 'edge-2', source: 'repo-1', target: 'folder-config', label: 'CONTAINS' },
    { id: 'edge-3', source: 'repo-1', target: 'file-readme', label: 'CONTAINS' },
    
    // src -> subfolders
    { id: 'edge-4', source: 'folder-src', target: 'folder-components', label: 'CONTAINS' },
    { id: 'edge-5', source: 'folder-src', target: 'folder-hooks', label: 'CONTAINS' },
    { id: 'edge-6', source: 'folder-src', target: 'folder-api', label: 'CONTAINS' },
    { id: 'edge-7', source: 'folder-src', target: 'folder-tests', label: 'CONTAINS' },
    { id: 'edge-8', source: 'folder-src', target: 'file-app', label: 'CONTAINS' },
    
    // components -> files
    { id: 'edge-9', source: 'folder-components', target: 'file-dashboard', label: 'CONTAINS' },
    { id: 'edge-10', source: 'folder-components', target: 'file-chart', label: 'CONTAINS' },
    { id: 'edge-11', source: 'folder-components', target: 'file-metric', label: 'CONTAINS' },
    
    // hooks -> files
    { id: 'edge-12', source: 'folder-hooks', target: 'file-useauth', label: 'CONTAINS' },
    { id: 'edge-13', source: 'folder-hooks', target: 'file-usedata', label: 'CONTAINS' },
    
    // api -> files
    { id: 'edge-14', source: 'folder-api', target: 'file-authclient', label: 'CONTAINS' },
    { id: 'edge-15', source: 'folder-api', target: 'file-dataclient', label: 'CONTAINS' },
    
    // Import relationships
    { id: 'edge-import-1', source: 'file-app', target: 'file-dashboard', label: 'IMPORTS' },
    { id: 'edge-import-2', source: 'file-app', target: 'file-useauth', label: 'IMPORTS' },
    { id: 'edge-import-3', source: 'file-dashboard', target: 'file-chart', label: 'IMPORTS' },
    { id: 'edge-import-4', source: 'file-dashboard', target: 'file-metric', label: 'IMPORTS' },
    { id: 'edge-import-5', source: 'file-dashboard', target: 'file-usedata', label: 'IMPORTS' },
    { id: 'edge-import-6', source: 'file-useauth', target: 'file-authclient', label: 'IMPORTS' },
    { id: 'edge-import-7', source: 'file-usedata', target: 'file-dataclient', label: 'IMPORTS' },
  ],
};
