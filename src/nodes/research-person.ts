import type { RunnableConfig } from "@langchain/core/runnables";

import {
  type AgentState,
  AgentStateAnnotation,
  type ConfigurationState,
} from "@/agent/state";
import { deduplicateAndFormatSources, webSearch } from "@/lib/utils";
import { getInfoPrompt } from "@/agent/prompt";
import { llm } from "@/lib/llm";
import { extractionSchemaJson } from "@/lib/schema";

export const researchPersonNode = async (
  state: AgentState,
  config: RunnableConfig<ConfigurationState>
): Promise<typeof AgentStateAnnotation.Update> => {
  const {
    searchQueries,
    userNotes,
    personOfInterest: { name },
  } = state;
  const maxSearchResults = config.configurable?.maxSearchQueries!;
  const maxTokensPerSource = config.configurable?.maxTokensPerSource!;

  const searchDocs = await Promise.all(
    searchQueries.map((query: string) => webSearch(query, maxSearchResults))
  );

  const combinedSources = deduplicateAndFormatSources(
    searchDocs,
    maxTokensPerSource
  );

  const prompt = getInfoPrompt(
    name,
    JSON.stringify(extractionSchemaJson, null, 2),
    combinedSources,
    userNotes
  );

  const result = await llm.invoke(prompt);

  return { completedNotes: [result.text] };
};
