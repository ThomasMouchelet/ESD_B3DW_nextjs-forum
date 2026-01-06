"use client";

import ConversationService from "@/services/conversation.service";
import ConversationCard from "./ConversationCard";
import ConversationForm from "./ConversationForm";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function ConversationList() {
  const { data: conversations, isLoading, isError } = useQuery({
    queryKey: ["conversations"],
    queryFn: ConversationService.fetchConversations,
  });

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-6">Conversations</h1>

      <ConversationForm />

      {isLoading && (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {isError && (
        <p className="text-destructive">Erreur lors du chargement des conversations.</p>
      )}

      {!isLoading && !isError && conversations?.length === 0 && (
        <p className="text-muted-foreground">Aucune conversation disponible.</p>
      )}

      {!isLoading && !isError && conversations && conversations.length > 0 && (
        <div className="flex flex-col gap-4">
          {conversations.map((conversation) => (
            <ConversationCard
              key={conversation.id}
              conversation={conversation}
            />
          ))}
        </div>
      )}
    </div>
  );
}
