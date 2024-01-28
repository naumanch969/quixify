import prismadb from "@/lib/prismadb";
import React from "react";
import IdeaClient from "./components/client";

const IdeaPage = async ({ searchParams }: { searchParams: { name: string } }) => {
  const { name } = searchParams;
  const ideas = await prismadb.idea.findMany({
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



  return (
    <IdeaClient ideas={ideas} />
  );
};

export default IdeaPage