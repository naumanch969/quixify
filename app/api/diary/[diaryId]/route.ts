import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params: { diaryId } }: { params: { diaryId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthoriuzed", { status: 401 });

    if (!diaryId)
      return new NextResponse("Diary Id is required", { status: 400 });

    const diary = await prismadb.diary.delete({
      where: {
        userId,
        id: diaryId,
      },
    });

    return NextResponse.json(diary);
  } catch (error) {
    console.log("[DIARY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params: { diaryId } }: { params: { diaryId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = auth();
    const { productivity, description, main, tags, day, type } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!productivity)
      return new NextResponse("Productivity is required.", { status: 400 });
    if (!main || main.length == 0)
      return new NextResponse("Main is required.", { status: 400 });
    if (!day) return new NextResponse("Day is required.", { status: 400 });

    const tagIds = await Promise.all(
      tags.map(async (text: string) => {
        let tag = await prismadb.tag.findFirst({
          where: { text: text.toLowerCase() },
        });
        if (!tag)
          tag = await prismadb.tag.create({
            data: { text: text.toLowerCase() },
          });
        return tag.id;
      })
    );

    const updatedDiary = await prismadb.diary.update({
      where: { userId, id: diaryId },
      data: {
        userId,
        productivity,
        description,
        main,
        type,
        day,
        tagItems: {
          create: tagIds.map((tagId: string) => ({
            tag: {
              connect: {
                id: tagId,
              },
            },
          })),
        },
      },
    });

    return NextResponse.json(updatedDiary);
  } catch (error) {
    console.error("[DIARY_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params: { diaryId } }: { params: { diaryId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthoriuzed", { status: 401 });

    if (!diaryId)
      return new NextResponse("Diary Id is required", { status: 400 });

    const diary = await prismadb.diary.delete({
      where: {
        userId,
        id: diaryId,
      },
    });

    return NextResponse.json(diary);
  } catch (error) {
    console.log("[DIARY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
