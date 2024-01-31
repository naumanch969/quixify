import { SearchInput } from "@/components/search-input";
import prismadb from "@/lib/prismadb";
import React from "react";
import HomeClient from "./components/client";
import { Quote } from "@prisma/client";

type Props = {
  searchParams: {
    name: string;
  };
};

const HomePage = async ({ searchParams }: Props) => {
  
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

  const notes = await prismadb.note.findMany({
    where: {
      ...(
        name
          ?
          {
            OR: [
              { title: { contains: name } },
              { description: { contains: name } },
            ]
          }
          :
          {}
      )
    },
    orderBy: { createdAt: "desc" },
  });

  const quotes = await prismadb.quote.findMany({
    where: {
      isFeatured: true,
    },
  });

  const randomIndex = Math.floor(Math.random() * quotes.length);
  let quote: Quote = quotes[randomIndex];

  return (
    <HomeClient diaries={diaries ?? []} quote={quote} goals={goals} notes={notes} />
  );
};

export default HomePage