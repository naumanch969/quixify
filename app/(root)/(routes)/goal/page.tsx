import { Goals } from "./components/goals";
import { SearchInput } from "@/components/search-input";
import prismadb from "@/lib/prismadb";
import React from "react";
import { PopulatedGoal } from "@/interfaces";
import GoalGraph from "./components/goal-graph";

type Props = {
  searchParams: {
    name: string;
  };
};

const GoalPage = async ({ searchParams }: Props) => {
  const { name } = searchParams;
  const goals = await prismadb.goal.findMany({
    where: {
      ...(
        name
          ?
          {
            OR: [
              { description: { contains: name } },
              { goal: { contains: name } },
              { unitTask: { contains: name } },
              { impact: { contains: name } },
              { purpose: { contains: name } },
            ],
          }
          :
          {}
      )
    },
    include: { progress: true },
    orderBy: { createdAt: "desc" },
  });


  return (
    <div className="h-full p-4 space-y-2">
      <SearchInput />
      <GoalGraph goal={goals[0]} goals={goals} />
      <Goals data={goals as PopulatedGoal[]} />
    </div>
  );
};

export default GoalPage