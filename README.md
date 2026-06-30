# LeeChat - Scalable Chat Application

A production-ready, scalable chat application built with Next.js, Redux, and CSS-in-JS (Emotion). Implements industry-standard architecture patterns including SSR, ISR, and CSR for optimal performance.

## 🎯 Features

- **Real-time Messaging**: Instant message delivery with read receipts
- **Scalable Architecture**: Designed to handle high-traffic scenarios
- **State Management**: Redux with Redux Toolkit for predictable state management
- **Atomic CSS**: Emotion CSS-in-JS for scalable styling patterns
- **Type-Safe**: Full TypeScript support with strict mode enabled
- **Multi-rendering Strategies**: SSR, ISR, CSR optimized for different use cases
- **Responsive Design**: Mobile-first responsive layout
- **RESTful API**: Clean API design with proper error handling
- **Performance Optimized**: Image optimization, code splitting, and lazy loading

## 🏗️ Project Structure

```
src/
├── components/           # Reusable React components
│   ├── Layout/          # Layout wrapper components
│   ├── Sidebar/         # Navigation sidebar
│   ├── ChatList/        # Chat list panel components
│   └── ChatWindow/      # Chat messaging components
├── pages/               # Next.js pages (SSR/SSG)
│   ├── api/            # API routes
│   ├── _app.tsx        # Global app setup
│   ├── _document.tsx   # HTML document template
│   └── index.tsx       # Home page
├── store/              # Redux store configuration
│   ├── index.ts        # Store setup
│   └── slices/         # Redux slices for state management
├── services/           # External service integrations
│   └── api/           # API client services
├── hooks/              # Custom React hooks
├── styles/             # Global and theme styles
│   ├── atoms.ts       # Atomic CSS utilities
│   ├── theme.ts       # Design system tokens
│   └── globals.ts     # Global styles
├── types/              # TypeScript type definitions
├── constants/          # Application constants
└── utils/              # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager

### Installation

```bash
cd LeeChat
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 📦 Tech Stack

### Frontend
- **Next.js 14**: React framework with SSR/SSG/ISR support
- **React 18**: UI library
- **TypeScript**: Type safety and developer experience
- **Redux**: State management
- **Emotion**: CSS-in-JS styling solution

### Styling
- **Atomic CSS**: Granular, scalable styling approach
- **Design Tokens**: Consistent theme configuration
- **Responsive**: Mobile-first design patterns

### Tooling
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Type-checking**: TypeScript strict mode

## 🏛️ Architecture Patterns

### Rendering Strategies

#### 1. **Server-Side Rendering (SSR)**
Used for dynamic content that requires authentication or personalization.
```typescript
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Fetch data on every request
  return { props: { data }, revalidate: 3600 };
};
```

#### 2. **Incremental Static Regeneration (ISR)**
Used for static pages that update periodically.
```typescript
export const getStaticProps: GetStaticProps = async () => {
  return { props: { data }, revalidate: 86400 };
};
```

#### 3. **Client-Side Rendering (CSR)**
Used for interactive components with dynamic state.
```typescript
export default function Component() {
  const { data } = useFetch('/api/endpoint');
  return <div>{data}</div>;
}
```

### State Management

Redux manages global application state with the following slices:

- **chatSlice**: Conversations and chat metadata
- **messagesSlice**: Messages organized by conversation
- **authSlice**: User authentication and profile
- **uiSlice**: UI state (sidebar, theme, modals)

### Styling System

#### Atomic CSS Approach
- **atoms.ts**: Reusable CSS utilities (flexbox, shadows, etc.)
- **theme.ts**: Design system tokens (colors, spacing, typography)
- **globals.ts**: Base element styles and resets

Benefits:
- Scalable styling without class name conflicts
- Consistent design language
- Easy theme switching
- Type-safe CSS-in-JS

## 🔌 API Routes

### Chats
- `GET /api/chats` - List conversations
- `GET /api/chats/:id` - Get conversation details
- `GET /api/chats/:id/messages` - Get messages

### Messages
- `POST /api/chats/:id/messages` - Send message
- `PATCH /api/chats/:id/messages/:msgId` - Edit message
- `DELETE /api/chats/:id/messages/:msgId` - Delete message

## 🎨 Styling Guide

### Using Atomic CSS

```typescript
import { css } from '@emotion/css';
import { atoms } from '@styles/atoms';
import { theme } from '@styles/theme';

const componentStyles = css`
  ${atoms.flexCenter}
  padding: ${theme.spacing[4]};
  background-color: ${theme.colors.primary[600]};
`;
```

### Color Palette

```typescript
theme.colors = {
  primary: { 50: '#f0f4ff', ..., 900: '#312e81' },
  gray: { 50: '#f9fafb', ..., 900: '#111827' },
  success: { 500: '#10b981', ... },
  error: { 500: '#ef4444', ... },
}
```

### Spacing Scale

```typescript
theme.spacing = {
  0: '0', 1: '0.25rem', 2: '0.5rem', 3: '0.75rem', 4: '1rem',
  6: '1.5rem', 8: '2rem', 12: '3rem', 16: '4rem', ...
}
```

## 🔒 Type Safety

Full TypeScript support ensures type safety across the application:

```typescript
// services/api/chatAPI.ts
async getChats(params: {
  filter?: 'messages' | 'requests';
  limit?: number;
}): Promise<IAPIResponse<IChat[]>>

// types/index.ts
interface IChat {
  id: string;
  participants: IUser[];
  lastMessage?: IChatMessage;
  // ...
}
```

## 📱 Responsive Design

Breakpoints are defined in the theme:

```typescript
theme.breakpoints = {
  xs: '320px',   // Mobile
  sm: '640px',   // Small tablet
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
}
```

## 🚦 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 📊 Performance Optimizations

1. **Image Optimization**: Next.js automatic image optimization
2. **Code Splitting**: Automatic per-page code splitting
3. **CSS-in-JS**: Emotion's zero-runtime CSS solution
4. **Tree Shaking**: Unused code elimination
5. **Caching**: Proper cache headers and ISR strategy
6. **Lazy Loading**: Dynamic imports for large components

## 🧪 Testing

```bash
npm run type-check
npm run lint
```

## 📝 Code Formatting

```bash
npm run format
```

## 🔄 Git Workflow

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes with atomic commits
3. Format code: `npm run format`
4. Type check: `npm run type-check`
5. Push and create PR

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Documentation](https://redux.js.org/)
- [Emotion Documentation](https://emotion.sh/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 License

MIT License - see LICENSE file for details

## 👥 Contributors

Built with modern web development best practices and scalable architecture patterns.

---

**Built with ❤️ using Next.js, Redux, and Emotion**
