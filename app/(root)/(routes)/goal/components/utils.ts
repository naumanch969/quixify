import { PopulatedGoal } from "@/interfaces";
import { currentUser } from "@clerk/nextjs";
import { Goal, Progress } from "@prisma/client";
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInDays,
  differenceInHours,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
  format,
} from "date-fns";
import { useUser } from "@clerk/nextjs";
import { MONTHS } from "@/lib/utils";

export const getPassedDurationPercentage = (goal: Goal) => {
  let remained = 0,
    passed = 0,
    passedPercentage = 0,
    remainedPercentage = 0,
    duration = 0;
  if (goal.type == "daily") {
    duration = differenceInDays(goal.deadline, goal.start);
    if (differenceInHours(goal.deadline, addDays(goal.start, duration)) > 0) {
      duration++; // also count last remaining days as a week
    }
    remained = differenceInDays(goal.deadline, new Date());
    passed = differenceInDays(new Date(), goal.start);
  } else if (goal.type == "weekly") {
    duration = differenceInWeeks(goal.deadline, goal.start);
    if (differenceInDays(goal.deadline, addWeeks(goal.start, duration)) > 0) {
      duration++; // also count last remaining days as a week
    }
    remained = differenceInWeeks(goal.deadline, new Date());
    passed = differenceInWeeks(new Date(), goal.start);
  } else if (goal.type == "monthly") {
    duration = differenceInMonths(goal.deadline, goal.start);
    if (differenceInDays(goal.deadline, addMonths(goal.start, duration)) > 0) {
      duration++; // also count last remaining days as a month
    }
    remained = differenceInMonths(goal.deadline, new Date());
    passed = differenceInMonths(new Date(), goal.start);
  } else if (goal.type == "yearly") {
    duration = differenceInYears(goal.deadline, goal.start);
    const remainedMontDifference = differenceInMonths(
      goal.deadline,
      addYears(goal.start, duration)
    );
    if (remainedMontDifference > 0) {
      duration + remainedMontDifference / 10; // also count last remaining months/days as a year
    }
    remained = differenceInYears(goal.deadline, new Date());
    passed = differenceInYears(new Date(), goal.start);
  }
  passedPercentage = parseFloat(((passed / duration) * 100).toFixed(2));
  remainedPercentage = parseFloat(((remained / duration) * 100).toFixed(2));
  return { passedPercentage, remainedPercentage };
};

export const calculateGoalProgressStatus = (goal: PopulatedGoal) => {
  // TODO: MAY BE IN FUTURE - CONFUSION IN ASSIGNING STATUS ON PARTICULAR CRITIERIA
  const { passedPercentage } = getPassedDurationPercentage(goal);

  const goalProgress = goal?.progress?.reduce(
    (total: number, item: Progress) => {
      return total + item.percentage / 100;
    },
    0
  );
  const lag = parseFloat((passedPercentage - goalProgress).toFixed(2));

  const difference = lag - goalProgress;

  let state;

  if (lag > 25) {
    state = "critical";
  } else if (lag > 10) {
    state = "bad";
  } else if (lag > 0.1) {
    state = "good";
  } else if (lag >= 0) {
    state = "excellent";
  } else {
    state = "unknown"; // Handle any other cases as needed
  }
};

export const getMainGraphData = (
  goals: PopulatedGoal[],
  userCreatedAt: Date
): {
  variant: string;
  progress: number;
  20: number;
  40: number;
  60: number;
  80: number;
  100: number;
  today: number;
}[] => {
  let daysPassed = differenceInDays(new Date(), userCreatedAt) + 2; // for also count the first and last day

  // Use map to create an array of objects
  const resultArray = Array(daysPassed)
    .fill("")
    .map((_, index) => {
      const thisDate = addDays(userCreatedAt, index);

      let count = 0;
      const finalPercentage = goals.reduce(
        (total: number, goal: PopulatedGoal) => {
          const percentage = goal.progress.reduce(
            (acc: number, p: Progress) => {
              if (format(p.day, "PPP") === format(thisDate, "PPP")) {
                count++;
                return acc + p.percentage;
              } else {
                return acc;
              }
            },
            0
          );
          console.log(percentage);
          return total + percentage;
        },
        0
      );

      const progress = finalPercentage / count;

      return {
        variant: `${MONTHS[thisDate.getMonth()]} ${thisDate.getDate()}`,
        progress: progress,
        20: progress <= 20 ? progress : 0,
        40: progress <= 40 && progress > 20 ? progress : 0,
        60: progress <= 60 && progress > 40 ? progress : 0,
        80: progress <= 80 && progress > 60 ? progress : 0,
        100: progress > 80 ? progress : 0,
        today:
          format(new Date(), "PPP") === format(thisDate, "PPP") &&
          progress === 0
            ? 100
            : 0,
      };
    });

  // Return the array created by map
  return resultArray;
};
