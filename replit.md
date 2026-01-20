# replit.md

## Overview

This is a **GitHub Repository Graph Visualization** application built with React and React Flow. It provides an interactive graph-based interface to visualize repository structures, showing relationships between repositories, folders, and files. The app supports multiple view modes (structure, dependencies, risk, and prompt selection) and features like collapsible folders/groups, search, and an inspector panel.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Routing**: React Router DOM for client-side navigation
- **State Management**: React Query for server state, custom hooks for local UI state

### UI Component System

- **Design System**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (dark theme default)
- **Component Library**: Full suite of Radix-based components in `src/components/ui/`

### Graph Visualization

- **Library**: @xyflow/react (React Flow) for node-based graph rendering
- **Custom Nodes**: Repository, Folder, File, and Group node types in `src/components/graph/`
- **Custom Edges**: Styled edges for CONTAINS and IMPORTS relationships
- **Features**:
  - Collapsible folder/group nodes with expand/collapse state
  - Multiple view modes (structure, dependencies, risk, prompt)
  - Search functionality with keyboard shortcuts
  - Inspector panel for detailed node information
  - Mini-map and toolbar controls

### Data Layer

- **Mock Data**: All graph data sourced from `src/data/mockGraphData.ts`
- **Data Types**: TypeScript interfaces for Repository, Folder, File, and Group entities
- **Graph State Hook**: `useGraphState` manages view mode, expanded states, selection, and search

### Project Structure

```
src/
├── components/
│   ├── graph/          # React Flow nodes, edges, and graph UI
│   └── ui/             # shadcn/ui component library
├── data/               # Mock data for graph visualization
├── hooks/              # Custom React hooks (graph state, toast, mobile)
├── lib/                # Utility functions
├── pages/              # Route components (Index, NotFound)
└── test/               # Vitest test setup and tests
```

### Testing

- **Framework**: Vitest with jsdom environment
- **Setup**: Testing Library DOM matchers configured in `src/test/setup.ts`

## External Dependencies

### Core Libraries

- **@xyflow/react**: Graph/flowchart visualization library (primary feature)
- **@tanstack/react-query**: Async state management (prepared for API integration)
- **react-router-dom**: Client-side routing

### UI Framework

- **Radix UI**: Comprehensive set of unstyled, accessible primitives
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Utilities

- **date-fns**: Date formatting
- **cmdk**: Command palette component
- **embla-carousel-react**: Carousel functionality
- **next-themes**: Theme management
- **sonner**: Toast notifications
- **vaul**: Drawer component

### Development

- **TypeScript**: Type safety throughout
- **ESLint**: Code linting with React hooks and refresh plugins
- **Vitest**: Unit testing framework