"use client";

import DeleteButton from "../common/DeleteButton";
import MessageService from "@/services/message.service";
import { MessageWithAuthor } from "@/types/message.type";
import { useSession } from "next-auth/react";
import { User } from "lucide-react";
import { getRelativeTime } from "@/lib/date";

interface MessageItemProps {
  message: MessageWithAuthor;
}

export default function MessageItem({ message }: MessageItemProps) {
  const { data: session } = useSession();
  const isOwner = session?.user?.id === message.authorId;
  const authorName = message.author?.name || message.author?.email || "Anonyme";

  return (
    <div className="border shadow-sm rounded-md p-4 relative">
      {isOwner && (
        <DeleteButton
          className="absolute top-2 right-2"
          entityName="Message"
          queryKey="messages"
          onDelete={MessageService.deleteById}
          id={message.id}
        />
      )}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <User className="h-4 w-4" />
        <span className="font-medium">{authorName}</span>
        <span>•</span>
        <span>{getRelativeTime(message.createdAt)}</span>
      </div>
      <p className="pr-8">{message.content}</p>
    </div>
  );
}
