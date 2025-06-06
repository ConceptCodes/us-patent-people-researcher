import { graph } from "@/agent/graph";
const readline = require("readline");
import "dotenv/config";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter a US patent number: ", async (patentNumber: string) => {
  rl.close();
  if (!patentNumber) {
    console.error("No patent number provided.");
    process.exit(1);
  }

  try {
    const result = await graph.invoke(
      { usPatentNumber: patentNumber },
      {
        configurable: {
          maxReflectionSteps: Number(process.env.MAX_REFLECTION_STEPS),
          maxSearchQueries: Number(process.env.MAX_SEARCH_QUERIES),
        },
      }
    );
    console.log("\n--- Agent Output ---\n");
    console.dir(result, { depth: null, colors: true });
  } catch (err) {
    console.error("Error running agent:", err);
    process.exit(1);
  }
});
