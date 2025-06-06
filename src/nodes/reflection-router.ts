import type { RunnableConfig } from "@langchain/core/runnables";

import type { AgentState, ConfigurationState } from "@/agent/state";
import { Nodes } from "@/types";

export const routeFromReflection = (
  state: AgentState,
  config: RunnableConfig<ConfigurationState>
) => {
  const { isSatisfactory, reflectionSteps } = state;
  const maxReflectionSteps = config.configurable?.maxReflectionSteps!;

  if (isSatisfactory) return Nodes.DRAFT_EMAIL;
  if (reflectionSteps < maxReflectionSteps) return Nodes.RESEARCH_PERSON;
  return Nodes.DRAFT_EMAIL;
};
