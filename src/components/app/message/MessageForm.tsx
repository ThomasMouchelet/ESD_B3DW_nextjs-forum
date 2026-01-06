"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import MessageService from "@/services/message.service";
import { MessageDTO } from "@/types/message.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface MessageFormProps {
  conversationId: string;
}

export default function MessageForm({ conversationId }: MessageFormProps) {
  const { data: session, status } = useSession();
  const { register, handleSubmit, watch, reset } = useForm<MessageDTO>();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: MessageDTO) => {
      await MessageService.createMessage({
        ...data,
        conversationId,
      });
    },
    onSuccess: () => {
      reset();
      toast.success("Message envoyé !");
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    },
    onError: () => {
      toast.error("Erreur lors de l'envoi du message");
    },
  });

  const onSubmit = async (data: MessageDTO) => {
    mutation.mutate(data);
  };

  const contentWatch = watch("content");

  if (status === "loading") {
    return null;
  }

  if (!session) {
    return (
      <div className="my-5 p-4 bg-muted rounded-md text-center">
        <p className="text-muted-foreground mb-2">
          Connectez-vous pour participer à cette conversation
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

  return (
    <form className="relative my-5" onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="text"
        placeholder="Écrivez votre message..."
        className="py-6"
        {...register("content")}
      />
      <Button
        type="submit"
        className="absolute top-1/2 right-0 -translate-y-1/2 mr-2"
        disabled={
          !contentWatch || contentWatch.trim() === "" || mutation.isPending
        }
      >
        {mutation.isPending && <Spinner className="mr-2" />}
        Envoyer
      </Button>
    </form>
  );
}
