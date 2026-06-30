import { gql } from 'graphql-request';

export const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      conversationId
      content
      senderId
      sender {
        id
        name
        avatar
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
      createdAt
      readBy
    }
  }
`;

export const EDIT_MESSAGE_MUTATION = gql`
  mutation EditMessage($conversationId: ID!, $messageId: ID!, $content: String!) {
    editMessage(conversationId: $conversationId, messageId: $messageId, content: $content) {
      id
      content
      isEdited
      editedAt
    }
  }
`;

export const DELETE_MESSAGE_MUTATION = gql`
  mutation DeleteMessage($conversationId: ID!, $messageId: ID!) {
    deleteMessage(conversationId: $conversationId, messageId: $messageId)
  }
`;

export const MARK_AS_READ_MUTATION = gql`
  mutation MarkAsRead($conversationId: ID!) {
    markAsRead(conversationId: $conversationId)
  }
`;

export const CREATE_CHAT_MUTATION = gql`
  mutation CreateChat($participantIds: [ID!]!) {
    createChat(participantIds: $participantIds) {
      id
      name
      avatar
      isGroup
      participants {
        id
        name
        avatar
      }
      createdAt
      updatedAt
    }
  }
`;
