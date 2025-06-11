import type { RunnableConfig } from "@langchain/core/runnables";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import type {
  AgentState,
  ConfigurationState,
  AgentStateUpdate,
} from "@/agent/state";
import { llm } from "@/lib/llm";
import { extractionSchemaJson, queriesSchema } from "@/lib/schema";
import { getQueryWriterPrompt } from "@/agent/prompt";

export const generateQueriesNode = async (
  state: AgentState,
  config: RunnableConfig<ConfigurationState>
): Promise<AgentStateUpdate> => {
  const {
    personOfInterest: { email, name, role, company, socialContacts },
    userNotes,
    patentInfo,
  } = state;
  const maxSearchQueries = config.configurable?.maxSearchQueries!;
  const structuredLLM = llm.withStructuredOutput(queriesSchema);

  let personStr = `Email: ${email}`;

  if (name) personStr += ` Name: ${name}`;
  if (socialContacts?.linkedin)
    personStr += ` LinkedIn URL: ${socialContacts.linkedin}`;
  if (socialContacts?.twitter)
    personStr += ` Twitter URL: ${socialContacts.twitter}`;
  if (socialContacts?.github)
    personStr += ` GitHub URL: ${socialContacts.github}`;
  if (socialContacts?.website)
    personStr += ` Website URL: ${socialContacts.website}`;
  if (role) personStr += ` Role: ${role}`;
  if (company) personStr += ` Company: ${company}`;

  const systemPrompt = getQueryWriterPrompt(
    personStr,
    JSON.stringify(patentInfo, null, 2),
    maxSearchQueries,
    JSON.stringify(extractionSchemaJson, null, 2),
    userNotes
  );

  const prompt =
    "Please generate a list of search queries related to the schema that you want to populate.";

  const { queries } = await structuredLLM.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(prompt),
  ]);

  return { searchQueries: queries };
};
