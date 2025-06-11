import { ChatOllama } from "@langchain/ollama";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";

const model = "mistral";

// export const llm = new ChatOllama({
//   model,
//   temperature: 0,
// });

export const llm = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});
