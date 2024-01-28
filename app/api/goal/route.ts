import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import { Goal } from "@prisma/client";
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
  differenceInDays,
  differenceInHours,
  differenceInYears,
} from "date-fns";
import { NextResponse } from "next/server";
import { createProgress } from "./utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const {
      goal,
      description,
      purpose,
      impact,
      start,
      deadline,
      type,
      unitTask,
    } = body;

    if (!user || !user.id || !user.firstName)
      return new NextResponse("Unauthorized", { status: 401 });

    if (
      !goal ||
      !description ||
      !purpose ||
      !impact ||
      !start ||
      !deadline ||
      !type ||
      !unitTask
    )
      return new NextResponse("Mising required fields", { status: 400 });

    const createdGoal = await prismadb.goal.create({
      data: {
        userId: user.id,
        goal,
        description,
        purpose,
        impact,
        start,
        deadline,
        type,
        unitTask,
        createdAt: new Date(),
      },
    });

    await createProgress(createdGoal);

    return NextResponse.json(createdGoal);
  } catch (error) {
    console.log("[GOAL_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
 
// TODO: if type is monthly, then also add options for adding daily progress or weekly progress etc.