"use client";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { MountedContainer } from "./ui/mounted-container";

const font = Poppins({
  weight: "600",
  subsets: ["latin"],
});

export const Navbar = () => {

  return (
    <MountedContainer>
      <div className="fixed mx-auto w-full md:max-w-5xl lg:max-w-6xl xl:max-w-7xl z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary h-16 ">
        <div className="flex items-center">
          <MobileSidebar />
          <Link href="/">
            <h1
              className={cn(
                "hidden md:block text-xl md:text-3xl font-bold text-primary ",
                font.className
              )}
            >
              achievo
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-x-3 ">
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </MountedContainer>
  );
};
