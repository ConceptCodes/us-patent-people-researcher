import { type AgentState, AgentStateAnnotation } from "@/agent/state";

export const draftEmailNode = async (
  state: AgentState
): Promise<typeof AgentStateAnnotation.Update> => {
  // ...node logic here
  return {};
};
