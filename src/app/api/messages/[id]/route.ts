import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
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

  const message = await prisma.message.findUnique({
    where: { id },
  });

  if (!message) {
    return NextResponse.json(
      { error: "Message non trouvé" },
      { status: 404 }
    );
  }

  if (message.authorId !== session.user.id) {
    return NextResponse.json(
      { error: "Vous n'êtes pas autorisé à modifier ce message" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { content } = body;

    const updated = await prisma.message.update({
      where: { id },
      data: { content },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update message error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
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

  const message = await prisma.message.findUnique({
    where: { id },
  });

  if (!message) {
    return NextResponse.json(
      { error: "Message non trouvé" },
      { status: 404 }
    );
  }

  if (message.authorId !== session.user.id) {
    return NextResponse.json(
      { error: "Vous n'êtes pas autorisé à supprimer ce message" },
      { status: 403 }
    );
  }

  const deletedMessage = await prisma.message.delete({
    where: { id },
  });

  return NextResponse.json(deletedMessage);
}
