import { NextResponse } from "next/server";

import { config } from "@/data/config";
import { QuoteType } from "@/types/ConfigTypes";

export async function GET() {
  let quote: QuoteType;
  if (config?.quotes && config.quotes.length > 0) {
    quote =
      config.quotes.length > 1
        ? config.quotes[Math.floor(Math.random() * config.quotes.length)]
        : config.quotes[0];
    if (!quote.author || !quote.quote || quote?.quote === "") {
      quote = await getRandomQuote();
    }
  } else {
    quote = await getRandomQuote();
  }
  return NextResponse.json(quote);
}

async function getRandomQuote(): Promise<QuoteType> {
  const response = await fetch("https://stoic-quotes.com/api/quote");

  const data = await response.json();

  return {
    quote: data.text,
    author: data.author,
  };
}

// this line is needed to make the quote random
export const dynamic = "force-dynamic";
