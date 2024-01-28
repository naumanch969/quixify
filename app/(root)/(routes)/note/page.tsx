import prismadb from "@/lib/prismadb";
import React from "react";
import NoteClient from "./components/client";

const NotePage = async ({ searchParams }: { searchParams: { name: string } }) => {
  const { name } = searchParams;
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



  return (
    <NoteClient notes={notes} />
  );
};

export default NotePage