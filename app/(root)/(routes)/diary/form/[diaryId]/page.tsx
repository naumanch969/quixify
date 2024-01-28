import prismadb from "@/lib/prismadb";
import React from "react";
import { DiaryForm } from "./components/diary-form";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { isValidObjectId } from "@/lib/utils";


const page = async ({ params }: { params: { diaryId: string } }) => {

  const { userId } = auth();
  if (!userId) return redirectToSignIn();

  let diary = null

  if (isValidObjectId(params.diaryId)) {
    diary = await prismadb.diary.findUnique({
      where: { id: params.diaryId, userId },
    });
  }

  return <DiaryForm initialData={diary} />;
};

export default page;
