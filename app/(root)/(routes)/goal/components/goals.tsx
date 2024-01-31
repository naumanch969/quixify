import { Goal } from "@prisma/client";
import Image from "next/image";
import GoalCard from "./goal-card";
import { PopulatedGoal } from "@/interfaces";

interface Props {
  data: PopulatedGoal[];
}
export const Goals = ({ data }: Props) => {


  if (data.length == 0) {
    return (
      <div className="py-10 flex flex-col items-center justify-center ">
        <div className="relative h-60 w-60">
          <Image fill src="/empty.png" alt="Empty" className="grayscale " />
        </div>
        <p className="text-sm text-muted-foreground">No goals found.</p>
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-2 pb-10 ">
        {data.map((goal, index) => (
          <GoalCard goal={goal} key={index} />
        ))}
      </div>
    );
  }
};
