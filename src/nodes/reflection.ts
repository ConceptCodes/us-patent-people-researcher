import { SystemMessage, HumanMessage } from "@langchain/core/messages";

import { llm } from "@/lib/llm";
import { getReflectionPrompt } from "@/agent/prompt";
import { reflectionSchema, extractionSchemaJson } from "@/lib/schema";
import { type AgentState, AgentStateAnnotation } from "@/agent/state";

export const reflectionNode = async (
  state: AgentState
): Promise<typeof AgentStateAnnotation.Update> => {
  const systemPrompt = getReflectionPrompt(
    JSON.stringify(extractionSchemaJson, null, 2),
    JSON.stringify(state.info, null, 2)
  );

  const structuredLLM = llm.withStructuredOutput(reflectionSchema);
  const result = await structuredLLM.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage("Produce a structured reflection output."),
  ]);

  if (result.isSatisfactory) {
    return { isSatisfactory: result.isSatisfactory };
  } else {
    return {
      isSatisfactory: result.isSatisfactory,
      searchQueries: result.searchQueries,
      reflectionSteps: state.reflectionSteps + 1,
    };
  }
};
