import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = auth();
    const { quote, author, book, isFeatured } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    if (!quote)
      return new NextResponse("Quote required fields", { status: 400 });
    if (!author)
      return new NextResponse("Author required fields", { status: 400 });

    const createdQuote = await prismadb.quote.create({
      data: {
        userId,
        quote,
        author,
        book: book ? book : "",
        isFeatured: isFeatured ? isFeatured : false,
      },
    });

    return NextResponse.json(createdQuote);
  } catch (error) {
    console.log("[QUOTE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
