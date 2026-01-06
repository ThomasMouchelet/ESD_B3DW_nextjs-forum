import { Conversation, Message } from "@/generated/prisma";

export interface Author {
  id: string;
  name: string | null;
  email: string;
}

export interface ConversationWithExtend extends Conversation {
  messages: Message[];
  author: Author | null;
}
