import MessageForm from "@/components/app/message/MessageForm";
import MessageList from "@/components/app/message/MessageList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import { getRelativeTime } from "@/lib/date";

interface ConversationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ConversationDetailPage({
  params,
}: ConversationDetailPageProps) {
  const { id } = await params;

  const response = await fetch(`http://localhost:3000/api/conversations/${id}`, {
    cache: "no-store",
  });
  const conversation = await response.json();

  if (!conversation || conversation.error) {
    return (
      <div className="container mx-auto py-4">
        <Link href="/" className="flex items-center mb-4">
          <Button variant="link">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux conversations
          </Button>
        </Link>
        <p className="text-destructive">Conversation non trouvée.</p>
      </div>
    );
  }

  const authorName = conversation.author?.name || conversation.author?.email || "Anonyme";

  return (
    <div className="container mx-auto py-4">
      <div className="mb-4">
        <Link href="/">
          <Button variant="link" className="px-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux conversations
          </Button>
        </Link>
      </div>

      <div className="bg-muted p-4 rounded-md mb-4">
        <h1 className="text-xl font-bold mb-2">{conversation?.title}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{authorName}</span>
          <span>•</span>
          <span>{getRelativeTime(conversation.createdAt)}</span>
        </div>
      </div>

      <MessageForm conversationId={id} />

      <div className="mt-4">
        <h2 className="text-lg font-medium mb-4">Messages</h2>
        <MessageList conversationId={id} />
      </div>
    </div>
  );
}
