"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import ConversationService from "@/services/conversation.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Plus, X } from "lucide-react";

interface ConversationFormData {
  title: string;
  content: string;
}

export default function ConversationForm() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, watch, reset } = useForm<ConversationFormData>();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: ConversationFormData) => {
      return await ConversationService.createConversation({
        title: data.title,
        content: data.content || undefined,
      });
    },
    onSuccess: () => {
      reset();
      setIsOpen(false);
      toast.success("Conversation créée !");
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erreur lors de la création");
    },
  });

  const onSubmit = async (data: ConversationFormData) => {
    mutation.mutate(data);
  };

  const titleWatch = watch("title");

  if (status === "loading") {
    return null;
  }

  if (!session) {
    return (
      <div className="mb-6 p-4 bg-muted rounded-md text-center">
        <p className="text-muted-foreground mb-2">
          Connectez-vous pour créer une nouvelle conversation
        </p>
        <div className="flex gap-2 justify-center">
          <Button variant="outline" size="sm" asChild>
            <Link href="/signin">Connexion</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">Inscription</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="mb-6">
        <Plus className="h-4 w-4 mr-2" />
        Nouvelle conversation
      </Button>
    );
  }

  return (
    <div className="mb-6 p-4 border rounded-md bg-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Nouvelle conversation</h3>
        <Button variant="ghost" size="icon-sm" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Titre de la conversation"
            {...register("title", { required: true })}
          />
        </div>
        <div>
          <Input
            type="text"
            placeholder="Premier message (optionnel)"
            {...register("content")}
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={!titleWatch || titleWatch.trim() === "" || mutation.isPending}
          >
            {mutation.isPending && <Spinner className="mr-2" />}
            Créer
          </Button>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}
