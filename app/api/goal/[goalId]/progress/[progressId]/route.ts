import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Goal, Progress } from "@prisma/client";
import {
  Day,
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
  differenceInCalendarYears,
  differenceInDays,
  endOfDay,
  endOfWeek,
  endOfYear,
  getDate,
  getMonth,
  isAfter,
  isBefore,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";

export async function PATCH(
  req: Request,
  {
    params: { goalId, progressId },
  }: { params: { goalId: string; progressId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = auth();
    const { workDone, percentage } = body;

    if (!userId) return new NextResponse("Unauthorized.", { status: 401 });

    if (typeof workDone == "undefined" || !percentage)
      return new NextResponse("Mising required fields.", { status: 400 });

    const goal = await prismadb.goal.findFirst({ where: { id: goalId } });
    if (!goal) return new NextResponse("Goal does not exist.", { status: 400 });

    // Update progress based on progressId
    const updatedProgress = await prismadb.progress.update({
      where: { id: progressId },
      data: { workDone, percentage },
    });

    return NextResponse.json(updatedProgress);
  } catch (error) {
    console.log("[GOAL_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params: { goalId, progressId },
  }: { params: { goalId: string; progressId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthoriuzed", { status: 401 });

    if (!progressId)
      return new NextResponse("Progress Id is required", { status: 400 });

    const progress = await prismadb.progress.delete({
      where: {
        id: progressId,
        goalId,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.log("[GOAL_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

const isProgressExist = async (
  goal: Goal,
  day?: Date
): Promise<Progress | null> => {
  try {
    const currentDate = day!;
    let start, end;

    if (goal.type === "daily") {
      start = startOfDay(currentDate);
      end = endOfDay(currentDate);
    }
    // WEEK
    else if (goal.type === "weekly") {
      let startOfFirstWeek = addDays(
        startOfWeek(goal.start),
        getDate(goal.start)
      );
      let weekNumber = differenceInCalendarWeeks(currentDate, goal.start);
      if (differenceInDays(currentDate, addWeeks(goal.start, weekNumber)) > 0) {
        weekNumber++; // also count last remaining days as a week
      }
      start = addWeeks(startOfFirstWeek, weekNumber - 1);
      end = endOfDay(addWeeks(start, 1));
    }
    // MONTH
    else if (goal.type === "monthly") {
      let startOfFirstMonth = addDays(
        startOfMonth(goal.start),
        getDate(goal.start)
      );
      let monthNumber = differenceInCalendarMonths(currentDate, goal.start);
      if (
        differenceInDays(currentDate, addMonths(goal.start, monthNumber)) > 0
      ) {
        monthNumber++; // also count last remaining days as a month
      }
      start = addMonths(startOfFirstMonth, monthNumber - 1);
      end = endOfDay(addMonths(start, 1));
    }
    // YEAR
    else {
      let startOfFirstYear = addMonths(
        startOfYear(goal.start),
        getMonth(goal.start)
      );
      let yearNumber = Math.ceil(
        differenceInCalendarYears(currentDate, goal.start)
      );
      if (
        differenceInDays(currentDate, addMonths(goal.start, yearNumber)) > 0
      ) {
        yearNumber++; // also count last remaining months/days as a year
      }
      start = addYears(startOfFirstYear, yearNumber - 1);
      end = endOfDay(addYears(start, 1));
    }

    const existingProgress = await prismadb.progress.findFirst({
      where: {
        goalId: goal.id,
        day: {
          gte: start,
          lte: end,
        },
      },
    });

    return existingProgress || null;
  } catch (error) {
    console.error("[isProgressExist]", error);
    return null;
  }
};
