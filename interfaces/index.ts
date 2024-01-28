import { Diary, Goal, Progress, Tag, TagItem } from "@prisma/client";

export interface PopulatedGoal extends Goal {
  progress: Progress[];
}
export interface PopulatedDiary extends Diary {
  tagItems: PopulatedTagItem[];
}

export interface PopulatedTagItem extends TagItem {
  tag: Tag;
}
