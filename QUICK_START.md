# Quick Start Guide - LeeChat

## 🚀 Get Started in 5 Minutes

### 1. Install & Run
```bash
cd LeeChat
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 2. Project Overview

Three-column chat UI layout:
- **Left Sidebar** (60px): Navigation icons
- **Middle Panel** (360px): Chat list with search & tabs
- **Right Panel** (flex): Chat messages

### 3. Key Technologies

| Technology | Purpose | Version |
|---|---|---|
| Next.js | React framework with SSR/SSG | 14.0.0 |
| React | UI library | 18.2.0 |
| Redux | State management | 4.2.1 |
| Emotion | CSS-in-JS styling | 11.11.1 |
| TypeScript | Type safety | 5.2.0 |
| Axios | HTTP client | 1.6.0 |

## 📂 Key Files to Know

### Components
- **ChatListPanel** - Main chat list (connects to Redux)
- **ChatWindow** - Message display area (connects to Redux)
- **MessageInput** - Send messages (pure component)
- **Sidebar** - Navigation sidebar

### Redux State
- **chat** - Conversations, selected chat, filter
- **messages** - Messages by conversation ID
- **auth** - User info, authentication
- **ui** - Theme, sidebar state, modals

### Hooks
- **useFetchChats()** - Load conversations
- **useFetchMessages()** - Load messages for selected chat
- **useSendMessage()** - Send message with error handling
- **useAppDispatch()** - Typed Redux dispatch
- **useAppSelector()** - Typed Redux selector

### Styling
- **atoms.ts** - Reusable CSS utilities
- **theme.ts** - Design tokens (colors, spacing, etc.)
- **globals.ts** - Global styles & resets

## 🎯 Common Tasks

### Add a Page
```typescript
// src/pages/new-page.tsx
export default function NewPage() {
  return <div>New Page</div>;
}
// Access at /new-page
```

### Add Redux State
```typescript
// src/store/slices/newSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'new',
  initialState: {},
  reducers: {}
});

export default slice.reducer;
```

### Add Component
```typescript
// src/components/NewComponent/Component.tsx
import { css } from '@emotion/css';
import { theme } from '@styles/theme';

const styles = css`
  color: ${theme.colors.primary[600]};
`;

export const Component = () => {
  return <div className={styles}>Content</div>;
};
```

### Add API Route
```typescript
// src/pages/api/endpoint.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: 'Hello' });
}
// Access at /api/endpoint
```

### Fetch Data
```typescript
import { useAppDispatch, useAppSelector } from '@hooks/index';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(state => state.chat.conversations);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getData();
        dispatch(setData(response.data));
      } catch (error) {
        dispatch(setError(error.message));
      }
    };
    fetchData();
  }, [dispatch]);

  return <div>{data}</div>;
};
```

## 🎨 Styling Quick Reference

### Using Atoms
```typescript
import { atoms } from '@styles/atoms';
import { css } from '@emotion/css';

const styles = css`
  ${atoms.flexCenter}        /* center content */
  ${atoms.flexBetween}       /* space between */
  ${atoms.shadow.md}         /* medium shadow */
  ${atoms.truncate}          /* truncate text */
`;
```

### Using Theme
```typescript
import { theme } from '@styles/theme';
import { css } from '@emotion/css';

const styles = css`
  color: ${theme.colors.primary[600]};
  padding: ${theme.spacing[4]};
  font-size: ${theme.fontSize.lg};
  border-radius: ${theme.borderRadius.md};
  
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[2]};
  }
`;
```

### Color Palette
```typescript
// Primary colors
theme.colors.primary[600]   // Main blue

// Gray scale
theme.colors.gray[900]      // Darkest
theme.colors.gray[500]      // Medium
theme.colors.gray[100]      // Light

// Semantic colors
theme.colors.success[600]
theme.colors.error[600]
theme.colors.warning[600]
```

## 🔄 Data Flow

### Loading a Chat
1. User clicks chat → `dispatch(setSelectedChat(chat))`
2. Redux state updates → components re-render
3. `useFetchMessages()` detects selected chat changed
4. API call to `/api/chats/:id/messages`
5. Response → `dispatch(setMessages(...))`
6. `<MessageList />` renders messages

### Sending a Message
1. User types text
2. User clicks send
3. `useSendMessage()` hook called
4. API POST to `/api/chats/:id/messages`
5. Response → `dispatch(addMessage(...))`
6. Message appears in `<MessageList />`

## 📖 Type Safety

### Working with Types
```typescript
import { IChat, IChatMessage, IUser } from '@types/index';

const chat: IChat = {
  id: '1',
  participants: [{...}],
  lastMessage: {...},
  isGroup: false,
  // ... other properties
};
```

### Creating New Types
```typescript
// src/types/index.ts
export interface INewType {
  id: string;
  name: string;
  createdAt: Date;
}
```

## ⚡ Performance Tips

1. **Memoize Components**
   ```typescript
   const Component = React.memo(({ data }) => <div>{data}</div>);
   ```

2. **Memoize Functions**
   ```typescript
   const handleClick = useCallback(() => { ... }, [dependencies]);
   ```

3. **Lazy Load Components**
   ```typescript
   const HeavyComponent = dynamic(() => import('./Heavy'));
   ```

4. **Paginate Messages**
   ```typescript
   const { messages } = useFetchMessages({ 
     conversationId, 
     limit: 50 
   });
   ```

## 🐛 Debugging

### Redux DevTools
- Install Redux DevTools browser extension
- View all state changes
- Time-travel debugging

### Console Logging
```typescript
console.log('info');
console.warn('warning');
console.error('error');
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 🚦 Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | OK | Success |
| 401 | Unauthorized | Redirect to login |
| 404 | Not Found | Show error page |
| 500 | Server Error | Show error message |

## 🔐 Environment Setup

### .env.local
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Access in Code
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## 📚 Documentation

- **README.md** - Project overview
- **ARCHITECTURE.md** - Deep dive into architecture
- **DEVELOPMENT.md** - Detailed dev guide
- **PROJECT_STRUCTURE.md** - File organization
- **QUICK_START.md** - This file!

## 🎯 Next Steps

1. **Install** → `npm install`
2. **Run Dev** → `npm run dev`
3. **Explore** → Open http://localhost:3000
4. **Build** → Check DEVELOPMENT.md for patterns
5. **Deploy** → `npm run build && npm start`

## 🔗 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Redux Docs](https://redux.js.org)
- [Emotion Docs](https://emotion.sh)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

## 💡 Pro Tips

✅ Use Redux DevTools for debugging
✅ Check type-checking before pushing: `npm run type-check`
✅ Format code: `npm run format`
✅ Keep components focused and small
✅ Use custom hooks for logic reuse
✅ Normalize Redux state structure
✅ Create reusable Emotion styles

---

**Ready to build?** → `npm run dev` 🚀
