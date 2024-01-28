import prismadb from "@/lib/prismadb";
import React from "react";
import DiaryClient from "./components/client";

type Props = {
  searchParams: {
    name: string;
  };
};

const DiaryPage = async ({ searchParams }: Props) => {
  const { name } = searchParams;
  const diaries = await prismadb.diary.findMany({
    where: {
      ...(
        name
          ?
          {
            OR: [
              { description: { contains: name } },
              { main: { has: name } },
            ],
          }
          :
          {}
      )
    },
    include: { tagItems: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
  });


  return (
    <DiaryClient diaries={diaries} />
  );
};

export default DiaryPage