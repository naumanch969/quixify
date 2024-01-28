"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import { MountedContainer } from "./ui/mounted-container";

export const UserAvatar = () => {
  const { user } = useUser();

  return (
    <MountedContainer>
      <Avatar className="w-12 h-12">
        <AvatarImage src={user?.imageUrl} />
      </Avatar>
    </MountedContainer>
  );
};
