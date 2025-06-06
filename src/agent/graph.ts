import { END, START, StateGraph } from "@langchain/langgraph";
import type { RunnableConfig } from "@langchain/core/runnables";

import {
  AgentStateAnnotation,
  ConfigurationAnnotation,
  InputStateAnnotation,
  OutPutStateAnnotation,
  type AgentState,
  type ConfigurationState,
} from "@/agent/state";

import { gatherNotesNode } from "@/nodes/gather-notes";
import { generateQueriesNode } from "@/nodes/generate-queries";
import { researchPersonNode } from "@/nodes/research-person";
import { reflectionNode } from "@/nodes/reflection";
import { draftEmailNode } from "@/nodes/draft-email";
import { gatherUsPatentInfoNode } from "@/nodes/gather-us-patent-info";
import { reviewDraftEmailNode } from "@/nodes/review-draft";

import { Nodes } from "@/types";

const workflow = new StateGraph(
  {
    input: InputStateAnnotation,
    output: OutPutStateAnnotation,
    stateSchema: AgentStateAnnotation,
  },
  ConfigurationAnnotation
);

const routeFromReflection = (
  state: AgentState,
  config: RunnableConfig<ConfigurationState>
) => {
  const { isSatisfactory, reflectionSteps } = state;
  const maxReflectionSteps = config.configurable?.maxReflectionSteps!;

  if (isSatisfactory) return Nodes.DRAFT_EMAIL;
  if (reflectionSteps < maxReflectionSteps) return Nodes.RESEARCH_PERSON;
  return Nodes.DRAFT_EMAIL;
};

workflow
  .addNode(Nodes.GATHER_US_PATENT_INFO, gatherUsPatentInfoNode, {
    ends: [Nodes.GATHER_NOTES, END],
  })
  .addNode(Nodes.GATHER_NOTES, gatherNotesNode)
  .addNode(Nodes.GENERATE_QUERIES, generateQueriesNode)
  .addNode(Nodes.RESEARCH_PERSON, researchPersonNode)
  .addNode(Nodes.REFLECTION, reflectionNode)
  .addNode(Nodes.DRAFT_EMAIL, draftEmailNode)
  .addNode(Nodes.REVIEW_DRAFT, reviewDraftEmailNode, {
    ends: [Nodes.DRAFT_EMAIL, END],
  })

  .addEdge(START, Nodes.GATHER_US_PATENT_INFO)
  .addEdge(Nodes.GATHER_US_PATENT_INFO, Nodes.GENERATE_QUERIES)
  .addEdge(Nodes.GENERATE_QUERIES, Nodes.RESEARCH_PERSON)
  .addEdge(Nodes.RESEARCH_PERSON, Nodes.GATHER_NOTES)
  .addEdge(Nodes.GATHER_NOTES, Nodes.REFLECTION)
  .addConditionalEdges(Nodes.REFLECTION, routeFromReflection)
  .addEdge(Nodes.DRAFT_EMAIL, Nodes.REVIEW_DRAFT);

export const graph = workflow.compile();
