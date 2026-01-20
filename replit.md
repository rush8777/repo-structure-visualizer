# replit.md

## Overview

This is a React-based GitHub Repository Graph Visualization application built with Vite. The app provides an interactive graph interface for visualizing repository structures, file dependencies, and code relationships. Users can explore repositories through different view modes (structure, dependencies, risk, prompt) with features like node expansion, search, and an inspector panel for detailed information.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server, configured to run on port 5000
- **React Router** for client-side routing with a simple two-route structure (Index and NotFound)

### UI Component Library
- **shadcn/ui** components built on Radix UI primitives for accessible, unstyled base components
- **Tailwind CSS** for utility-first styling with a custom dark theme design system
- CSS variables define semantic color tokens for nodes (repository, folder, file) and edges
- **class-variance-authority** for component variant management

### Graph Visualization
- **@xyflow/react** (React Flow) for interactive node-based graph rendering
- Custom node types: RepositoryNode, FolderNode, FileNode, GroupNode
- Custom edge component for styled connections with support for CONTAINS and IMPORTS relationships
- Graph state managed via custom `useGraphState` hook with expand/collapse, view modes, and selection

### State Management
- **TanStack React Query** for server state management (configured but data currently mocked)
- Local React state with custom hooks for graph interactions
- View modes: structure, dependencies, risk, and prompt selection

### Data Layer
- Mock data structure in `src/data/mockGraphData.ts` defines the graph schema
- Typed interfaces for Repository, Folder, File, and Group nodes
- Semantic tagging system for categorizing code elements (auth, ui, api, utils, etc.)

### Project Structure
```
src/
├── components/
│   ├── graph/       # Graph-specific components (nodes, edges, toolbar, panels)
│   └── ui/          # shadcn/ui component library
├── data/            # Mock data and type definitions
├── hooks/           # Custom React hooks (useGraphState, use-mobile, use-toast)
├── lib/             # Utility functions
├── pages/           # Route page components
└── test/            # Test setup and example tests
```

### Testing
- **Vitest** configured with jsdom environment for component testing
- Test setup includes jest-dom matchers and matchMedia mock

## External Dependencies

### UI Framework
- Radix UI primitives (dialog, dropdown, tooltip, tabs, etc.)
- Lucide React for iconography
- next-themes for theme management
- sonner for toast notifications

### Graph Library
- @xyflow/react for the interactive graph canvas and node management

### Form & Validation
- react-hook-form with @hookform/resolvers for form handling
- zod (implied through resolver setup) for schema validation

### Data Fetching
- @tanstack/react-query configured but awaiting backend integration

### Styling
- Tailwind CSS with custom configuration
- PostCSS with autoprefixer

### Build & Development
- Vite with React SWC plugin for fast compilation
- lovable-tagger for development component tagging
- ESLint with TypeScript and React plugins

### No Backend Yet
- The application currently uses mock data
- Ready for Supabase or other backend integration when needed
- No database schema defined yet