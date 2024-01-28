import { Diaries } from "@/app/(root)/(routes)/diary/components/diaries";
import { SearchInput } from "@/components/search-input";
import prismadb from "@/lib/prismadb";
import React from "react";
import { DiaryGraph } from "@/app/(root)/(routes)/diary/components/diary-graph";

type Props = {
  searchParams: {
    name: string;
  };
};

const HomePage = async ({ searchParams }: Props) => {
  const { name } = searchParams;
  const diaries = await prismadb.diary.findMany({
    where: {
      OR: [
        { description: name },
        { main: { has: name ? name : '' } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });


  return (
    <div className="h-full p-4 space-y-2">
      <SearchInput />
      <DiaryGraph data={[]} />
      <Diaries data={diaries} />
    </div>
  );
};

export default HomePage