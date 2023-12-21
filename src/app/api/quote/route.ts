import { NextResponse } from "next/server";
import { QuoteType } from "@/types/TimetableTypes";

export async function GET() {
  const quote = await getRandomQuote();
  return NextResponse.json(quote);
}

async function getRandomQuote(): Promise<QuoteType> {
  let response = await fetch("https://stoic-quotes.com/api/quote");
  let data = await response.json();
  return {
    quote: data.text,
    author: data.author,
  };
}
