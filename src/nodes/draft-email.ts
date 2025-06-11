import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { llm } from "@/lib/llm";
import { getEmailDraftPrompt } from "@/agent/prompt";
import { type AgentState, AgentStateAnnotation } from "@/agent/state";
import { emailDraftSchema } from "@/lib/schema";

export const draftEmailNode = async (
  state: AgentState
): Promise<typeof AgentStateAnnotation.Update> => {
  const { personOfInterest, patentInfo, userNotes, feedback } = state;

  const prompt = getEmailDraftPrompt(
    JSON.stringify(personOfInterest, null, 2),
    JSON.stringify(patentInfo, null, 2),
    userNotes
  );

  const structuredLLM = llm.withStructuredOutput(emailDraftSchema);
  const result = await structuredLLM.invoke([
    new SystemMessage(`Here is some feedback from the user: ${feedback}`),
    new HumanMessage(prompt),
  ]);

  return {
    emailDraft: result,
  };
};
