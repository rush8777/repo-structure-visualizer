// Types for Logic Flow visualization

export type LogicNodeType = 'function' | 'middleware' | 'utility' | 'service' | 'entry';

export interface LogicNodeData {
  id: string;
  name: string;
  type: LogicNodeType;
  description?: string;
  sourceFileId?: string;
  parameters?: string[];
  returns?: string;
}

export interface LogicEdgeData {
  id: string;
  source: string;
  target: string;
  label: string; // 'calls', 'verifies', 'returns', 'uses', etc.
  type: 'call' | 'data' | 'middleware' | 'return';
}

export interface LogicFileData {
  id: string;
  name: string;
  path: string;
  extension: string;
  logicNodeIds: string[]; // IDs of logic nodes from this file
}

export interface LogicFolderData {
  id: string;
  name: string;
  path: string;
  fileIds: string[];
  isExpanded?: boolean;
}

export interface LogicGraphData {
  query: string;
  title: string;
  folders: LogicFolderData[];
  files: LogicFileData[];
  logicNodes: LogicNodeData[];
  edges: LogicEdgeData[];
}

// Empty state for initial render
export const emptyLogicData: LogicGraphData = {
  query: '',
  title: '',
  folders: [],
  files: [],
  logicNodes: [],
  edges: [],
};

// Sample mock data for demonstration (authentication flow example)
export const sampleAuthLogicData: LogicGraphData = {
  query: 'What are the files and logic flow related to authentication?',
  title: 'Authentication Logic Flow',
  folders: [
    {
      id: 'folder-auth',
      name: 'auth',
      path: 'src/auth',
      fileIds: ['file-auth-controller', 'file-auth-service', 'file-auth-middleware'],
      isExpanded: true,
    },
    {
      id: 'folder-utils',
      name: 'utils',
      path: 'src/utils',
      fileIds: ['file-jwt-utils', 'file-hash-utils'],
      isExpanded: true,
    },
    {
      id: 'folder-services',
      name: 'services',
      path: 'src/services',
      fileIds: ['file-user-service', 'file-session-service'],
      isExpanded: false,
    },
  ],
  files: [
    {
      id: 'file-auth-controller',
      name: 'authController.ts',
      path: 'src/auth/authController.ts',
      extension: 'ts',
      logicNodeIds: ['logic-login', 'logic-logout', 'logic-register'],
    },
    {
      id: 'file-auth-service',
      name: 'authService.ts',
      path: 'src/auth/authService.ts',
      extension: 'ts',
      logicNodeIds: ['logic-validate-user', 'logic-create-session'],
    },
    {
      id: 'file-auth-middleware',
      name: 'authMiddleware.ts',
      path: 'src/auth/authMiddleware.ts',
      extension: 'ts',
      logicNodeIds: ['logic-verify-token', 'logic-check-role'],
    },
    {
      id: 'file-jwt-utils',
      name: 'jwtUtils.ts',
      path: 'src/utils/jwtUtils.ts',
      extension: 'ts',
      logicNodeIds: ['logic-sign-token', 'logic-decode-token'],
    },
    {
      id: 'file-hash-utils',
      name: 'hashUtils.ts',
      path: 'src/utils/hashUtils.ts',
      extension: 'ts',
      logicNodeIds: ['logic-hash-password', 'logic-compare-hash'],
    },
    {
      id: 'file-user-service',
      name: 'userService.ts',
      path: 'src/services/userService.ts',
      extension: 'ts',
      logicNodeIds: ['logic-find-user', 'logic-create-user'],
    },
    {
      id: 'file-session-service',
      name: 'sessionService.ts',
      path: 'src/services/sessionService.ts',
      extension: 'ts',
      logicNodeIds: ['logic-store-session', 'logic-invalidate-session'],
    },
  ],
  logicNodes: [
    // Entry points
    {
      id: 'logic-login',
      name: 'login()',
      type: 'entry',
      description: 'Main login endpoint handler',
      sourceFileId: 'file-auth-controller',
      parameters: ['email', 'password'],
      returns: 'AuthResponse',
    },
    {
      id: 'logic-logout',
      name: 'logout()',
      type: 'entry',
      description: 'Logout endpoint handler',
      sourceFileId: 'file-auth-controller',
      parameters: ['sessionId'],
      returns: 'void',
    },
    {
      id: 'logic-register',
      name: 'register()',
      type: 'entry',
      description: 'User registration endpoint',
      sourceFileId: 'file-auth-controller',
      parameters: ['email', 'password', 'name'],
      returns: 'AuthResponse',
    },
    // Middleware
    {
      id: 'logic-verify-token',
      name: 'verifyToken()',
      type: 'middleware',
      description: 'Validates JWT token from request',
      sourceFileId: 'file-auth-middleware',
      parameters: ['req', 'res', 'next'],
      returns: 'void',
    },
    {
      id: 'logic-check-role',
      name: 'checkRole()',
      type: 'middleware',
      description: 'Validates user role permissions',
      sourceFileId: 'file-auth-middleware',
      parameters: ['requiredRole'],
      returns: 'MiddlewareFunction',
    },
    // Functions
    {
      id: 'logic-validate-user',
      name: 'validateUser()',
      type: 'function',
      description: 'Validates user credentials',
      sourceFileId: 'file-auth-service',
      parameters: ['email', 'password'],
      returns: 'User | null',
    },
    {
      id: 'logic-create-session',
      name: 'createSession()',
      type: 'function',
      description: 'Creates authenticated session',
      sourceFileId: 'file-auth-service',
      parameters: ['userId'],
      returns: 'Session',
    },
    // Utilities
    {
      id: 'logic-sign-token',
      name: 'signToken()',
      type: 'utility',
      description: 'Signs JWT with payload',
      sourceFileId: 'file-jwt-utils',
      parameters: ['payload', 'secret'],
      returns: 'string',
    },
    {
      id: 'logic-decode-token',
      name: 'decodeToken()',
      type: 'utility',
      description: 'Decodes and verifies JWT',
      sourceFileId: 'file-jwt-utils',
      parameters: ['token', 'secret'],
      returns: 'TokenPayload',
    },
    {
      id: 'logic-hash-password',
      name: 'hashPassword()',
      type: 'utility',
      description: 'Hashes password with bcrypt',
      sourceFileId: 'file-hash-utils',
      parameters: ['password'],
      returns: 'string',
    },
    {
      id: 'logic-compare-hash',
      name: 'compareHash()',
      type: 'utility',
      description: 'Compares password with hash',
      sourceFileId: 'file-hash-utils',
      parameters: ['password', 'hash'],
      returns: 'boolean',
    },
    // Services
    {
      id: 'logic-find-user',
      name: 'findUserByEmail()',
      type: 'service',
      description: 'Finds user by email in database',
      sourceFileId: 'file-user-service',
      parameters: ['email'],
      returns: 'User | null',
    },
    {
      id: 'logic-create-user',
      name: 'createUser()',
      type: 'service',
      description: 'Creates new user in database',
      sourceFileId: 'file-user-service',
      parameters: ['userData'],
      returns: 'User',
    },
    {
      id: 'logic-store-session',
      name: 'storeSession()',
      type: 'service',
      description: 'Stores session in Redis',
      sourceFileId: 'file-session-service',
      parameters: ['session'],
      returns: 'void',
    },
    {
      id: 'logic-invalidate-session',
      name: 'invalidateSession()',
      type: 'service',
      description: 'Removes session from Redis',
      sourceFileId: 'file-session-service',
      parameters: ['sessionId'],
      returns: 'void',
    },
  ],
  edges: [
    // Login flow
    { id: 'edge-1', source: 'logic-login', target: 'logic-find-user', label: 'calls', type: 'call' },
    { id: 'edge-2', source: 'logic-login', target: 'logic-validate-user', label: 'calls', type: 'call' },
    { id: 'edge-3', source: 'logic-validate-user', target: 'logic-compare-hash', label: 'verifies password', type: 'call' },
    { id: 'edge-4', source: 'logic-login', target: 'logic-create-session', label: 'on success', type: 'call' },
    { id: 'edge-5', source: 'logic-create-session', target: 'logic-sign-token', label: 'generates', type: 'call' },
    { id: 'edge-6', source: 'logic-create-session', target: 'logic-store-session', label: 'stores', type: 'call' },
    { id: 'edge-7', source: 'logic-sign-token', target: 'logic-login', label: 'returns token', type: 'return' },
    
    // Register flow
    { id: 'edge-8', source: 'logic-register', target: 'logic-hash-password', label: 'hashes', type: 'call' },
    { id: 'edge-9', source: 'logic-register', target: 'logic-create-user', label: 'creates', type: 'call' },
    { id: 'edge-10', source: 'logic-register', target: 'logic-create-session', label: 'auto-login', type: 'call' },
    
    // Middleware flow
    { id: 'edge-11', source: 'logic-verify-token', target: 'logic-decode-token', label: 'decodes', type: 'middleware' },
    { id: 'edge-12', source: 'logic-check-role', target: 'logic-verify-token', label: 'after', type: 'middleware' },
    
    // Logout flow
    { id: 'edge-13', source: 'logic-logout', target: 'logic-invalidate-session', label: 'invalidates', type: 'call' },
  ],
};

// Helper to get node type color class
export const getLogicNodeTypeColor = (type: LogicNodeType): string => {
  const colors: Record<LogicNodeType, string> = {
    entry: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
    function: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    middleware: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
    utility: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
    service: 'bg-rose-500/20 text-rose-400 border-rose-500/50',
  };
  return colors[type];
};

// Helper to get edge type style
export const getLogicEdgeStyle = (type: LogicEdgeData['type']) => {
  const styles: Record<LogicEdgeData['type'], { stroke: string; strokeDasharray?: string }> = {
    call: { stroke: 'hsl(217, 91%, 60%)' },
    data: { stroke: 'hsl(160, 84%, 39%)', strokeDasharray: '5,5' },
    middleware: { stroke: 'hsl(280, 85%, 65%)' },
    return: { stroke: 'hsl(38, 92%, 50%)', strokeDasharray: '3,3' },
  };
  return styles[type];
};
