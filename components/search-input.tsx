"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEventHandler, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import qs from "query-string";
import { MountedContainer } from "./ui/mounted-container";
import { Button } from "./ui/button";
import { useNoteModal } from "@/hooks/use-note";
import { useIdeaModal } from "@/hooks/use-idea";
import { useDiaryModal } from "@/hooks/use-diary";
import { useQuoteModal } from "@/hooks/use-quote";

export const SearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname()
  const noteModal = useNoteModal()
  const ideaModal = useIdeaModal()
  const diaryModal = useDiaryModal()
  const quoteModal = useQuoteModal()

  const page = pathname.split('/')[1]
  const name = searchParams.get("name");

  const [value, setValue] = useState(name || "");
  const debounceValue = useDebounce<string>(value, 500);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const query = {
      name: debounceValue,
    };
    const url = qs.stringifyUrl(
      { url: window.location.href, query },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  }, [debounceValue, router,]);

  const onClick = () => {
    if (page == 'note') {
      noteModal.setNote(null) // for create, initialData should be empty
      noteModal.onFormOpen()
    } else if (page == 'idea') {
      ideaModal.setIdea(null)
      ideaModal.onFormOpen()
    } else if (page == 'diary') {
      diaryModal.setDiary(null)
      diaryModal.onFormOpen()
    } else if (page == 'goal') {
      router.push(`/goal/form/new`)
    } else if (page == 'quote') {
      quoteModal.setQuote(null)
      quoteModal.onFormOpen()
    }
  }

  return (
    <MountedContainer>
      <div className="flex justify-between gap-x-4 ">
        <div className="relative w-full">
          <Search className="absolute h-4 w-4 top-3 left-4 text-muted-foreground " />
          <Input
            placeholder="Search..."
            className="pl-10 bg-primary/10"
            onChange={onChange}
            value={value}
          />
        </div>
        <Button onClick={onClick} >Write {page}</Button>
      </div>
    </MountedContainer>
  );
};
