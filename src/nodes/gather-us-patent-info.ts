import { Command, END } from "@langchain/langgraph";

import { type AgentState } from "@/agent/state";
import { getPatentInfo, isValidUSPatentNumber } from "@/lib/utils";

export const gatherUsPatentInfoNode = async (state: AgentState) => {
  const { usPatentNumber } = state;

  if (!usPatentNumber || !isValidUSPatentNumber(usPatentNumber)) {
    return new Command({ goto: END });
  }

  try {
    const patentInfo = await getPatentInfo(usPatentNumber);
    return { patentInfo };
  } catch (error) {
    console.error("Error fetching patent info:", error);
    return new Command({ goto: END });
  }
};
