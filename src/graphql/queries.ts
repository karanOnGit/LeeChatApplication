import { gql } from 'graphql-request';

export const CHATS_QUERY = gql`
  query GetChats($filter: ChatFilter, $limit: Int, $skip: Int) {
    chats(filter: $filter, limit: $limit, skip: $skip) {
      data {
        id
        name
        avatar
        isGroup
        participants {
          id
          name
          username
          avatar
          status
        }
        lastMessage {
          id
          content
          createdAt
          sender {
            id
            name
            avatar
          }
        }
        lastMessageAt
        unreadCount
        isPinned
        isMuted
        createdAt
        updatedAt
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export const CHAT_QUERY = gql`
  query GetChat($id: ID!) {
    chat(id: $id) {
      id
      name
      avatar
      isGroup
      participants {
        id
        name
        username
        avatar
        status
        statusMessage
      }
      description
      createdAt
      updatedAt
    }
  }
`;

export const MESSAGES_QUERY = gql`
  query GetMessages($conversationId: ID!, $limit: Int, $skip: Int) {
    messages(conversationId: $conversationId, limit: $limit, skip: $skip) {
      data {
        id
        conversationId
        content
        senderId
        sender {
          id
          name
          avatar
          status
        }
        attachments {
          id
          name
          type
          url
          size
        }
        reactions {
          userId
          emoji
          createdAt
        }
        replyTo {
          id
          content
          sender {
            id
            name
          }
        }
        isEdited
        editedAt
        createdAt
        readBy
      }
      total
      page
      pageSize
      totalPages
    }
  }
`;

export const SEARCH_CHATS_QUERY = gql`
  query SearchChats($query: String!) {
    searchChats(query: $query) {
      id
      name
      avatar
      participants {
        id
        name
        avatar
      }
      lastMessage {
        id
        content
      }
    }
  }
`;

export const CURRENT_USER_QUERY = gql`
  query GetCurrentUser {
    currentUser {
      id
      name
      username
      avatar
      status
      statusMessage
      createdAt
      updatedAt
    }
  }
`;
