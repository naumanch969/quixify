import prismadb from "@/lib/prismadb";
import React from "react";
import { GoalForm } from "./components/goal-form";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { isValidObjectId } from "@/lib/utils";


const page = async ({ params }: { params: { goalId: string } }) => {

  const { userId } = auth();
  if (!userId) return redirectToSignIn();

  let goal = null

  if (isValidObjectId(params.goalId)) {
    goal = await prismadb.goal.findUnique({
      where: { id: params.goalId, userId },
    });
  }

  return <GoalForm initialData={goal} />;
};

export default page;
