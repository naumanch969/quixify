import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { addDays } from "date-fns";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { ideaId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = auth();
    const { title, description } = body;

    if (!params.ideaId)
      return new NextResponse("Idea Id is required", { status: 400 });

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!title || !description)
      return new NextResponse("Mising required fields", { status: 400 });

    const updatedIdea = await prismadb.idea.update({
      where: { id: params.ideaId, userId },
      data: {
        userId,
        title,
        description,
      },
    });

    return NextResponse.json(updatedIdea);
  } catch (error) {
    console.log("[IDEA_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { ideaId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthoriuzed", { status: 401 });

    if (!params.ideaId)
      return new NextResponse("Idea Id is required", { status: 400 });

    const idea = await prismadb.idea.delete({
      where: {
        userId,
        id: params.ideaId,
      },
    });

    return NextResponse.json(idea);
  } catch (error) {
    console.log("[IDEA_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
