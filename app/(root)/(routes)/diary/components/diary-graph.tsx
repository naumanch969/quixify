"use client";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { MountedContainer } from "../../../../../components/ui/mounted-container";


export const DiaryGraph = ({ data }: { data: any[] }) => {
    const router = useRouter();


    const onClick = (id: string | undefined) => {
        const query = {

        };
        const url = qs.stringifyUrl(
            { url: window.location.href, query },
            { skipEmptyString: true, skipNull: true } // remove null and ""
        );

        router.push(url);
    };

    return (
        <MountedContainer>
            <div className="flex justify-center items-center w-full overflow-x-auto space-x-2 p-1 aspect-[3.2/1] bg-slate-700 ">
                Happy days, normal days, excited days...
            </div>
        </MountedContainer>
    );
};
