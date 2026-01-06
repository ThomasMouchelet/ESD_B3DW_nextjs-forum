import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const whereClause: Record<string, unknown> = { deletedAt: null };

  const conversationId = searchParams.get("conversationId");

  if (conversationId) {
    whereClause.conversationId = conversationId;
  }

  const messages = await prisma.message.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: whereClause,
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return NextResponse.json(messages);
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { content, conversationId } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Le contenu est requis" },
        { status: 400 }
      );
    }

    if (!conversationId) {
      return NextResponse.json(
        { error: "L'ID de conversation est requis" },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content,
        conversationId,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Create message error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}
