import { Annotation } from "@langchain/langgraph";

import type { Person, PatentViewInfo } from "@/types";
import type { EmailDraftSchema, ExtractSchema } from "@/lib/schema";

export const InputStateAnnotation = Annotation.Root({
  usPatentNumber: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  patentMetadata: Annotation<Map<string, string> | null>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  userNotes: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
});

export const OutPutStateAnnotation = Annotation.Root({
  personOfInterest: Annotation<Person>({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({} as Person),
  }),
  emailDraft: Annotation<EmailDraftSchema | null>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
});

export const AgentStateAnnotation = Annotation.Root({
  ...InputStateAnnotation.spec,
  ...OutPutStateAnnotation.spec,

  patentInfo: Annotation<PatentViewInfo | null>({
    reducer: (x, y) => y ?? x,
    default: () => null,
  }),
  searchQueries: Annotation<string[]>({
    reducer: (x, y) => y ?? x,
    default: () => [],
  }),
  completedNotes: Annotation<string[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  info: Annotation<ExtractSchema>({
    reducer: (x, y) => y ?? x,
  }),
  isSatisfactory: Annotation<boolean>({
    reducer: (x, y) => y ?? x,
    default: () => false,
  }),
  feedback: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => "",
  }),
  reflectionSteps: Annotation<number>({
    reducer: (x, y) => y ?? x,
    default: () => 0,
  }),
});

export const ConfigurationAnnotation = Annotation.Root({
  maxReflectionSteps: Annotation<number>({
    reducer: (x, y) => y ?? x,
    default: () => 5,
  }),
  maxSearchQueries: Annotation<number>({
    reducer: (x, y) => y ?? x,
    default: () => 5,
  }),
});

export type AgentState = typeof AgentStateAnnotation.State;
export type ConfigurationState = typeof ConfigurationAnnotation.State;
