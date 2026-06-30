# LeeChat Architecture Guide

## Overview

LeeChat is built on a scalable, industry-standard architecture that emphasizes separation of concerns, type safety, and performance optimization.

## Layered Architecture

```
┌─────────────────────────────────────────────┐
│         Presentation Layer (UI)             │
│  Components, Layouts, Pages                 │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│     State Management Layer (Redux)          │
│  Store, Slices, Selectors, Actions          │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│      Service Layer (API Integration)        │
│  HTTP Client, API Methods, Error Handling   │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│      Backend API Layer (Next.js Routes)     │
│  Route Handlers, Database Access            │
└─────────────────────────────────────────────┘
```

## 1. Presentation Layer

### Components Structure

**Smart Components (Containers)**
- Connected to Redux
- Handle data fetching logic
- Manage component-level state
- Example: `ChatListPanel.tsx`, `ChatWindow.tsx`

**Dumb Components (Presentational)**
- Pure functional components
- Receive data via props
- No Redux dependencies
- Example: `ChatListItem.tsx`, `MessageBubble.tsx`

### Directory Structure
```
components/
├── Layout/
│   └── BaseLayout.tsx          # Main layout wrapper
├── Sidebar/
│   └── Sidebar.tsx             # Navigation sidebar
├── ChatList/
│   ├── ChatListPanel.tsx       # Smart - manages chat list state
│   └── ChatListItem.tsx        # Dumb - displays single chat
└── ChatWindow/
    ├── ChatWindow.tsx          # Smart - manages messages
    ├── ChatHeader.tsx          # Dumb - header display
    ├── MessageList.tsx         # Dumb - message container
    ├── MessageBubble.tsx       # Dumb - single message
    └── MessageInput.tsx        # Dumb - input component
```

## 2. State Management (Redux)

### Redux Architecture

**Store Structure:**
```
store/
├── index.ts                    # Store configuration
└── slices/
    ├── chatSlice.ts            # Chat conversations
    ├── messagesSlice.ts        # Messages by conversation
    ├── authSlice.ts            # User authentication
    └── uiSlice.ts              # UI state
```

### State Shape

```typescript
{
  chat: {
    conversations: IChat[],      // All conversations
    selectedChat: IChat | null,  // Currently selected chat
    filter: 'messages' | 'requests',
    loading: boolean,
    error: string | null
  },
  messages: {
    byConversationId: {          // Normalized message storage
      [conversationId]: IChatMessage[]
    },
    loading: Record<string, boolean>,
    error: Record<string, string | null>
  },
  auth: {
    user: IUser | null,
    isAuthenticated: boolean,
    token: string | null,
    loading: boolean,
    error: string | null
  },
  ui: {
    sidebarOpen: boolean,
    theme: 'light' | 'dark',
    searchQuery: string,
    chatInfoPanelOpen: boolean
  }
}
```

### Best Practices

1. **Normalize Data**: Store messages by conversationId for efficient lookups
2. **Immutable Updates**: Redux Toolkit ensures immutability
3. **Selectors**: Use `useAppSelector` for type-safe state access
4. **Actions**: Dispatch actions for all state changes
5. **Middleware**: Automatic serialization checks and API integration

## 3. Service Layer (API Integration)

### API Client Pattern

```typescript
// services/api/chatAPI.ts
class ChatAPI {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({...});
    this.api.interceptors.request.use(...);  // Auth tokens
    this.api.interceptors.response.use(...); // Error handling
  }

  async getChats(params): Promise<IAPIResponse<IChat[]>> { ... }
  async sendMessage(payload): Promise<IAPIResponse<IChatMessage>> { ... }
}

export const chatAPI = new ChatAPI();
```

### Features
- **Authentication**: Automatic token injection
- **Error Handling**: Centralized error management
- **Type Safety**: Full TypeScript support
- **Interceptors**: Request/response transformation

## 4. Custom Hooks

### Hook Categories

**Data Fetching Hooks:**
- `useFetchChats()` - Fetch conversations (SSR/CSR)
- `useFetchMessages()` - Fetch messages for conversation
- `useSendMessage()` - Send and track message

**Redux Hooks:**
- `useAppDispatch()` - Typed dispatch
- `useAppSelector()` - Typed state access

### Hook Pattern

```typescript
export const useFetchChats = ({ filter, limit, skip = false }) => {
  const dispatch = useAppDispatch();
  const { conversations, loading, error } = useAppSelector(state => state.chat);

  useEffect(() => {
    if (skip) return;
    
    const fetch = async () => {
      dispatch(setLoading(true));
      try {
        const response = await chatAPI.getChats({ filter, limit });
        dispatch(setConversations(response.data));
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetch();
  }, [dispatch, filter, limit, skip]);

  return { conversations, loading, error };
};
```

## 5. Styling System (Atomic CSS)

### Design System Layers

```
Tokens (theme.ts)
    ↓
Atoms (atoms.ts) - Reusable utilities
    ↓
Molecules - Component-level styles
    ↓
Organisms - Complex component styles
```

### Example Usage

```typescript
// Atomic approach
const componentStyles = css`
  ${atoms.flexCenter}
  ${atoms.shadow.md}
  padding: ${theme.spacing[4]};
  background-color: ${theme.colors.primary[600]};
  border-radius: ${theme.borderRadius.lg};
`;

// Theme tokens
const buttonStyles = css`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.white};
  transition: ${theme.transitions.base};

  &:hover {
    background-color: ${theme.colors.primary[700]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
```

### Design Tokens Structure

```typescript
theme = {
  colors: {...},        // Color palette
  spacing: {...},       // Layout spacing scale
  fontSize: {...},      // Typography sizes
  fontWeight: {...},    // Font weights
  borderRadius: {...},  // Border radius scale
  breakpoints: {...},   // Responsive breakpoints
  zIndex: {...},        // Stacking order
  transitions: {...}    // Animation durations
}
```

## 6. Pages & Rendering Strategies

### Server-Side Rendering (SSR)

**Use Case:** Data that changes frequently, requires authentication

```typescript
// pages/index.tsx
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Executes on EVERY request
  const data = await fetchData();
  return {
    props: { data },
    revalidate: 3600 // ISR revalidation
  };
};
```

**Characteristics:**
- Executes on every request
- Access to request context (cookies, headers)
- Slowest but most dynamic
- Perfect for: User profiles, authenticated content

### Incremental Static Regeneration (ISR)

**Use Case:** Static content that updates periodically

```typescript
// pages/chat/[id].tsx
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const data = await fetchChatData(params.id);
  return {
    props: { data },
    revalidate: 86400 // Revalidate daily
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllChatPaths();
  return {
    paths,
    fallback: 'blocking'
  };
};
```

**Characteristics:**
- Generated at build time or on-demand
- Updated after revalidation period
- Cached on CDN
- Perfect for: Chat archives, static pages

### Client-Side Rendering (CSR)

**Use Case:** Interactive, real-time content

```typescript
// In components
export const ChatWindow = () => {
  const { messages, loading } = useFetchMessages({ conversationId });
  
  return (
    <div>
      {loading ? <Spinner /> : <MessageList messages={messages} />}
    </div>
  );
};
```

**Characteristics:**
- Rendered in browser
- Dynamic updates without page reload
- Access to browser APIs
- Perfect for: Real-time messages, interactive UI

## 7. Type Safety

### Type Definitions Structure

```typescript
// types/index.ts
export interface IUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  sender: IUser;
  content: string;
  attachments?: IAttachment[];
  reactions?: IReaction[];
  isEdited: boolean;
  createdAt: Date;
  readBy: string[];
}

export interface IAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### Benefits
- **Type Safety**: Catch errors at compile time
- **IDE Support**: Better autocomplete and refactoring
- **Documentation**: Types serve as documentation
- **Refactoring**: Safe refactoring with type checking

## 8. Performance Optimization

### Techniques Applied

1. **Code Splitting**
   - Automatic per-page chunks
   - Dynamic imports for large components

2. **Image Optimization**
   - Next.js automatic image optimization
   - WebP format support
   - Responsive image delivery

3. **CSS-in-JS**
   - Emotion zero-runtime CSS
   - Eliminated unused styles
   - Critical CSS extraction

4. **Lazy Loading**
   - Dynamic component loading
   - Deferred message loading

5. **Caching Strategy**
   - ISR for static content
   - Server-side caching headers
   - Client-side Redux state

## 9. Error Handling

### API Error Strategy

```typescript
// Centralized error handling
this.api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Component Error Boundaries

```typescript
// Error boundary for graceful degradation
export const ChatWindowErrorBoundary = ({ children }) => {
  if (error) return <ErrorFallback error={error} />;
  return children;
};
```

## 10. Scalability Considerations

### Horizontal Scaling

1. **Database**: Partition conversations by userId
2. **Caching**: Redis for session and message caching
3. **API**: Load balancing across multiple instances
4. **Storage**: CDN for avatars and media

### Vertical Scaling

1. **Message Pagination**: Load messages on demand
2. **Virtual Scrolling**: For large message lists
3. **Request Batching**: Combine multiple requests
4. **Debouncing**: Reduce API calls on user input

### Future Enhancements

- WebSocket for real-time updates
- Message indexing with Elasticsearch
- Image processing pipeline
- Video transcoding service
- Push notifications system

---

**This architecture ensures the application can scale from startup to enterprise-level deployment.**
