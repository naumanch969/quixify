import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { noteId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = auth();
    const { title, description } = body;

    if (!params.noteId)
      return new NextResponse("Note Id is required", { status: 400 });

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!title || !description)
      return new NextResponse("Mising required fields", { status: 400 });

    const updatedNote = await prismadb.note.update({
      where: { id: params.noteId, userId },
      data: {
        userId,
        title,
        description,
      },
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.log("[NOTE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { noteId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthoriuzed", { status: 401 });

    if (!params.noteId)
      return new NextResponse("Note Id is required", { status: 400 });

    const note = await prismadb.note.delete({
      where: {
        userId,
        id: params.noteId,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.log("[NOTE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
