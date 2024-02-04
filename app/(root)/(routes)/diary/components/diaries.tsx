"use client"

import { Diary } from "@prisma/client";
import Image from "next/image";
import DiaryCard from "./diary-card";
 
interface Props {
    data: Diary[];
}
export const Diaries = ({ data }: Props) => {

 
    if (data.length == 0) {
        return (
            <div className="py-10 flex flex-col items-center justify-center ">
                <div className="relative h-60 w-60">
                    <Image fill src="/empty.png" alt="Empty" className="grayscale " />
                </div>
                <p className="text-sm text-muted-foreground">No diaries found.</p>
            </div>
        );
    } else {
        return (
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 pb-10 `}>
                {data.map((diary, index) => (
                    <DiaryCard diary={diary} key={index} />
                ))}
            </div>
        );
    }
};
