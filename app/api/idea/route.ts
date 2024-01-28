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

    const createdIdea = await prismadb.idea.create({
      data: {
        userId,
        title,
        description,
      },
    });

    return NextResponse.json(createdIdea);
  } catch (error) {
    console.log("[IDEA_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
