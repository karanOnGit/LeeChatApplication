# Project Structure Overview

## Complete Directory Tree

```
LeeChat/
│
├── src/
│   │
│   ├── components/                          # React Components (Presentational & Smart)
│   │   ├── Layout/
│   │   │   └── BaseLayout.tsx              # Main layout grid wrapper
│   │   │
│   │   ├── Sidebar/
│   │   │   └── Sidebar.tsx                 # Navigation sidebar with icons
│   │   │
│   │   ├── ChatList/
│   │   │   ├── ChatListPanel.tsx           # [Smart] Main chat list container
│   │   │   └── ChatListItem.tsx            # [Dumb] Individual chat item
│   │   │
│   │   └── ChatWindow/
│   │       ├── ChatWindow.tsx              # [Smart] Main chat window
│   │       ├── ChatHeader.tsx              # [Dumb] Chat header with user info
│   │       ├── MessageList.tsx             # [Dumb] Message container
│   │       ├── MessageBubble.tsx           # [Dumb] Individual message
│   │       └── MessageInput.tsx            # [Dumb] Message input form
│   │
│   ├── pages/                               # Next.js Pages (File-based Routing)
│   │   ├── api/                            # API Routes (Backend)
│   │   │   └── chats/
│   │   │       ├── index.ts                # GET /api/chats
│   │   │       └── [id]/
│   │   │           └── messages.ts         # GET /api/chats/:id/messages
│   │   │
│   │   ├── _app.tsx                        # Global App Wrapper (Redux Provider)
│   │   ├── _document.tsx                   # HTML Document Template
│   │   └── index.tsx                       # Home Page (SSR)
│   │
│   ├── store/                               # Redux State Management
│   │   ├── index.ts                        # Store Configuration & Setup
│   │   └── slices/
│   │       ├── chatSlice.ts                # Chat conversations state
│   │       ├── messagesSlice.ts            # Messages state (normalized)
│   │       ├── authSlice.ts                # Authentication state
│   │       └── uiSlice.ts                  # UI state (theme, sidebar, etc.)
│   │
│   ├── services/                            # Business Logic & API Integration
│   │   └── api/
│   │       └── chatAPI.ts                  # Chat API Client (Axios instance)
│   │
│   ├── hooks/                               # Custom React Hooks
│   │   ├── index.ts                        # Barrel export
│   │   ├── useAppDispatch.ts               # Typed Redux dispatch hook
│   │   ├── useAppSelector.ts               # Typed Redux selector hook
│   │   ├── useFetchChats.ts                # Fetch conversations hook
│   │   ├── useFetchMessages.ts             # Fetch messages hook
│   │   └── useSendMessage.ts               # Send message hook
│   │
│   ├── styles/                              # Styling System (Emotion CSS-in-JS)
│   │   ├── atoms.ts                        # Atomic CSS utilities (reusable patterns)
│   │   ├── theme.ts                        # Design system tokens
│   │   └── globals.ts                      # Global element styles
│   │
│   ├── types/                               # TypeScript Type Definitions
│   │   └── index.ts                        # All interface & type definitions
│   │
│   └── constants/                           # Application Constants
│       └── (to be created as needed)
│
├── public/                                  # Static Assets
│   └── (favicon, images, etc.)
│
├── Config Files
│   ├── tsconfig.json                       # TypeScript configuration (strict mode)
│   ├── next.config.js                      # Next.js configuration
│   ├── .eslintrc.json                      # ESLint rules
│   └── .prettierrc                         # Code formatting rules
│
├── Documentation
│   ├── README.md                           # Project overview & quick start
│   ├── ARCHITECTURE.md                     # Detailed architecture guide
│   ├── DEVELOPMENT.md                      # Developer quick start
│   └── PROJECT_STRUCTURE.md                # This file
│
├── Environment
│   ├── .env.example                        # Environment variables template
│   └── .gitignore                          # Git ignore rules
│
└── Dependencies
    └── package.json                        # NPM dependencies & scripts
```

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                  Next.js Pages (SSR/ISR/CSR)                │
│              (index.tsx, [dynamic routes])                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Redux Store                               │
│         State: chat, messages, auth, ui                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              React Components                               │
│  Smart Components (Connected to Redux)                      │
│  ↓                                                          │
│  Dumb Components (Presentational, Pure)                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Custom Hooks                                   │
│   useFetchChats, useFetchMessages, useSendMessage           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Services (API Client)                          │
│         chatAPI (Axios with interceptors)                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Backend API Routes                             │
│       /api/chats, /api/chats/:id/messages                   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Message Sending Flow

```
User Types Message
        ↓
<MessageInput /> Component
        ↓
handleSendMessage() called
        ↓
useSendMessage Hook
        ↓
chatAPI.sendMessage() [Axios POST]
        ↓
API Route: /api/chats/:id/messages
        ↓
Response with IChatMessage
        ↓
dispatch(addMessage({...})) [Redux]
        ↓
messagesSlice state updated
        ↓
useAppSelector triggers re-render
        ↓
<MessageList /> updated
        ↓
New message appears in UI
```

### Chat List Loading Flow

```
ChatListPanel Component Mounts
        ↓
useFetchChats Hook called
        ↓
dispatch(setLoading(true))
        ↓
chatAPI.getChats() [Axios GET]
        ↓
API Route: /api/chats
        ↓
Response with IChat[]
        ↓
dispatch(setConversations(data)) [Redux]
        ↓
chatSlice state updated
        ↓
useAppSelector triggers re-render
        ↓
<ChatListItem /> rendered for each chat
        ↓
List displayed in sidebar
```

## File Responsibilities

### Components
- **BaseLayout**: Grid-based 3-column layout structure
- **Sidebar**: Navigation with icon buttons
- **ChatListPanel**: Container for chat list, manages filter state
- **ChatListItem**: Individual chat row display
- **ChatWindow**: Main chat container, message display
- **ChatHeader**: Chat info and action buttons
- **MessageList**: Message container with auto-scroll
- **MessageBubble**: Individual message display with styling
- **MessageInput**: Text input with send functionality

### Redux Slices
- **chatSlice**: conversations[], selectedChat, filter, loading, error
- **messagesSlice**: byConversationId{}, loading{}, error{}
- **authSlice**: user, token, isAuthenticated, loading
- **uiSlice**: sidebarOpen, theme, searchQuery, modalStates

### Hooks
- **useAppDispatch**: Typed dispatch wrapper
- **useAppSelector**: Typed selector with RootState
- **useFetchChats**: Handles chat list fetching logic
- **useFetchMessages**: Handles message fetching logic
- **useSendMessage**: Handles message sending logic

### Styles
- **atoms.ts**: Reusable CSS patterns (flexbox, shadows, etc.)
- **theme.ts**: Design tokens (colors, spacing, typography)
- **globals.ts**: Reset styles and base element styling

### Services
- **chatAPI**: Axios instance with interceptors for auth/errors

### Types
- **index.ts**: All interfaces (IUser, IChat, IChatMessage, etc.)

## Key Patterns Used

### 1. Smart vs Dumb Components
- Smart: Connected to Redux, handles data fetching
- Dumb: Pure presentational, receives data via props

### 2. Normalized Redux State
- Messages stored by conversationId for efficient lookups
- Prevents duplicate data in state tree

### 3. Custom Hooks for Logic
- Encapsulate data fetching logic
- Reusable across components
- Easier to test and maintain

### 4. Type-Safe Redux
- useAppDispatch for typed dispatch
- useAppSelector for typed state access
- Compile-time error checking

### 5. Atomic CSS
- Reusable utility classes
- Design system tokens
- Consistent styling across app

### 6. API Client Pattern
- Centralized Axios instance
- Request/response interceptors
- Automatic error handling

## Rendering Strategies

### SSR (Server-Side Rendering)
- Used for: Home page (index.tsx)
- Re-renders on every request
- Access to server context

### ISR (Incremental Static Regeneration)
- Used for: Static chat archives, profiles
- Build-time or on-demand generation
- Revalidated periodically

### CSR (Client-Side Rendering)
- Used for: Chat messages, interactive UI
- Real-time updates without page reload
- Browser-based rendering

## Scalability Features

### Horizontal
- API stateless (can load balance)
- Redis for caching
- CDN for static assets
- Database sharding

### Vertical
- Message pagination
- Virtual scrolling
- Request debouncing
- Code splitting

### Real-time (Future)
- WebSocket integration
- Redis pub/sub for events
- Real-time message updates
- Typing indicators

## Environment Setup

### Required Variables (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

## Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Quality Checks
```bash
npm run type-check   # TypeScript check
npm run lint         # ESLint check
npm run format       # Code formatting
```

## Performance Metrics

- **Bundle Size**: Optimized with code splitting
- **Core Web Vitals**: Optimized for LCP, FID, CLS
- **Load Time**: < 2s with ISR/caching
- **Rendering**: 60fps with memoization

---

**This structure ensures scalability, maintainability, and team productivity.**
