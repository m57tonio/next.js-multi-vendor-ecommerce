// Shared chat types — imported by the server actions AND the client UI. Kept out
// of the "use server" module so that module exports only async actions.

export type ChatSide = "CUSTOMER" | "VENDOR";

export type ConversationListItem = {
  id: string;
  /** The OTHER party's display name (vendor store for customers, customer for vendors). */
  name: string;
  avatarImage: string | null;
  avatarInitial: string;
  preview: string;
  lastAt: string; // ISO
  unread: number;
};

export type ConversationsResult = {
  side: ChatSide;
  conversations: ConversationListItem[];
};

export type ChatMessage = {
  id: string;
  mine: boolean; // sent by the caller's side
  text: string | null;
  image: string | null;
  createdAt: string; // ISO
};

export type ThreadResult = {
  conversationId: string;
  header: {
    name: string;
    avatarImage: string | null;
    avatarInitial: string;
    /** Product that started the chat, for context (or null). */
    context: string | null;
  };
  messages: ChatMessage[];
};

export type SendResult = { ok: true } | { ok: false; error: string };
