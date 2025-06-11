import { SystemMessage, HumanMessage } from "@langchain/core/messages";

import { llm } from "@/lib/llm";
import { enhanceSearchQueries, getReflectionPrompt } from "@/agent/prompt";
import {
  reflectionSchema,
  extractionSchemaJson,
  queriesSchema,
} from "@/lib/schema";
import type { AgentState, AgentStateUpdate } from "@/agent/state";

export const reflectionNode = async (
  state: AgentState
): Promise<AgentStateUpdate> => {
  const { info, reflectionSteps } = state;
  const systemPrompt = getReflectionPrompt(
    JSON.stringify(extractionSchemaJson, null, 2),
    JSON.stringify(info, null, 2)
  );

  const structuredLLM = llm.withStructuredOutput(reflectionSchema);
  const { isSatisfactory, searchQueries, reasoning, missingFields } =
    await structuredLLM.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage("Produce a structured reflection output."),
    ]);

  if (isSatisfactory) return { isSatisfactory };
  else {
    const prompt = enhanceSearchQueries(
      searchQueries,
      reasoning,
      missingFields
    );

    const structuredLLM = llm.withStructuredOutput(queriesSchema);
    const { queries } = await structuredLLM.invoke([
      new SystemMessage("Generate enhanced search queries."),
      new HumanMessage(prompt),
    ]);

    return {
      isSatisfactory,
      searchQueries: queries,
      reflectionSteps: reflectionSteps + 1,
    };
  }
};
