import { type ClassValue, clsx } from "clsx";
import { Types } from "mongoose";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export const isValidObjectId = (id: string) => Types.ObjectId.isValid(id);

export function formatToUTC(date: Date | string): string {
  const d = new Date(date);
  return d.toISOString();
}

export const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const REDDISH_COLOR = "#EF5350";
const ORANGE_COLOR = "#F7944F";
const YELLOWISH_COLOR = "#FFD54F";
const LIGHT_GREEN_COLOR = "#81C784";
const LIGHT_BLUE_COLOR = "#4FC3F7";
const DISABLED_GRAY_COLOR = "#B0BEC5"; 


export const progressColors = {
  disabled: DISABLED_GRAY_COLOR,
  20: REDDISH_COLOR,
  40: ORANGE_COLOR,
  60: YELLOWISH_COLOR,
  80: LIGHT_BLUE_COLOR,
  100: LIGHT_GREEN_COLOR,
};
