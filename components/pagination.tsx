"use client"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "./ui/button"
import { MountedContainer } from "./ui/mounted-container"

export function CustomPagination({ onForward, onBack, forwardDisabled, backDisabled }: { onForward: () => void, onBack: () => void, forwardDisabled?: boolean, backDisabled?: boolean }) {
    return (
        <MountedContainer>
            <Pagination className="mx-0 w-fit" >
                <PaginationContent>
                    <PaginationItem  >
                        <Button disabled={backDisabled} variant='outline' onClick={onBack} className="px-0 disabled:cursor-not-allowed bg-muted " ><PaginationPrevious /></Button>
                    </PaginationItem>
                    <PaginationItem  >
                        <Button disabled={forwardDisabled} variant='outline' onClick={onForward} className="px-0 disabled:cursor-not-allowed bg-muted " ><PaginationNext /></Button>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </MountedContainer>
    )
}
