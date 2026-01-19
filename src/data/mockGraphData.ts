// Mock data structure for the GitHub Repository Graph
// All nodes and edges are rendered from this single JSON object

export type ViewMode = 'structure' | 'dependencies' | 'risk' | 'prompt';

export type SemanticTag = 'auth' | 'ui' | 'api' | 'utils' | 'state' | 'config' | 'tests' | 'core' | 'data' | 'routing';

export interface RepositoryData {
  id: string;
  name: string;
  owner: string;
  description: string;
  primaryLanguage: string;
  size: number;
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
  role: 'ui' | 'api' | 'utils' | 'tests' | 'config' | 'core' | 'state' | 'routing' | 'data';
  semanticTag: SemanticTag;
  parentId: string;
  isExpanded: boolean;
  fileCount?: number;
  isPinned?: boolean;
}

export interface FileData {
  id: string;
  name: string;
  extension: string;
  path: string;
  lineCount: number;
  responsibility: string;
  semanticTag: SemanticTag;
  parentId: string;
  imports: string[];
  exports: string[];
  importWeight?: number; // 1-5 for edge thickness
  isHotspot?: boolean; // for risk mode
}

export interface GroupData {
  id: string;
  name: string;
  count: number;
  role: string;
  semanticTag: SemanticTag;
  parentId: string;
  childIds: string[];
  isExpanded: boolean;
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
  label: 'CONTAINS' | 'IMPORTS';
  weight?: number; // 1-5 for visual thickness
}

export interface GraphData {
  repository: RepositoryData;
  folders: FolderData[];
  files: FileData[];
  groups: GroupData[];
  edges: EdgeData[];
}

// Helper to create files quickly
const createFile = (
  id: string,
  name: string,
  parentId: string,
  lineCount: number,
  responsibility: string,
  semanticTag: SemanticTag,
  imports: string[] = [],
  exports: string[] = [],
  importWeight = 1,
  isHotspot = false
): FileData => {
  const ext = name.split('.').pop() || 'ts';
  return {
    id,
    name,
    extension: ext,
    path: `/${parentId.replace('folder-', '')}/${name}`,
    lineCount,
    responsibility,
    semanticTag,
    parentId,
    imports,
    exports,
    importWeight,
    isHotspot,
  };
};

export const mockGraphData: GraphData = {
  repository: {
    id: 'repo-1',
    name: 'enterprise-dashboard',
    owner: 'acme-corp',
    description: 'A modern enterprise dashboard application built with React and TypeScript for real-time data visualization, analytics, and team collaboration.',
    primaryLanguage: 'TypeScript',
    size: 156.5,
    visibility: 'public',
    stars: 4892,
    forks: 723,
    defaultBranch: 'main',
    lastUpdated: '2024-01-15T14:32:00Z',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'React Query', 'Zustand', 'Vitest', 'React Router', 'Recharts'],
  },
  folders: [
    // Root folders
    { id: 'folder-src', name: 'src', path: '/src', role: 'core', semanticTag: 'core', parentId: 'repo-1', isExpanded: true, fileCount: 52 },
    { id: 'folder-config', name: 'config', path: '/config', role: 'config', semanticTag: 'config', parentId: 'repo-1', isExpanded: false, fileCount: 5 },
    { id: 'folder-tests', name: '__tests__', path: '/__tests__', role: 'tests', semanticTag: 'tests', parentId: 'repo-1', isExpanded: false, fileCount: 12 },
    
    // Src subfolders
    { id: 'folder-components', name: 'components', path: '/src/components', role: 'ui', semanticTag: 'ui', parentId: 'folder-src', isExpanded: true, fileCount: 24 },
    { id: 'folder-hooks', name: 'hooks', path: '/src/hooks', role: 'utils', semanticTag: 'utils', parentId: 'folder-src', isExpanded: false, fileCount: 8 },
    { id: 'folder-api', name: 'api', path: '/src/api', role: 'api', semanticTag: 'api', parentId: 'folder-src', isExpanded: true, fileCount: 6 },
    { id: 'folder-store', name: 'store', path: '/src/store', role: 'state', semanticTag: 'state', parentId: 'folder-src', isExpanded: false, fileCount: 5 },
    { id: 'folder-pages', name: 'pages', path: '/src/pages', role: 'routing', semanticTag: 'routing', parentId: 'folder-src', isExpanded: false, fileCount: 8 },
    { id: 'folder-utils', name: 'utils', path: '/src/utils', role: 'utils', semanticTag: 'utils', parentId: 'folder-src', isExpanded: false, fileCount: 6 },
    
    // Components subfolders
    { id: 'folder-ui', name: 'ui', path: '/src/components/ui', role: 'ui', semanticTag: 'ui', parentId: 'folder-components', isExpanded: false, fileCount: 12 },
    { id: 'folder-charts', name: 'charts', path: '/src/components/charts', role: 'ui', semanticTag: 'ui', parentId: 'folder-components', isExpanded: false, fileCount: 6 },
    { id: 'folder-auth', name: 'auth', path: '/src/components/auth', role: 'ui', semanticTag: 'auth', parentId: 'folder-components', isExpanded: false, fileCount: 4 },
    { id: 'folder-layout', name: 'layout', path: '/src/components/layout', role: 'ui', semanticTag: 'ui', parentId: 'folder-components', isExpanded: false, fileCount: 3 },
  ],
  
  files: [
    // Root files
    createFile('file-readme', 'README.md', 'repo-1', 156, 'Project documentation and setup guide', 'core'),
    createFile('file-package', 'package.json', 'repo-1', 89, 'Package configuration and dependencies', 'config'),
    
    // Src root
    createFile('file-app', 'App.tsx', 'folder-src', 234, 'Main application component with routing setup', 'core', 
      ['react', 'react-router-dom', './pages', './components/layout'], ['App'], 5, true),
    createFile('file-main', 'main.tsx', 'folder-src', 45, 'Application entry point', 'core', ['react', 'react-dom', './App'], ['default']),
    createFile('file-index-css', 'index.css', 'folder-src', 312, 'Global styles and design tokens', 'ui'),
    
    // Components root
    createFile('file-dashboard', 'Dashboard.tsx', 'folder-components', 389, 'Primary dashboard view with widget grid', 'ui',
      ['react', './charts/Chart', './ui/MetricCard', '../hooks/useData'], ['Dashboard', 'DashboardProps'], 4, true),
    createFile('file-sidebar', 'Sidebar.tsx', 'folder-components', 178, 'Navigation sidebar component', 'ui',
      ['react', './ui/NavItem', '../store/useUI'], ['Sidebar'], 3),
    createFile('file-header', 'Header.tsx', 'folder-components', 145, 'Top header with user menu', 'ui',
      ['react', '../store/useAuth', './ui/Avatar'], ['Header'], 2),
    
    // Charts folder (will be aggregated)
    createFile('file-chart-line', 'LineChart.tsx', 'folder-charts', 234, 'Line chart visualization', 'ui',
      ['react', 'recharts', '../utils/formatters'], ['LineChart'], 3),
    createFile('file-chart-bar', 'BarChart.tsx', 'folder-charts', 198, 'Bar chart visualization', 'ui',
      ['react', 'recharts'], ['BarChart'], 2),
    createFile('file-chart-pie', 'PieChart.tsx', 'folder-charts', 167, 'Pie chart visualization', 'ui',
      ['react', 'recharts'], ['PieChart'], 2),
    createFile('file-chart-area', 'AreaChart.tsx', 'folder-charts', 189, 'Area chart visualization', 'ui',
      ['react', 'recharts'], ['AreaChart'], 2),
    createFile('file-chart-scatter', 'ScatterChart.tsx', 'folder-charts', 212, 'Scatter plot visualization', 'ui',
      ['react', 'recharts'], ['ScatterChart'], 1),
    createFile('file-chart-index', 'index.ts', 'folder-charts', 45, 'Chart exports barrel', 'ui',
      [], ['LineChart', 'BarChart', 'PieChart', 'AreaChart', 'ScatterChart'], 4),
    
    // UI folder (will be aggregated - 12 files)
    createFile('file-ui-button', 'Button.tsx', 'folder-ui', 89, 'Button component with variants', 'ui'),
    createFile('file-ui-input', 'Input.tsx', 'folder-ui', 67, 'Input field component', 'ui'),
    createFile('file-ui-card', 'Card.tsx', 'folder-ui', 78, 'Card container component', 'ui'),
    createFile('file-ui-modal', 'Modal.tsx', 'folder-ui', 134, 'Modal dialog component', 'ui'),
    createFile('file-ui-table', 'Table.tsx', 'folder-ui', 256, 'Data table component', 'ui', [], [], 3, true),
    createFile('file-ui-avatar', 'Avatar.tsx', 'folder-ui', 56, 'User avatar component', 'ui'),
    createFile('file-ui-badge', 'Badge.tsx', 'folder-ui', 45, 'Badge component', 'ui'),
    createFile('file-ui-tooltip', 'Tooltip.tsx', 'folder-ui', 89, 'Tooltip component', 'ui'),
    createFile('file-ui-dropdown', 'Dropdown.tsx', 'folder-ui', 167, 'Dropdown menu component', 'ui'),
    createFile('file-ui-tabs', 'Tabs.tsx', 'folder-ui', 123, 'Tab navigation component', 'ui'),
    createFile('file-ui-navitem', 'NavItem.tsx', 'folder-ui', 78, 'Navigation item component', 'ui'),
    createFile('file-ui-metric', 'MetricCard.tsx', 'folder-ui', 112, 'Metric display card', 'ui'),
    
    // Auth folder
    createFile('file-auth-login', 'LoginForm.tsx', 'folder-auth', 189, 'Login form component', 'auth',
      ['react', 'react-hook-form', '../../store/useAuth'], ['LoginForm'], 3),
    createFile('file-auth-register', 'RegisterForm.tsx', 'folder-auth', 234, 'Registration form', 'auth',
      ['react', 'react-hook-form', '../../api/authClient'], ['RegisterForm'], 2),
    createFile('file-auth-forgot', 'ForgotPassword.tsx', 'folder-auth', 145, 'Password reset form', 'auth'),
    createFile('file-auth-guard', 'AuthGuard.tsx', 'folder-auth', 78, 'Route authentication guard', 'auth',
      ['react', '../../store/useAuth'], ['AuthGuard'], 4, true),
    
    // Layout folder
    createFile('file-layout-main', 'MainLayout.tsx', 'folder-layout', 167, 'Main app layout wrapper', 'ui',
      ['react', '../Sidebar', '../Header'], ['MainLayout'], 4),
    createFile('file-layout-auth', 'AuthLayout.tsx', 'folder-layout', 89, 'Auth pages layout', 'ui'),
    createFile('file-layout-error', 'ErrorBoundary.tsx', 'folder-layout', 112, 'Error boundary wrapper', 'ui', [], [], 2, true),
    
    // Hooks folder (8 files)
    createFile('file-hook-auth', 'useAuth.ts', 'folder-hooks', 156, 'Authentication state hook', 'auth',
      ['zustand', '../api/authClient'], ['useAuth', 'AuthState'], 5, true),
    createFile('file-hook-data', 'useData.ts', 'folder-hooks', 198, 'Data fetching with React Query', 'data',
      ['@tanstack/react-query', '../api/dataClient'], ['useData', 'useDataMutation'], 4),
    createFile('file-hook-ui', 'useUI.ts', 'folder-hooks', 89, 'UI state management', 'state',
      ['zustand'], ['useUI'], 3),
    createFile('file-hook-theme', 'useTheme.ts', 'folder-hooks', 67, 'Theme toggle hook', 'ui'),
    createFile('file-hook-toast', 'useToast.ts', 'folder-hooks', 78, 'Toast notification hook', 'ui'),
    createFile('file-hook-debounce', 'useDebounce.ts', 'folder-hooks', 34, 'Debounce utility hook', 'utils'),
    createFile('file-hook-media', 'useMediaQuery.ts', 'folder-hooks', 45, 'Media query hook', 'utils'),
    createFile('file-hook-local', 'useLocalStorage.ts', 'folder-hooks', 56, 'Local storage hook', 'utils'),
    
    // API folder (6 files)
    createFile('file-api-auth', 'authClient.ts', 'folder-api', 145, 'Authentication API client', 'auth',
      ['axios', './config'], ['authClient', 'login', 'logout', 'refreshToken'], 4),
    createFile('file-api-data', 'dataClient.ts', 'folder-api', 234, 'Data fetching API client', 'api',
      ['axios', './config'], ['dataClient', 'fetchMetrics', 'fetchChartData'], 4),
    createFile('file-api-users', 'usersClient.ts', 'folder-api', 167, 'Users API client', 'api',
      ['axios', './config'], ['usersClient', 'getUsers', 'updateUser'], 3),
    createFile('file-api-config', 'config.ts', 'folder-api', 56, 'API configuration', 'config'),
    createFile('file-api-types', 'types.ts', 'folder-api', 189, 'API type definitions', 'api'),
    createFile('file-api-interceptors', 'interceptors.ts', 'folder-api', 123, 'Request/response interceptors', 'api',
      ['axios', '../store/useAuth'], ['setupInterceptors'], 3, true),
    
    // Store folder (5 files)
    createFile('file-store-auth', 'authStore.ts', 'folder-store', 189, 'Authentication state store', 'auth',
      ['zustand', 'zustand/middleware'], ['useAuthStore'], 5, true),
    createFile('file-store-ui', 'uiStore.ts', 'folder-store', 134, 'UI state store', 'state',
      ['zustand'], ['useUIStore'], 3),
    createFile('file-store-data', 'dataStore.ts', 'folder-store', 167, 'Data cache store', 'data',
      ['zustand'], ['useDataStore'], 3),
    createFile('file-store-types', 'types.ts', 'folder-store', 78, 'Store type definitions', 'state'),
    createFile('file-store-index', 'index.ts', 'folder-store', 34, 'Store exports barrel', 'state'),
    
    // Pages folder (8 files)
    createFile('file-page-home', 'HomePage.tsx', 'folder-pages', 145, 'Home page component', 'routing',
      ['react', '../components/Dashboard'], ['HomePage'], 3),
    createFile('file-page-login', 'LoginPage.tsx', 'folder-pages', 89, 'Login page', 'routing',
      ['react', '../components/auth/LoginForm'], ['LoginPage'], 2),
    createFile('file-page-register', 'RegisterPage.tsx', 'folder-pages', 78, 'Registration page', 'routing'),
    createFile('file-page-settings', 'SettingsPage.tsx', 'folder-pages', 234, 'Settings page', 'routing', [], [], 2, true),
    createFile('file-page-profile', 'ProfilePage.tsx', 'folder-pages', 167, 'User profile page', 'routing'),
    createFile('file-page-analytics', 'AnalyticsPage.tsx', 'folder-pages', 312, 'Analytics dashboard', 'routing',
      ['react', '../components/charts'], ['AnalyticsPage'], 4, true),
    createFile('file-page-users', 'UsersPage.tsx', 'folder-pages', 189, 'User management page', 'routing'),
    createFile('file-page-404', 'NotFoundPage.tsx', 'folder-pages', 56, '404 error page', 'routing'),
    
    // Utils folder (6 files)
    createFile('file-util-format', 'formatters.ts', 'folder-utils', 145, 'Data formatting utilities', 'utils',
      ['date-fns'], ['formatDate', 'formatCurrency', 'formatNumber'], 4),
    createFile('file-util-validate', 'validators.ts', 'folder-utils', 123, 'Input validation utilities', 'utils',
      ['zod'], ['validateEmail', 'validatePassword'], 3),
    createFile('file-util-cn', 'cn.ts', 'folder-utils', 23, 'Class name utility', 'utils',
      ['clsx', 'tailwind-merge'], ['cn'], 5),
    createFile('file-util-constants', 'constants.ts', 'folder-utils', 67, 'App constants', 'config'),
    createFile('file-util-helpers', 'helpers.ts', 'folder-utils', 89, 'General helper functions', 'utils'),
    createFile('file-util-types', 'types.ts', 'folder-utils', 156, 'Shared type definitions', 'utils'),
    
    // Config folder (5 files)
    createFile('file-config-vite', 'vite.config.ts', 'folder-config', 89, 'Vite configuration', 'config'),
    createFile('file-config-tailwind', 'tailwind.config.ts', 'folder-config', 234, 'Tailwind CSS configuration', 'config'),
    createFile('file-config-ts', 'tsconfig.json', 'folder-config', 45, 'TypeScript configuration', 'config'),
    createFile('file-config-eslint', 'eslint.config.js', 'folder-config', 78, 'ESLint configuration', 'config'),
    createFile('file-config-env', '.env.example', 'folder-config', 23, 'Environment variables template', 'config'),
    
    // Tests folder (12 files - will be aggregated)
    createFile('file-test-auth', 'auth.test.ts', 'folder-tests', 234, 'Authentication tests', 'tests'),
    createFile('file-test-api', 'api.test.ts', 'folder-tests', 189, 'API client tests', 'tests'),
    createFile('file-test-hooks', 'hooks.test.ts', 'folder-tests', 167, 'Custom hooks tests', 'tests'),
    createFile('file-test-utils', 'utils.test.ts', 'folder-tests', 145, 'Utility function tests', 'tests'),
    createFile('file-test-components', 'components.test.tsx', 'folder-tests', 312, 'Component tests', 'tests'),
    createFile('file-test-pages', 'pages.test.tsx', 'folder-tests', 234, 'Page component tests', 'tests'),
    createFile('file-test-store', 'store.test.ts', 'folder-tests', 156, 'Store tests', 'tests'),
    createFile('file-test-integration', 'integration.test.ts', 'folder-tests', 289, 'Integration tests', 'tests'),
    createFile('file-test-e2e', 'e2e.test.ts', 'folder-tests', 178, 'End-to-end tests', 'tests'),
    createFile('file-test-setup', 'setup.ts', 'folder-tests', 67, 'Test setup configuration', 'tests'),
    createFile('file-test-mocks', 'mocks.ts', 'folder-tests', 145, 'Test mocks and fixtures', 'tests'),
    createFile('file-test-helpers', 'testHelpers.ts', 'folder-tests', 89, 'Test helper utilities', 'tests'),
  ],
  
  groups: [
    {
      id: 'group-ui-components',
      name: '12 UI Components',
      count: 12,
      role: 'ui',
      semanticTag: 'ui',
      parentId: 'folder-ui',
      childIds: [
        'file-ui-button', 'file-ui-input', 'file-ui-card', 'file-ui-modal',
        'file-ui-table', 'file-ui-avatar', 'file-ui-badge', 'file-ui-tooltip',
        'file-ui-dropdown', 'file-ui-tabs', 'file-ui-navitem', 'file-ui-metric'
      ],
      isExpanded: false,
    },
    {
      id: 'group-test-files',
      name: '12 Test Files',
      count: 12,
      role: 'tests',
      semanticTag: 'tests',
      parentId: 'folder-tests',
      childIds: [
        'file-test-auth', 'file-test-api', 'file-test-hooks', 'file-test-utils',
        'file-test-components', 'file-test-pages', 'file-test-store', 'file-test-integration',
        'file-test-e2e', 'file-test-setup', 'file-test-mocks', 'file-test-helpers'
      ],
      isExpanded: false,
    },
  ],
  
  edges: [
    // Repository -> Root folders
    { id: 'edge-1', source: 'repo-1', target: 'folder-src', label: 'CONTAINS' },
    { id: 'edge-2', source: 'repo-1', target: 'folder-config', label: 'CONTAINS' },
    { id: 'edge-3', source: 'repo-1', target: 'folder-tests', label: 'CONTAINS' },
    { id: 'edge-4', source: 'repo-1', target: 'file-readme', label: 'CONTAINS' },
    { id: 'edge-5', source: 'repo-1', target: 'file-package', label: 'CONTAINS' },
    
    // src -> subfolders
    { id: 'edge-10', source: 'folder-src', target: 'folder-components', label: 'CONTAINS' },
    { id: 'edge-11', source: 'folder-src', target: 'folder-hooks', label: 'CONTAINS' },
    { id: 'edge-12', source: 'folder-src', target: 'folder-api', label: 'CONTAINS' },
    { id: 'edge-13', source: 'folder-src', target: 'folder-store', label: 'CONTAINS' },
    { id: 'edge-14', source: 'folder-src', target: 'folder-pages', label: 'CONTAINS' },
    { id: 'edge-15', source: 'folder-src', target: 'folder-utils', label: 'CONTAINS' },
    { id: 'edge-16', source: 'folder-src', target: 'file-app', label: 'CONTAINS' },
    { id: 'edge-17', source: 'folder-src', target: 'file-main', label: 'CONTAINS' },
    { id: 'edge-18', source: 'folder-src', target: 'file-index-css', label: 'CONTAINS' },
    
    // components -> subfolders
    { id: 'edge-20', source: 'folder-components', target: 'folder-ui', label: 'CONTAINS' },
    { id: 'edge-21', source: 'folder-components', target: 'folder-charts', label: 'CONTAINS' },
    { id: 'edge-22', source: 'folder-components', target: 'folder-auth', label: 'CONTAINS' },
    { id: 'edge-23', source: 'folder-components', target: 'folder-layout', label: 'CONTAINS' },
    { id: 'edge-24', source: 'folder-components', target: 'file-dashboard', label: 'CONTAINS' },
    { id: 'edge-25', source: 'folder-components', target: 'file-sidebar', label: 'CONTAINS' },
    { id: 'edge-26', source: 'folder-components', target: 'file-header', label: 'CONTAINS' },
    
    // Key import relationships (weight-based)
    { id: 'edge-imp-1', source: 'file-app', target: 'file-dashboard', label: 'IMPORTS', weight: 5 },
    { id: 'edge-imp-2', source: 'file-app', target: 'file-layout-main', label: 'IMPORTS', weight: 4 },
    { id: 'edge-imp-3', source: 'file-dashboard', target: 'file-chart-line', label: 'IMPORTS', weight: 4 },
    { id: 'edge-imp-4', source: 'file-dashboard', target: 'file-hook-data', label: 'IMPORTS', weight: 4 },
    { id: 'edge-imp-5', source: 'file-layout-main', target: 'file-sidebar', label: 'IMPORTS', weight: 3 },
    { id: 'edge-imp-6', source: 'file-layout-main', target: 'file-header', label: 'IMPORTS', weight: 3 },
    { id: 'edge-imp-7', source: 'file-hook-auth', target: 'file-api-auth', label: 'IMPORTS', weight: 5 },
    { id: 'edge-imp-8', source: 'file-hook-data', target: 'file-api-data', label: 'IMPORTS', weight: 4 },
    { id: 'edge-imp-9', source: 'file-auth-login', target: 'file-store-auth', label: 'IMPORTS', weight: 4 },
    { id: 'edge-imp-10', source: 'file-auth-guard', target: 'file-hook-auth', label: 'IMPORTS', weight: 4 },
    { id: 'edge-imp-11', source: 'file-page-home', target: 'file-dashboard', label: 'IMPORTS', weight: 3 },
    { id: 'edge-imp-12', source: 'file-page-analytics', target: 'file-chart-index', label: 'IMPORTS', weight: 4 },
    { id: 'edge-imp-13', source: 'file-sidebar', target: 'file-ui-navitem', label: 'IMPORTS', weight: 2 },
    { id: 'edge-imp-14', source: 'file-header', target: 'file-ui-avatar', label: 'IMPORTS', weight: 2 },
    { id: 'edge-imp-15', source: 'file-api-interceptors', target: 'file-store-auth', label: 'IMPORTS', weight: 3 },
  ],
};

// Helper functions for graph operations
export const getFileImports = (fileId: string): string[] => {
  return mockGraphData.edges
    .filter(e => e.source === fileId && e.label === 'IMPORTS')
    .map(e => e.target);
};

export const getFileImportedBy = (fileId: string): string[] => {
  return mockGraphData.edges
    .filter(e => e.target === fileId && e.label === 'IMPORTS')
    .map(e => e.source);
};

export const getHotspotFiles = (): FileData[] => {
  return mockGraphData.files.filter(f => f.isHotspot);
};

export const getLargeFolders = (minFiles: number = 10): FolderData[] => {
  return mockGraphData.folders.filter(f => (f.fileCount || 0) >= minFiles);
};
