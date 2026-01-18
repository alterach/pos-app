# POS Development Workflow

## Phase 1: Setup & Design System
1.  Initialize Project: `npm create vite@latest . -- --template react`
2.  Install deps: `npm install lucide-react`
3.  Setup CSS Architecture (`src/styles/`)

## Phase 2: Component Construction
1.  **Sidebar** (`src/components/Sidebar.jsx`)
2.  **Header** (`src/components/Header.jsx`)
3.  **Dashboard** (`src/components/Dashboard.jsx`)

## Phase 3: Integration
1.  Assemble in `App.jsx`
2.  Add routing if needed

## Collaboration Protocol
- **Gemini**: Generate code, handle logic, debug.
- **OpenCode**: View files, run commands, verify UI.
- **Reference**: Always check `app_summary.md` for design specs.
