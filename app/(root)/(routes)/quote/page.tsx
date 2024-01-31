import prismadb from "@/lib/prismadb";
import React from "react";
import QuoteClient from "./components/client";

const QuotePage = async ({ searchParams }: { searchParams: { name: string } }) => {
  const { name } = searchParams;
  const quotes = await prismadb.quote.findMany({
    where: {
      ...(
        name
          ?
          {
            OR: [
              { quote: { contains: name } },
              { author: { contains: name } },
              { book: { contains: name } },
            ]
          }
          :
          {}
      )
    },
    orderBy: { createdAt: "desc" },
  });



  return (
    <QuoteClient quotes={quotes} />
  );
};

export default QuotePage