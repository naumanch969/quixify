import { MONTHS } from "@/lib/utils";
import { Diary } from "@prisma/client";
import { addDays, format } from "date-fns";

export const getDiaryStats = (
  diaries: Diary[],
  userCreatedAt: Date,
  splitNumber: number,
  splitLength: number,
  setSplitNumber: any
): {
  variant: string;
  productivity: number;
  20: number;
  40: number;
  60: number;
  80: number;
  100: number;
  today: number;
}[] => {
  const formattedResponse = diaries.map((diary) => ({
    variant: `${MONTHS[diary.day.getMonth()]} ${diary.day.getDate()}`,
    productivity: diary.productivity,
    20: diary.productivity <= 20 ? diary.productivity : 0,
    40:
      diary.productivity <= 40 && diary.productivity > 20
        ? diary.productivity
        : 0,
    60:
      diary.productivity <= 60 && diary.productivity > 40
        ? diary.productivity
        : 0,
    80:
      diary.productivity <= 80 && diary.productivity > 60
        ? diary.productivity
        : 0,
    100: diary.productivity > 80 ? diary.productivity : 0,
    today:
      format(diary.day, "PPP") == format(new Date(), "PPP") &&
      diary.productivity == 0
        ? 100
        : 0,
  }));

  //   Adding missing date diaries as empty diaries
  for (
    let thisDate = userCreatedAt;
    thisDate <= new Date();
    thisDate = addDays(thisDate, 1)
  ) {
    const isThisDateDiaryExist = Boolean(
      diaries.find(
        (diary) => format(diary.day, "PPP") == format(thisDate, "PPP")
      )
    );
    if (!isThisDateDiaryExist) {
      formattedResponse.push({
        variant: `${MONTHS[thisDate.getMonth()]} ${thisDate.getDate()}`,
        productivity: 0,
        20: 0,
        40: 0,
        60: 0,
        80: 0,
        100: 0,
        today: format(new Date(), "PPP") == format(thisDate, "PPP") ? 100 : 0,
      });
    }
  }

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

  const sortedResponse = formattedResponse.sort(
    (a, b) => new Date(a.variant).getTime() - new Date(b.variant).getTime()
  );

  return sortedResponse.slice(
    splitLength * splitNumber - splitLength,
    splitLength * splitNumber
  );
};
