import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation non trouvée" },
      { status: 404 }
    );
  }

  return NextResponse.json(conversation);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id },
  });

  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation non trouvée" },
      { status: 404 }
    );
  }

  if (conversation.authorId !== session.user.id) {
    return NextResponse.json(
      { error: "Vous n'êtes pas autorisé à modifier cette conversation" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { title } = body;

    const updated = await prisma.conversation.update({
      where: { id },
      data: { title },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update conversation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id },
  });

  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation non trouvée" },
      { status: 404 }
    );
  }

  if (conversation.authorId !== session.user.id) {
    return NextResponse.json(
      { error: "Vous n'êtes pas autorisé à supprimer cette conversation" },
      { status: 403 }
    );
  }

  const deleted = await prisma.conversation.delete({
    where: { id },
  });

  return NextResponse.json(deleted);
}
