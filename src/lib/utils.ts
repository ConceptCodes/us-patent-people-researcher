import { tavily, type TavilySearchResponse } from "@tavily/core";
import type { PatentViewInfo } from "@/types";

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

export const getPatentInfo = async (
  patentNumber: string
): Promise<PatentViewInfo | null> => {
  const endpoint = "https://api.patentsview.org/patents/query";
  const body = {
    q: {
      patent_number: patentNumber.replace(/^([A-Z]+)/, (_, p1) =>
        p1.toLowerCase()
      ),
    },
    f: [
      "patent_number",
      "patent_title",
      "patent_date",
      "inventor_first_name",
      "inventor_last_name",
      "assignee_organization",
      "patent_abstract",
    ],
  };
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`PatentsView API error: ${res.status}`);
    const data = await res.json();
    const patents = (data as any)?.patents;
    if (Array.isArray(patents) && patents.length > 0) {
      return {
        patentDate: patents[0].patent_date,
        patentNumber: patents[0].patent_number,
        patentTitle: patents[0].patent_title,
        patentAbstract: patents[0].patent_abstract || "",
        inventorFirstName: patents[0].inventor_first_name || [],
        inventorLastName: patents[0].inventor_last_name || [],
      };
    }
    return null;
  } catch (err) {
    console.error("Error fetching patent info:", err);
    return null;
  }
};
