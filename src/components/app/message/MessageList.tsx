"use client";

import MessageService from "@/services/message.service";
import MessageItem from "./MessageItem";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageWithAuthor } from "@/types/message.type";

interface MessageListProps {
  conversationId?: string;
}

export default function MessageList({ conversationId }: MessageListProps) {
  const { data, isLoading, isError } = useQuery<MessageWithAuthor[]>({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      return await MessageService.fetchMessages({ conversationId });
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-destructive">Erreur lors du chargement des messages.</p>;
  }

  if (!data || data.length === 0) {
    return <p className="text-muted-foreground">Aucun message pour l&apos;instant.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {data.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
}
