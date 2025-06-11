import { Command, END } from "@langchain/langgraph";

import { type AgentState } from "@/agent/state";
import { fetchPatentAndInventorInfo, isValidUSPatentNumber } from "@/lib/utils";

export const gatherUsPatentInfoNode = async (state: AgentState) => {
  const { usPatentNumber, patentMetadata } = state;

  if (!usPatentNumber || !isValidUSPatentNumber(usPatentNumber)) {
    return new Command({ goto: END });
  }

  console.log("Optional Patent Metadata: ", patentMetadata);

  try {
    const patentInfo = await fetchPatentAndInventorInfo(usPatentNumber);
    if (!patentInfo) {
      console.error("No patent information found for: ", usPatentNumber);
      return new Command({ goto: END });
    }
    return { patentInfo };
  } catch (error) {
    console.error("Error fetching patent info: ", error);
    return new Command({ goto: END });
  }
};
