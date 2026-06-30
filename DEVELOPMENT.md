# Development Guide

## Quick Start

### 1. Install Dependencies
```bash
cd LeeChat
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 3. Type Checking
```bash
npm run type-check
```

### 4. Linting
```bash
npm run lint
```

### 5. Format Code
```bash
npm run format
```

## Project Structure Quick Reference

```
LeeChat/
├── src/
│   ├── components/              # React components
│   │   ├── Layout/             # Layout components
│   │   ├── Sidebar/            # Navigation
│   │   ├── ChatList/           # Chat list views
│   │   └── ChatWindow/         # Chat messaging
│   │
│   ├── pages/                  # Next.js pages (file-based routing)
│   │   ├── api/               # API routes
│   │   ├── _app.tsx           # Global app wrapper
│   │   ├── _document.tsx      # HTML template
│   │   └── index.tsx          # Home page
│   │
│   ├── store/                 # Redux state management
│   │   ├── index.ts           # Store configuration
│   │   └── slices/            # Redux slices
│   │
│   ├── services/              # Business logic
│   │   └── api/              # API client
│   │
│   ├── hooks/                # Custom React hooks
│   ├── styles/               # CSS-in-JS and theme
│   ├── types/                # TypeScript definitions
│   └── constants/            # App constants
│
├── public/                   # Static files
├── .eslintrc.json           # ESLint config
├── .prettierrc               # Prettier config
├── tsconfig.json            # TypeScript config
├── next.config.js           # Next.js config
└── package.json             # Dependencies
```

## Key Concepts

### 1. Components

#### Smart Components (Connected to Redux)
```typescript
// src/components/ChatWindow/ChatWindow.tsx
'use client';

import { useAppSelector } from '@hooks/index';
import { useFetchMessages } from '@hooks/useFetchMessages';

export const ChatWindow = () => {
  const selectedChat = useAppSelector(state => state.chat.selectedChat);
  const { messages } = useFetchMessages({ conversationId: selectedChat?.id });
  
  return <div>{/* Render messages */}</div>;
};
```

#### Dumb Components (Pure Presentational)
```typescript
// src/components/ChatWindow/MessageBubble.tsx
interface MessageBubbleProps {
  message: IChatMessage;
  isSent?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isSent }) => {
  return <div>{message.content}</div>;
};
```

### 2. Redux Usage

#### Dispatching Actions
```typescript
const dispatch = useAppDispatch();

// Set selected chat
dispatch(setSelectedChat(chat));

// Add message
dispatch(addMessage({ conversationId, message }));
```

#### Selecting State
```typescript
const selectedChat = useAppSelector(state => state.chat.selectedChat);
const conversations = useAppSelector(state => state.chat.conversations);
```

### 3. Styling with Emotion

#### Using Atoms
```typescript
import { css } from '@emotion/css';
import { atoms } from '@styles/atoms';

const styles = css`
  ${atoms.flexCenter}
  ${atoms.shadow.md}
`;
```

#### Using Theme
```typescript
import { theme } from '@styles/theme';

const styles = css`
  color: ${theme.colors.primary[600]};
  padding: ${theme.spacing[4]};
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[2]};
  }
`;
```

### 4. API Integration

#### Adding an API Method
```typescript
// services/api/chatAPI.ts
async searchChats(query: string): Promise<IAPIResponse<IChat[]>> {
  const response = await this.api.get('/chats/search', {
    params: { q: query }
  });
  return response.data;
}
```

#### Using in Component
```typescript
const handleSearch = async (query: string) => {
  try {
    const results = await chatAPI.searchChats(query);
    dispatch(setConversations(results.data));
  } catch (error) {
    dispatch(setError(error.message));
  }
};
```

### 5. Creating Custom Hooks

#### Pattern
```typescript
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './index';

export const useCustomHook = (options) => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(state => state.slice);

  useEffect(() => {
    // Effect logic
  }, [dispatch]);

  return { state, /* other returns */ };
};
```

## Common Tasks

### Adding a New Page

1. Create file: `src/pages/new-page.tsx`
```typescript
import type { GetServerSideProps } from 'next';
import Head from 'next/head';

interface Props {
  data: any;
}

export default function NewPage({ data }: Props) {
  return (
    <>
      <Head>
        <title>New Page</title>
      </Head>
      <div>{/* Content */}</div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  return { props: { data: {} } };
};
```

2. Access via `/new-page` route

### Adding a New Component

1. Create folder: `src/components/NewComponent/`
2. Create component file: `src/components/NewComponent/Component.tsx`
3. Export from component folder if needed

### Adding Redux State

1. Create slice: `src/store/slices/featureSlice.ts`
```typescript
import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'feature',
  initialState: {},
  reducers: {
    // Define reducers
  }
});

export const { } = slice.actions;
export default slice.reducer;
```

2. Add to store: `src/store/index.ts`
```typescript
export const store = configureStore({
  reducer: {
    feature: featureReducer
  }
});
```

### Adding an API Route

1. Create file: `src/pages/api/route/path.ts`
```typescript
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = IAPIResponse<any>;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  res.status(200).json({
    success: true,
    data: {}
  });
}
```

2. Access via `/api/route/path`

### Adding Styling

```typescript
import { css } from '@emotion/css';
import { theme } from '@styles/theme';

const elementStyles = css`
  /* Responsive */
  padding: ${theme.spacing[4]};
  @media (max-width: ${theme.breakpoints.md}) {
    padding: ${theme.spacing[2]};
  }

  /* Colors */
  background-color: ${theme.colors.primary[600]};
  color: ${theme.colors.white};

  /* Transitions */
  transition: ${theme.transitions.base};

  &:hover {
    background-color: ${theme.colors.primary[700]};
  }
`;
```

## TypeScript Tips

### Type Definitions
```typescript
// Create in src/types/index.ts
export interface INewType {
  id: string;
  name: string;
}

// Use everywhere
const item: INewType = { id: '1', name: 'Test' };
```

### Strict Mode
Project has `strict: true` in `tsconfig.json`, meaning:
- All variables must be typed
- null/undefined must be handled explicitly
- No implicit `any` types

## Debugging

### Redux DevTools
Install Redux DevTools extension to inspect state changes and actions

### Console Logging
```typescript
console.warn('warning');
console.error('error');
```

### Browser DevTools
- Inspect components with React DevTools extension
- Check network requests in Network tab
- View state in Redux DevTools

## Performance Tips

1. **Memoization**: Use `React.memo()` for expensive components
2. **useCallback**: Memoize functions passed as props
3. **useMemo**: Memoize expensive computations
4. **Lazy Loading**: Use dynamic imports for large components
5. **Image Optimization**: Use Next.js Image component

## Best Practices

1. ✅ Use TypeScript types everywhere
2. ✅ Keep components small and focused
3. ✅ Use Redux for global state
4. ✅ Use custom hooks for logic reuse
5. ✅ Normalize Redux state structure
6. ✅ Use semantic HTML
7. ✅ Write accessible components
8. ✅ Test component behavior
9. ✅ Document complex logic
10. ✅ Follow naming conventions

## Naming Conventions

- **Components**: PascalCase (`ChatWindow.tsx`)
- **Files**: kebab-case or PascalCase based on content
- **Functions**: camelCase (`useFetchChats`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Interfaces**: PrefixI + PascalCase (`IChat`, `IUser`)
- **CSS/Styles**: camelCase or kebab-case as suffix (`containerStyles`)

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Types Not Working
```bash
npm run type-check
```

### Cache Issues
```bash
# Clear Next.js cache
rm -rf .next

# Clean install
rm -rf node_modules && npm install
```

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Redux Docs](https://redux.js.org)
- [Emotion Docs](https://emotion.sh)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

---

Happy coding! 🚀
