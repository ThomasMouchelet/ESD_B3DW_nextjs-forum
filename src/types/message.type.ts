import { Message } from "@/generated/prisma";
import { Author } from "./conversation.type";

export interface MessageDTO {
  content: string;
  conversationId: string;
}

export interface MessageWithAuthor extends Message {
  author: Author | null;
}
