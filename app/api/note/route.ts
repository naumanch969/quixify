import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = auth();
    const { title, description } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!title || !description)
      return new NextResponse("Mising required fields", { status: 400 });

    const createdNote = await prismadb.note.create({
      data: {
        userId,
        title,
        description,
      },
    });

    return NextResponse.json(createdNote);
  } catch (error) {
    console.log("[NOTE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
