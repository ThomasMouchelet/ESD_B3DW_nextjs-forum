import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const conversations = await prisma.conversation.findMany({
    include: {
      messages: {
        select: { id: true },
      },
      author: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    where: {
      deletedAt: null,
    },
  });

  return NextResponse.json(conversations);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Le titre est requis" },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.create({
      data: {
        title,
        authorId: session.user.id,
        messages: content
          ? {
              create: {
                content,
                authorId: session.user.id,
              },
            }
          : undefined,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        messages: true,
      },
    });

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error("Create conversation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création" },
      { status: 500 }
    );
  }
}
