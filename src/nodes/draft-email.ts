import { HumanMessage } from "@langchain/core/messages";

import { getEmailDraftPrompt } from "@/agent/prompt";
import { type AgentState, AgentStateAnnotation } from "@/agent/state";
import { llm } from "@/lib/llm";
import { emailDraftSchema } from "@/lib/schema";

export const draftEmailNode = async (
  state: AgentState
): Promise<typeof AgentStateAnnotation.Update> => {
  const { personOfInterest, patentInfo, userNotes } = state;

  const prompt = getEmailDraftPrompt(
    JSON.stringify(personOfInterest, null, 2),
    JSON.stringify(patentInfo, null, 2),
    userNotes
  );

  const structuredLLM = llm.withStructuredOutput(emailDraftSchema);
  const result = await structuredLLM.invoke([new HumanMessage(prompt)]);

  return {
    emailDraft: result,
  };
};
