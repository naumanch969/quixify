import { PopulatedGoal } from "@/interfaces";
import { MONTHS } from "@/lib/utils";
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInCalendarMonths,
  differenceInCalendarWeeks,
  differenceInCalendarYears,
  differenceInDays,
  differenceInMonths,
  format,
  getDate,
  getMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";

export const getProgressStat = (
  goal: PopulatedGoal,
  splitNumber: number,
  splitLength: number,
  setSplitNumber: any
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
  const progress = goal.progress.map((p) => ({
    date: p.day, // stsart date of day/week/month/year
    progress: p.percentage,
  }));

  const sortedProgress = progress.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  switch (goal.type) {
    case "daily": {
      const formattedResponse = sortedProgress.map((p) => {
        return {
          variant: `${MONTHS[new Date(p.date).getMonth()]} ${new Date(
            p.date
          ).getDate()}`,
          progress: p.progress,
          20: p.progress <= 20 ? p.progress : 0,
          40: p.progress <= 40 && p.progress > 20 ? p.progress : 0,
          60: p.progress <= 60 && p.progress > 40 ? p.progress : 0,
          80: p.progress <= 80 && p.progress > 60 ? p.progress : 0,
          100: p.progress > 80 ? p.progress : 0,
          today:
            format(p.date, "PPP") == format(new Date(), "PPP") &&
            p.progress == 0
              ? 100
              : 0,
        };
      });

      if (splitNumber == 0) {
        // default splitNumber
        let indexOfTodaysProgress = formattedResponse.findIndex(
          (item) =>
            item.variant ==
            `${MONTHS[new Date().getMonth()]} ${new Date().getDate()}`
        );
        splitNumber = Math.ceil(indexOfTodaysProgress / splitLength);
        setSplitNumber(splitNumber);
      }
       return formattedResponse.slice(
        splitLength * splitNumber - splitLength,
        splitLength * splitNumber
      );
    }
    case "weekly": {
      let startOfFirstWeek = addDays(
        startOfWeek(goal.start),
        getDate(goal.start)
      );
      let weekNumber = differenceInCalendarWeeks(new Date(), goal.start);
      if (differenceInDays(new Date(), addWeeks(goal.start, weekNumber)) > 0) {
        weekNumber++; // also count last remaining days as a week
      }
      let activeWeekStart = addWeeks(startOfFirstWeek, weekNumber - 1);

      const formattedResponse = sortedProgress.map((p) => {
        let weekNumber = differenceInCalendarWeeks(p.date, goal.start);
        let thisWeekStart = addWeeks(startOfFirstWeek, weekNumber);

        return {
          variant: `${MONTHS[p.date.getMonth()]} ${p.date.getDate()}`,
          progress: p.progress,
          20: p.progress <= 20 ? p.progress : 0,
          40: p.progress <= 40 && p.progress > 20 ? p.progress : 0,
          60: p.progress <= 60 && p.progress > 40 ? p.progress : 0,
          80: p.progress <= 80 && p.progress > 60 ? p.progress : 0,
          100: p.progress > 80 ? p.progress : 0,
          today:
            format(activeWeekStart, "PPP") == format(thisWeekStart, "PPP") &&
            p.progress == 0
              ? 100
              : 0,
        };
      });
      if (splitNumber == 0) {
        // default splitNumber
        let indexOfTodaysProgress = formattedResponse.findIndex(
          (item) =>
            item.variant ==
            `${MONTHS[new Date().getMonth()]} ${new Date().getDate()}`
        );
        splitNumber = Math.ceil(indexOfTodaysProgress / splitLength);
        setSplitNumber(splitNumber);
      }
      return formattedResponse.slice(
        splitLength * splitNumber - splitLength,
        splitLength * splitNumber
      );
    }
    case "monthly": {
      let startOfFirstMonth = addDays(
        startOfMonth(goal.start),
        getDate(goal.start)
      );
      let monthNumber = differenceInCalendarMonths(new Date(), goal.start);
      if (
        differenceInDays(new Date(), addMonths(goal.start, monthNumber)) > 0
      ) {
        monthNumber++; // also count last remaining days as a month
      }
      let activeMonthStart = addMonths(startOfFirstMonth, monthNumber - 1);

      const formattedResponse = sortedProgress.map((p) => {
        let monthNumber = differenceInCalendarMonths(p.date, goal.start);
        let thisMonthStart = addMonths(startOfFirstMonth, monthNumber);

        return {
          variant: `${MONTHS[p.date.getMonth()]} ${p.date.getDate()}`,
          progress: p.progress,
          20: p.progress <= 20 ? p.progress : 0,
          40: p.progress <= 40 && p.progress > 20 ? p.progress : 0,
          60: p.progress <= 60 && p.progress > 40 ? p.progress : 0,
          80: p.progress <= 80 && p.progress > 60 ? p.progress : 0,
          100: p.progress > 80 ? p.progress : 0,
          today:
            format(activeMonthStart, "PPP") == format(thisMonthStart, "PPP") &&
            p.progress == 0
              ? 100
              : 0,
        };
      });
      if (splitNumber == 0) {
        // default splitNumber
        let indexOfTodaysProgress = formattedResponse.findIndex(
          (item) =>
            item.variant ==
            `${MONTHS[new Date().getMonth()]} ${new Date().getDate()}`
        );
        splitNumber = Math.ceil(indexOfTodaysProgress / splitLength);
        setSplitNumber(splitNumber);
      }
      return formattedResponse.slice(
        splitLength * splitNumber - splitLength,
        splitLength * splitNumber
      );
    }
    case "yearly": {
      let startOfFirstYear = addMonths(
        startOfYear(goal.start),
        getMonth(goal.start)
      );
      let yearNumber = differenceInCalendarYears(new Date(), goal.start);
      if (
        differenceInMonths(new Date(), addYears(goal.start, yearNumber)) > 0
      ) {
        yearNumber++; // also count last remaining days as a month
      }
      let activeYearStart = addYears(startOfFirstYear, yearNumber - 1); // which contains new Date()

      const formattedResponse = sortedProgress.map((p) => {
        let yearNumber = differenceInCalendarYears(p.date, goal.start);
        let thisYearStart = addYears(startOfFirstYear, yearNumber);

        return {
          variant: `${p.date.getFullYear()} ${MONTHS[p.date.getMonth()]}`,
          progress: p.progress,
          20: p.progress <= 20 ? p.progress : 0,
          40: p.progress <= 40 && p.progress > 20 ? p.progress : 0,
          60: p.progress <= 60 && p.progress > 40 ? p.progress : 0,
          80: p.progress <= 80 && p.progress > 60 ? p.progress : 0,
          100: p.progress > 80 ? p.progress : 0,
          today:
            format(activeYearStart, "PPP") == format(thisYearStart, "PPP") &&
            p.progress == 0
              ? 100
              : 0,
        };
      });
      if (splitNumber == 0) {
        // default splitNumber
        let indexOfTodaysProgress = formattedResponse.findIndex(
          (item) =>
            item.variant ==
            `${new Date().getFullYear()} ${MONTHS[new Date().getMonth()]}`
        );
        splitNumber = Math.ceil(indexOfTodaysProgress / splitLength);
        setSplitNumber(splitNumber);
      }
      return formattedResponse.slice(
        splitLength * splitNumber - splitLength,
        splitLength * splitNumber
      );
    }

    default:
      return sortedProgress
        .slice(
          splitLength * splitNumber - splitLength,
          splitLength * splitNumber
        )
        .map((p) => {
          return {
            variant: `${MONTHS[new Date(p.date).getMonth()]} ${new Date(
              p.date
            ).getDate()}`,
            progress: p.progress,
            20: p.progress <= 20 ? p.progress : 0,
            40: p.progress <= 40 && p.progress > 20 ? p.progress : 0,
            60: p.progress <= 60 && p.progress > 40 ? p.progress : 0,
            80: p.progress <= 80 && p.progress > 60 ? p.progress : 0,
            100: p.progress > 80 ? p.progress : 0,
            today:
              startOfDay(p.date) == startOfDay(new Date()) && p.progress == 0
                ? 100
                : 0,
          };
        });
  }
};
