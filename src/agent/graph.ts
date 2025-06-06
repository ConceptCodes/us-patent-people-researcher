import { END, START, StateGraph } from "@langchain/langgraph";

import {
  AgentStateAnnotation,
  ConfigurationAnnotation,
  InputStateAnnotation,
  OutPutStateAnnotation,
} from "@/agent/state";

import { gatherNotesNode } from "@/nodes/gather-notes";
import { generateQueriesNode } from "@/nodes/generate-queries";
import { researchPersonNode } from "@/nodes/research-person";
import { reflectionNode } from "@/nodes/reflection";
import { draftEmailNode } from "@/nodes/draft-email";
import { gatherUsPatentInfoNode } from "@/nodes/gather-us-patent-info";
import { reviewDraftEmailNode } from "@/nodes/review-draft";
import { routeFromReflection } from "@/nodes/reflection-router";

import { Nodes } from "@/types";

const workflow = new StateGraph(
  {
    input: InputStateAnnotation,
    output: OutPutStateAnnotation,
    stateSchema: AgentStateAnnotation,
  },
  ConfigurationAnnotation
);

workflow
  .addNode(Nodes.GATHER_US_PATENT_INFO, gatherUsPatentInfoNode)
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
  .addConditionalEdges(Nodes.REFLECTION, routeFromReflection, [
    Nodes.DRAFT_EMAIL,
    Nodes.RESEARCH_PERSON,
  ])
  .addEdge(Nodes.DRAFT_EMAIL, Nodes.REVIEW_DRAFT);

export const graph = workflow.compile();
