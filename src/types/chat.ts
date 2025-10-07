export interface ChatUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface ChatMessage {
  id: number;
  messageType: string;
  content: string;
  file?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  replyToId?: number;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  sender: ChatUser;
}

export interface ChatConversation {
  id: number;
  conversationType: string;
  title?: string;
  description?: string;
  isActive: boolean;
  isArchived: boolean;
  isPrivate: boolean;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
  participants: ChatUser[];
  lastMessage?: ChatMessage;
}

export interface CreateConversationDto {
  participantIds: number[];
  title?: string;
  description?: string;
  isPrivate?: boolean;
  contentType?: string;
  objectId?: string;
}

export interface SendMessageDto {
  content: string;
  replyToId?: number;
}
