import { NextResponse } from "next/server";

import { config } from "@/data/config";
import { QuoteType } from "@/types/ConfigTypes";

export async function GET(req: Request) {
  // get dateStr from query params
  const params = new URL(req.url).searchParams;
  const dateStr = params.get("dateStr");

  if (!dateStr) {
    throw new Error("No dateStr provided");
  }

  const quote = await getQuoteForTheDay(dateStr);

  if (!quote) {
    throw new Error("No quote found");
  }

  // return quote
  return NextResponse.json(quote);
}

async function getQuoteForTheDay(dateStr: string): Promise<QuoteType | null> {
  // return cached quote for the day if it exists
  const cachedQuote = getCachedQuote(dateStr);
  if (cachedQuote) {
    return cachedQuote;
  }

  // get random quote, save to cache, and return
  const randomQuote = await getRandomQuote();
  saveQuoteToCache(dateStr, randomQuote);
  return randomQuote;
}

async function getRandomQuote(): Promise<QuoteType> {
  // return random quote from config if it exists
  const customQuote = getRandomQuoteFromConfig();
  if (customQuote) {
    return customQuote;
  }

  // return random quote from api
  const apiQuote = await getRandomQuoteFromAPI();
  return apiQuote;
}

function getRandomQuoteFromConfig(): QuoteType | null {
  // if custom quote does not exist, return null
  if (!config || !config.quotes || config.quotes.length === 0) {
    return null;
  }

  // get custom quote
  const customQuote =
    config.quotes[Math.floor(Math.random() * config.quotes.length)];

  // check format of custom quote
  if (
    !customQuote.quote ||
    !customQuote.author ||
    customQuote.quote === "" ||
    customQuote.author === ""
  ) {
    return null;
  }

  // return custom quote
  return customQuote;
}

async function getRandomQuoteFromAPI(): Promise<QuoteType> {
  const response = await fetch("https://stoic-quotes.com/api/quote");

  const data = await response.json();

  return {
    quote: data.text,
    author: data.author,
  };
}

/**
 * Cache Modules
 */

let cachedQuote: {
  dateStr: string;
  quote: QuoteType | null;
} = {
  dateStr: "",
  quote: null,
};

function getCachedQuote(dateStr: string): QuoteType | null {
  // check if cached quote exists
  if (cachedQuote.dateStr === dateStr) {
    return cachedQuote.quote;
  }

  // return null if cached quote does not exist
  return null;
}

function saveQuoteToCache(dateStr: string, quote: QuoteType): void {
  cachedQuote = {
    dateStr,
    quote,
  };
}

// nextjs api routes default to caching the response
// this line forces the response to be dynamic
// export const dynamic = "force-dynamic";
