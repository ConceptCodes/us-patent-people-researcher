import { tavily, type TavilySearchResponse } from "@tavily/core";
import type { PatentViewInfo } from "@/types";
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

export const getPatentInfo = async (
  patentNumber: string
): Promise<PatentViewInfo | null> => {
  const endpoint = "https://search.patentsview.org/api/v1/patents/search";
  const body = {
    q: {
      patent_number: [
        patentNumber.replace(/^([A-Z]+)/, (_, p1) => p1.toLowerCase()),
      ],
    },
    fields: [
      "patent_number",
      "patent_title",
      "patent_date",
      "patent_abstract",
      "inventors.inventor_id",
      "inventors.inventor_first_name",
      "inventors.inventor_last_name",
      "assignees.assignee_id",
      "assignees.assignee_organization",
    ],
    pagination: { per_page: 1 },
  };
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": process.env.PATENTS_VIEW_API_KEY || "",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`PatentsView API error: ${res.status}`);
    const data = (await res.json()) as { data?: { patents?: any[] } };
    const patents = data?.data?.patents;
    if (Array.isArray(patents) && patents.length > 0) {
      const patent = patents[0];
      return {
        patentDate: patent.patent_date,
        patentNumber: patent.patent_number,
        patentTitle: patent.patent_title,
        patentAbstract: patent.patent_abstract || "",
        inventorFirstName: (patent.inventors || []).map(
          (inv: any) => inv.inventor_first_name
        ),
        inventorLastName: (patent.inventors || []).map(
          (inv: any) => inv.inventor_last_name
        ),
        assigneeOrganization: (patent.assignees || []).map(
          (a: any) => a.assignee_organization
        ),
      };
    }
    return null;
  } catch (err) {
    console.error("Error fetching patent info:", err);
    return null;
  }
};
