import { Quote } from "@prisma/client";
import Image from "next/image";
import QuoteCard from "./quote-card";

interface Props {
  //   data: Quote & { _count: { messages: number } }[];
  data: Quote[];
}
export const Quotes = ({ data }: Props) => {


  if (data.length == 0) {
    return (
      <div className="py-10 flex flex-col items-center justify-center ">
        <div className="relative h-60 w-60">
          <Image fill src="/empty.png" alt="Empty" className="grayscale " />
        </div>
        <p className="text-sm text-muted-foreground">No quotes found.</p>
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 pb-10 ">
        {data.map((quote, index) => (
          <QuoteCard quote={quote} key={index} />
        ))}
      </div>
    );
  }
};
