import { FC, useState, useEffect } from "react";
import { Spectral } from "next/font/google";
import { QuoteType } from "@/types/TimetableTypes";

const spectral = Spectral({ subsets: ["latin"], weight: ["400", "600"] });

export const Quote: FC = () => {
  const [quote, setQuote] = useState<QuoteType>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch("/api/quote");
        if (!response.ok) {
          throw new Error("Error fetching quote");
        }
        const data = await response.json();
        setQuote(data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchQuote();
  }, []);

  if (isLoading) {
    return (
      <div className={`p-5 flex flex-col gap-1`}>
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-2/4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className={`p-5 flex flex-col gap-1 ${spectral.className}`}>
        {quote && (
          <>
            <div className="text-sm text-[#63634a]">{`"${quote?.quote}"`}</div>
            <div className="font-semibold text-sm text-foreLight">
              {quote?.author}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
