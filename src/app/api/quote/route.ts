import { NextResponse } from "next/server";
import { timetable } from "@/data/timetable";
import { QuoteType } from "@/types/TimetableTypes";

export async function GET() {
  let quote: QuoteType;
  if (timetable?.quotes && timetable.quotes.length > 0) {
    quote =
      timetable.quotes.length > 1
        ? timetable.quotes[Math.floor(Math.random() * timetable.quotes.length)]
        : timetable.quotes[0];
    if (!quote.author || !quote.quote) {
      quote = await getRandomQuote();
    }
  } else {
    quote = await getRandomQuote();
  }
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
