# GraphQL Guide - LeeChat

LeeChat now uses GraphQL for all data operations with dummy/mock data. This guide explains the GraphQL setup and how to use it.

## 📋 Overview

- **Schema**: GraphQL schema defined in `src/graphql/schema.graphql`
- **Resolvers**: Query and Mutation resolvers in `src/graphql/resolvers.ts`
- **Dummy Data**: Mock data in `src/graphql/dummyData.ts`
- **Client**: GraphQL client using `graphql-request` library
- **Endpoint**: `/api/graphql`

## 🏗️ Architecture

```
Frontend Components
        ↓
Custom Hooks (useFetchChats, useFetchMessages)
        ↓
GraphQL Client (graphql-request)
        ↓
/api/graphql Endpoint
        ↓
GraphQL Resolvers
        ↓
Dummy Data Store (In-Memory)
```

## 📁 File Structure

```
src/graphql/
├── schema.graphql          # GraphQL type definitions
├── queries.ts              # GraphQL queries
├── mutations.ts            # GraphQL mutations
├── resolvers.ts            # Query/Mutation implementations
├── dummyData.ts            # Mock data for all users/chats/messages
└── client.ts               # GraphQL client setup

src/services/graphql/
└── chatService.ts          # GraphQL service methods

src/pages/api/
└── graphql.ts              # GraphQL API endpoint
```

## 🔍 GraphQL Schema Overview

### Types

```graphql
type User {
  id: ID!
  name: String!
  username: String!
  avatar: String!
  status: UserStatus!
  statusMessage: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Chat {
  id: ID!
  participants: [User!]!
  lastMessage: ChatMessage
  isGroup: Boolean!
  name: String
  unreadCount: Int!
  isPinned: Boolean!
  isMuted: Boolean!
}

type ChatMessage {
  id: ID!
  conversationId: ID!
  senderId: ID!
  sender: User!
  content: String!
  attachments: [Attachment!]
  replyTo: ChatMessage
  isEdited: Boolean!
  createdAt: DateTime!
  readBy: [ID!]!
}
```

### Queries

```graphql
query GetChats($filter: ChatFilter, $limit: Int, $skip: Int) {
  chats(filter: $filter, limit: $limit, skip: $skip) {
    data { ... }
    total
    page
    pageSize
    totalPages
  }
}

query GetMessages($conversationId: ID!, $limit: Int, $skip: Int) {
  messages(conversationId: $conversationId, limit: $limit, skip: $skip) {
    data { ... }
    total
    page
    pageSize
    totalPages
  }
}

query SearchChats($query: String!) {
  searchChats(query: $query) { ... }
}

query GetCurrentUser {
  currentUser { ... }
}
```

### Mutations

```graphql
mutation SendMessage($input: SendMessageInput!) {
  sendMessage(input: $input) { ... }
}

mutation EditMessage($conversationId: ID!, $messageId: ID!, $content: String!) {
  editMessage(conversationId: $conversationId, messageId: $messageId, content: $content) { ... }
}

mutation DeleteMessage($conversationId: ID!, $messageId: ID!) {
  deleteMessage(conversationId: $conversationId, messageId: $messageId)
}

mutation MarkAsRead($conversationId: ID!) {
  markAsRead(conversationId: $conversationId)
}

mutation CreateChat($participantIds: [ID!]!) {
  createChat(participantIds: $participantIds) { ... }
}
```

## 🚀 Using GraphQL in Components

### Example: Fetch Chats

```typescript
import { useFetchChats } from '@hooks/index';

export const ChatListPanel = () => {
  const { conversations, loading, error } = useFetchChats({ 
    filter: 'messages',
    limit: 50 
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {conversations.map(chat => (
        <ChatListItem key={chat.id} chat={chat} />
      ))}
    </div>
  );
};
```

### Example: Send Message

```typescript
import { useSendMessage } from '@hooks/index';

export const MessageInput = () => {
  const [content, setContent] = useState('');
  const { sendMessage } = useSendMessage();

  const handleSend = async () => {
    try {
      await sendMessage({
        conversationId: selectedChat.id,
        content
      });
      setContent('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div>
      <input value={content} onChange={e => setContent(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};
```

### Example: Direct GraphQL Query

```typescript
import { chatGraphQLService } from '@services/graphql/chatService';

const handleSearch = async (query: string) => {
  try {
    const results = await chatGraphQLService.searchChats(query);
    console.log('Search results:', results);
  } catch (error) {
    console.error('Search failed:', error);
  }
};
```

## 💾 Dummy Data Structure

### Users
Located in `src/graphql/dummyData.ts`, includes:
- 6 sample users (Pritul, Kshiteesh, Abhishek, Khushi, Divya, and Current User)
- User avatars from `i.pravatar.cc`
- Online/offline/away statuses

### Chats
- 5 conversations (1 private, 4 group)
- Last message and metadata
- Unread counts
- Pin/mute status

### Messages
- Sample messages for conversation #1 (with Pritul)
- Message history with timestamps
- Read receipts

## 🔄 How It Works

### Request Flow

1. **Frontend Component** calls custom hook
2. **Hook** dispatches Redux actions and calls service
3. **GraphQL Service** sends GraphQL query via `graphql-request`
4. **GraphQL Client** sends HTTP POST to `/api/graphql`
5. **API Route** receives query and calls GraphQL resolver
6. **Resolver** processes query against in-memory dummy data
7. **Response** returns JSON with data/errors
8. **Service** processes response and returns typed data
9. **Hook** updates Redux store with new data
10. **Component** re-renders with new data

### Data Persistence

- All mutations (send message, edit, delete) update the in-memory store
- Data persists for the duration of the server session
- On server restart, dummy data resets to initial state
- This is perfect for development/testing!

## 🎯 Key Features

### ✅ Type-Safe
- Full TypeScript support
- GraphQL schema validation
- Type-safe queries and mutations

### ✅ Scalable
- Resolver pattern for easy expansion
- Normalized data structure
- Pagination support built-in

### ✅ Developer-Friendly
- Clear separation of concerns
- Easy to mock and test
- Dummy data for instant development
- No backend server needed

### ✅ Production-Ready
- Ready for real backend swap
- Proper error handling
- Authentication ready (token injection in client)

## 🔧 Adding New Queries/Mutations

### 1. Update Schema

```graphql
# src/graphql/schema.graphql
type Query {
  myNewQuery(arg: String!): String!
}

type Mutation {
  myNewMutation(input: MyInput!): MyOutput!
}

input MyInput {
  field: String!
}

type MyOutput {
  success: Boolean!
  data: String
}
```

### 2. Add Resolver

```typescript
// src/graphql/resolvers.ts
export const resolvers = {
  Query: {
    myNewQuery: (_: any, args: { arg: string }) => {
      return `Hello ${args.arg}`;
    },
  },
  Mutation: {
    myNewMutation: (_: any, args: { input: any }) => {
      return {
        success: true,
        data: 'Created successfully'
      };
    },
  },
};
```

### 3. Create Query/Mutation

```typescript
// src/graphql/queries.ts or mutations.ts
export const MY_NEW_QUERY = gql`
  query MyNewQuery($arg: String!) {
    myNewQuery(arg: $arg)
  }
`;
```

### 4. Add Service Method

```typescript
// src/services/graphql/chatService.ts
async myNewMethod(arg: string): Promise<string> {
  const data = await graphqlClient.request<any>(MY_NEW_QUERY, {
    arg
  });
  return data.myNewQuery;
}
```

## 📊 Testing GraphQL Endpoint

### Using cURL

```bash
curl -X POST http://localhost:3000/api/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ currentUser { id name username } }"
  }'
```

### Using GraphQL Playground

Install `graphql-playground-cli` and run:
```bash
graphql-playground http://localhost:3000/api/graphql
```

## 🔐 Authentication

To add authentication:

```typescript
// In chatService or client setup
const token = localStorage.getItem('token');
if (token) {
  graphqlClient.setHeader('Authorization', `Bearer ${token}`);
}
```

## 📈 Next Steps

### When Ready for Backend

1. Replace resolvers with actual API calls
2. Replace dummy data with database queries
3. Add Apollo Server or similar
4. Deploy backend separately
5. Update `NEXT_PUBLIC_GRAPHQL_URL` to backend endpoint

### Current Endpoints

- GraphQL: `/api/graphql` (POST)
- Home: `/` (SSR)
- All messaging features work with dummy data!

## 🚨 Troubleshooting

### "Query parsing failed"
- Check GraphQL syntax in schema.graphql
- Validate queries match schema

### "Resolver not found"
- Ensure resolver is defined in resolvers.ts
- Check mutation/query name matches schema

### "No data returned"
- Verify dummy data exists in dummyData.ts
- Check resolver implementation

### "CORS errors"
- GraphQL endpoint is same-origin, no CORS needed
- Check client URL is correct in .env

---

**Ready to use GraphQL? Start with `npm run dev` and explore the chat app!** 🎉
