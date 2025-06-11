import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { llm } from "@/lib/llm";
import { getExtractionPrompt } from "@/agent/prompt";
import type { AgentState, AgentStateUpdate } from "@/agent/state";
import { extractionSchemaJson, extractSchema } from "@/lib/schema";
import { formatAllNotes } from "@/lib/utils";

export const gatherNotesNode = async (
  state: AgentState
): Promise<AgentStateUpdate> => {
  const { completedNotes } = state;
  const notes = formatAllNotes(completedNotes);

  const systemPrompt = getExtractionPrompt(
    JSON.stringify(extractionSchemaJson, null, 2),
    notes
  );

  const structuredLLM = llm.withStructuredOutput(extractSchema);

  const result = await structuredLLM.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage("Produce a structured output from these notes."),
  ]);

  return {
    info: result,
  };
};
