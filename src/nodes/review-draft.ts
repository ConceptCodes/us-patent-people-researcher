import { Command, END } from "@langchain/langgraph";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

import { llm } from "@/lib/llm";
import { getEmailReviewPrompt } from "@/agent/prompt";
import { reviewDraftEmailSchema } from "@/lib/schema";
import { type AgentState } from "@/agent/state";
import { Nodes } from "@/types";

export const reviewDraftEmailNode = async (state: AgentState) => {
  const { emailDraft } = state;

  const prompt = getEmailReviewPrompt(emailDraft!);

  const structuredLLM = llm.withStructuredOutput(reviewDraftEmailSchema);
  const result = await structuredLLM.invoke([
    new SystemMessage(prompt),
    new HumanMessage(
      "Review the email draft and provide feedback or approval."
    ),
  ]);

  if (result.isSatisfactory) {
    return new Command({ goto: END });
  } else {
    return new Command({
      goto: Nodes.DRAFT_EMAIL,
      update: {
        isSatisfactory: false,
        feedback: result.feedback || "Needs improvement.",
      },
    });
  }
};
