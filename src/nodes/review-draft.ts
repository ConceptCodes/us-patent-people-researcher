import { type AgentState, AgentStateAnnotation } from "@/agent/state";

export const reviewDraftEmailNode = async (
  state: AgentState
): Promise<typeof AgentStateAnnotation.Update> => {
  // ...node logic here
  return {};
};
