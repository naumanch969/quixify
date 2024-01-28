import { PopulatedGoal } from "@/interfaces";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { addDays } from "date-fns";
import { NextResponse } from "next/server";
import { createProgress } from "../utils";

export async function PATCH(
  req: Request,
  { params }: { params: { goalId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = auth();
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

    if (!params.goalId)
      return new NextResponse("Goal Id is required", { status: 400 });

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

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

    const findedGoal = await prismadb.goal.findFirst({
      where: { id: params.goalId },
      include: { progress: true },
    });

    if (!findedGoal) return new NextResponse("Goal not exist", { status: 400 });

    const updatedGoal = await prismadb.goal.update({
      where: { id: params.goalId, userId },
      data: {
        userId,
        goal,
        description,
        purpose,
        impact,
        start,
        deadline,
        type,
        unitTask,
        updatedAt: new Date(),
      },
    });

    // If user change the type of goal
    if (findedGoal.type != type) {
      await Promise.all(
        findedGoal.progress.map(async (p) => {
          await prismadb.progress.delete({ where: { id: p.id } });
        })
      );
      await createProgress(updatedGoal);
    }

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.log("[GOAL_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { goalId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthoriuzed", { status: 401 });

    if (!params.goalId)
      return new NextResponse("Goal Id is required", { status: 400 });

    const goal = await prismadb.goal.delete({
      where: {
        userId,
        id: params.goalId,
      },
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.log("[GOAL_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
