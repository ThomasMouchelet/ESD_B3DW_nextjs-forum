import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { getRelativeTime } from "@/lib/date";
import { ConversationWithExtend } from "@/types/conversation.type";
import { User } from "lucide-react";
import Link from "next/link";

interface ConversationCardProps {
  conversation: ConversationWithExtend;
}

export default function ConversationCard({
  conversation,
}: ConversationCardProps) {
  const authorName = conversation.author?.name || conversation.author?.email || "Anonyme";

  return (
    <Link href={`/conversations/${conversation.id}`}>
      <Card className="cursor-pointer hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{authorName}</span>
          </div>
        </CardHeader>
        <CardContent className="py-2">
          <h3 className="font-medium">{conversation?.title}</h3>
        </CardContent>
        <CardFooter className="w-full flex justify-between pt-2">
          <p className="text-sm italic text-zinc-500">
            {getRelativeTime(conversation.createdAt)}
          </p>
          <p className="text-sm italic text-zinc-500">
            {conversation?.messages.length > 0
              ? `${conversation?.messages.length} réponse${conversation?.messages.length > 1 ? "s" : ""}`
              : "Aucune réponse"}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
