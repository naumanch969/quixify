"use client";
import { cn } from "@/lib/utils";
import { Goal, Home, Plus, StickyNote, Indent, StickyNoteIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { MountedContainer } from "./ui/mounted-container";

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const onNavigate = (url: string, pro: boolean) => {
    return router.push(url);
  };
  const routes = [
    {
      icon: Home,
      href: "/",
      label: "Home",
      pro: false,
    },
    {
      icon: Goal,
      href: "/goal",
      label: "Goals",
      pro: false,
    },
    {
      icon: StickyNote,
      href: "/diary",
      label: "Diary",
      pro: false,
    },
    {
      icon: Indent,
      href: "/idea",
      label: "Ideas",
      pro: false,
    },
    {
      icon: StickyNoteIcon,
      href: "/note",
      label: "Notes",
      pro: false,
    },
    {
      icon: Plus,
      href: "/goal/form/new",
      label: "Create",
      pro: true,
    },
    {
      icon: Plus,
      href: "/diary/form/new",
      label: "Create",
      pro: true,
    },
  ];
  // for 90% progress, give .90 points,  and create a bar chart of points with time which should be straight line
  return (
    <MountedContainer>
      <div className="space-y-4 flex flex-col h-full text-primary bg-secondary ">
        <div className="p-3 flex flex-1 justify-center">
          <div className="space-y-2">
            {routes.map((route, index) => (
              <div
                key={index}
                onClick={() => onNavigate(route.href, route.pro)}
                className={cn(
                  "text-muted-foreground text-xs group flex p-3 aspect-square w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                  pathname == route.href && "bg-primary/10 text-primary "
                )}
              >
                <div className="flex flex-col gap-y-2 items-center flex-1">
                  <route.icon className="w-5 h-5" />
                  {route.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MountedContainer>
  );
};
