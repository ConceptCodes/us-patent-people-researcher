import { ChatOllama } from "@langchain/ollama";
import { ChatOpenAI } from "@langchain/openai";

const model = "llama3.1";

export const llm = new ChatOllama({
  model,
  temperature: 0,
});

// export const llm = new ChatOpenAI({
//   modelName: "gpt-4o-mini",
//   temperature: 0,
//   openAIApiKey: process.env.OPENAI_API_KEY,
// });
