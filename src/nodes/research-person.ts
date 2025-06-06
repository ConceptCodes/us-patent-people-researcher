import type { RunnableConfig } from "@langchain/core/runnables";

import {
  type AgentState,
  AgentStateAnnotation,
  type ConfigurationState,
} from "@/agent/state";
import { webSearch } from "@/lib/utils";
import { getInfoPrompt } from "@/agent/prompt";
import { llm } from "@/lib/llm";
import { extractionSchemaJson } from "@/lib/schema";

export const researchPersonNode = async (
  state: AgentState,
  config: RunnableConfig<ConfigurationState>
): Promise<typeof AgentStateAnnotation.Update> => {
  const maxSearchResults = (config as any)?.maxSearchQueries || 5;

  const searchDocs = await Promise.all(
    (state.searchQueries || []).map((query: string) =>
      webSearch(query, maxSearchResults)
    )
  );

  const sourceStr = searchDocs.map((doc) => JSON.stringify(doc)).join("\n\n");

  const prompt = getInfoPrompt(
    state.personOfInterest?.name || "",
    JSON.stringify(extractionSchemaJson, null, 2),
    sourceStr,
    state.userNotes || ""
  );

  const result = await llm.invoke(prompt);

  return { completedNotes: [result.text] };
};
