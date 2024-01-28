import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs";
import { endOfDay, format, startOfDay } from "date-fns";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = auth();
    const { productivity, description, main, tags, day, type } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (typeof productivity == "undefined")
      return new NextResponse("Productivity is required.", { status: 400 });
    if (!main || main.length == 0)
      return new NextResponse("Main is required.", { status: 400 });
    if (!day) return new NextResponse("Day is required.", { status: 400 });

    const isDayExist = await prismadb.diary.findFirst({
      where: { day: { gte: startOfDay(day), lt: endOfDay(day) } },
    });

    if (isDayExist)
      return new NextResponse(`Diary of ${format(day, "PPP")} already exist`, {
        status: 400,
      });

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

    const createdDiary = await prismadb.diary.create({
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

    return NextResponse.json(createdDiary);
  } catch (error) {
    console.error("[DIARY_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
