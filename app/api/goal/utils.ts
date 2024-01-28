import prismadb from "@/lib/prismadb";
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

export const createProgress = async (goal: Goal) => {
  try {
    switch (goal.type) {
      case "daily": {
        let numberOfDays = differenceInCalendarDays(goal.deadline, goal.start);
        if (
          differenceInHours(goal.deadline, addDays(goal.start, numberOfDays)) >
          0
        ) {
          numberOfDays++; // also count last remaining days as a week
        }

        // TODO: CONVERT IT INTO PROMISE.ALL
        for (let i = 0; i < numberOfDays; i++) {
          let thisDate = addDays(goal.start, i);
          await prismadb.progress.create({
            data: {
              goalId: goal.id,
              workDone: "",
              percentage: 0,
              day: thisDate,
            },
          });
        }
        break;
      }
       case "weekly": {
        let numberOfWeeks = differenceInCalendarWeeks(
          goal.deadline,
          goal.start
        );
        if (
          differenceInDays(goal.deadline, addWeeks(goal.start, numberOfWeeks)) >
          0
        ) {
          numberOfWeeks++; // also count last remaining days as a week
        }

        for (let i = 0; i < numberOfWeeks; i++) {
          let thisDate = addWeeks(goal.start, i);
          await prismadb.progress.create({
            data: {
              goalId: goal.id,
              workDone: "",
              percentage: 0,
              day: thisDate,
            },
          });
        }

        break;
      }
      case "monthly": {
        let numberOfMonths = differenceInCalendarMonths(
          goal.deadline,
          goal.start
        );
        if (
          differenceInDays(
            goal.deadline,
            addMonths(goal.start, numberOfMonths)
          ) > 0
        ) {
          numberOfMonths++; // also count last remaining days as a month
        }

        for (let i = 0; i < numberOfMonths; i++) {
          let thisDate = addMonths(goal.start, i);

          await prismadb.progress.create({
            data: {
              goalId: goal.id,
              workDone: "",
              percentage: 0,
              day: thisDate,
            },
          });
        }

        break;
      }
      case "yearly": {
        let numberOfYears = differenceInYears(goal.deadline, goal.start);
        if (
          differenceInDays(goal.deadline, addYears(goal.start, numberOfYears)) >
          0
        ) {
          numberOfYears++; // also count last remaining months/days as a year
        }

        for (let i = 0; i < numberOfYears; i++) {
          let thisDate = addYears(goal.start, i);
          await prismadb.progress.create({
            data: {
              goalId: goal.id,
              workDone: "",
              percentage: 0,
              day: thisDate,
            },
          });
        }

        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
};
