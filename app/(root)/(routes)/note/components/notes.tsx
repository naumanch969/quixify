import { Note } from "@prisma/client";
import Image from "next/image";
import NoteCard from "./note-card";

interface Props {
  data: Note[];
}
export const Notes = ({ data }: Props) => {


  if (data.length == 0) {
    return (
      <div className="py-10 flex flex-col items-center justify-center ">
        <div className="relative h-60 w-60">
          <Image fill src="/empty.png" alt="Empty" className="grayscale " />
        </div>
        <p className="text-sm text-muted-foreground">No notes found.</p>
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 pb-10 ">
        {data.map((note, index) => (
          <NoteCard note={note} key={index} />
        ))}
      </div>
    );
  }
};
