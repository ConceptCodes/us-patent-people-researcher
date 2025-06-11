import { tavily, type TavilySearchResponse } from "@tavily/core";
import type { PatentsViewInfo } from "@/types";
import "dotenv/config";

const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

export const formatAllNotes = (completedNotes: string[]): string => {
  let formattedStr = "";
  completedNotes.forEach((peopleNotes, idx) => {
    formattedStr += `${"=".repeat(60)}
People ${idx + 1}:
${"=".repeat(60)}
Notes from research:
${peopleNotes}`;
  });
  return formattedStr;
};

export const webSearch = async (
  query: string,
  maxResults = 3
): Promise<TavilySearchResponse> => {
  try {
    const response = await tvly.search(query, {
      maxResults,
      includeRawContent: "markdown",
      days: 360,
      topic: "general",
    });

    return response;
  } catch (error) {
    console.error("Error calling Tavily API:", error);
    throw error;
  }
};

export const usPatentNumberRegex =
  /^(?:\d{7,}|D\d{6,}|PP\d{5,}|RE\d{5,}|T\d{6,})$/i;

export const isValidUSPatentNumber = (patentNumber: string): boolean => {
  return usPatentNumberRegex.test(patentNumber.trim());
};

export const fetchPatentAndInventorInfo = async (
  patentNumber: string
): Promise<PatentsViewInfo | null> => {
  const response = await fetch(
    "https://search.patentsview.org/api/v1/patent/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.PATENTS_VIEW_API_KEY || "",
      },
      body: JSON.stringify({
        q: {
          patent_id: patentNumber,
        },
        f: [
          "patent_id",
          "patent_title",
          "patent_date",
          "inventors.inventor_id",
          "inventors.inventor_name_first",
          "inventors.inventor_name_last",
          "inventors.inventor_city",
          "inventors.inventor_state",
          "inventors.inventor_country",
        ],
      }),
    }
  );

  const data = (await response.json()) as PatentsViewInfo;
  if (!data || !data.patents || data.patents.length === 0) {
    console.error("No patent information found for:", patentNumber);
    return null;
  }
  return data;
};

export const deduplicateAndFormatSources = (
  searchResponse: TavilySearchResponse[],
  maxTokensPerSource: number
) => {
  const uniqueSources: Record<string, TavilySearchResponse["results"][0]> = {};
  for (const source of searchResponse) {
    source.results.forEach((source) => {
      if (!uniqueSources[source.url]) {
        uniqueSources[source.url] = source;
      }
    });
  }

  let formattedText = "Sources:\n\n";
  Object.values(uniqueSources).forEach((source) => {
    formattedText += `Source ${source.title}:\n===\n`;
    formattedText += `URL: ${source.url}\n===\n`;
    formattedText += `Most relevant content from source: ${source.content}\n===\n`;
    const charLimit = maxTokensPerSource * 4;
    let rawContent = source.rawContent ?? "";
    if (rawContent.length > charLimit) {
      rawContent = rawContent.substring(0, charLimit) + "... [truncated]";
    }
    formattedText += `Full source content limited to ${maxTokensPerSource} tokens: ${rawContent}\n\n`;
  });

  return formattedText.trim();
};
