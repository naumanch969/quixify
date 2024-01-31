import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";
import { addDays } from "date-fns";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { quoteId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = auth();
    const { quote, author, book, isFeatured } = body;

    if (!params.quoteId)
      return new NextResponse("Quote Id is required", { status: 400 });

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!quote) return new NextResponse("Quote is missing.", { status: 400 });
    if (!author) return new NextResponse("Author is missing.", { status: 400 });

    const updatedQuote = await prismadb.quote.update({
      where: { id: params.quoteId, userId },
      data: {
        userId,
        quote,
        author,
        book: book ? book : "",
        isFeatured: isFeatured ? isFeatured : "",
      },
    });

    return NextResponse.json(updatedQuote);
  } catch (error) {
    console.log("[QUOTE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { quoteId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthoriuzed", { status: 401 });

    if (!params.quoteId)
      return new NextResponse("Quote Id is required", { status: 400 });

    const quote = await prismadb.quote.delete({
      where: {
        userId,
        id: params.quoteId,
      },
    });

    return NextResponse.json(quote);
  } catch (error) {
    console.log("[QUOTE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
