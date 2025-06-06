import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const extractSchema = z
  .object({
    yearsExperience: z
      .number()
      .describe(
        "How many years of full time work experience (excluding internships) does this person have."
      ),
    currentCompany: z
      .string()
      .describe("The name of the current company the person works at."),
    role: z.string().describe("Current role of the person."),
    priorCompanies: z
      .array(z.string())
      .describe("List of previous companies where the person has worked"),
  })
  .describe("Person information");

export type ExtractSchema = z.infer<typeof extractSchema>;

export const extractionSchemaJson = zodToJsonSchema(extractSchema);

export const queriesSchema = z
  .object({
    queries: z
      .array(z.string())
      .describe(
        "List of search queries related to the schema that you want to populate."
      ),
  })
  .describe("Search queries schema");

export const reflectionSchema = z.object({
  isSatisfactory: z
    .boolean()
    .describe(
      "True if all required fields are well populated, False otherwise"
    ),
  missingFields: z
    .array(z.string())
    .describe("List of field names that are missing or incomplete"),
  searchQueries: z
    .array(z.string())
    .describe(
      "If isSatisfactory is False, provide 1-3 targeted search queries to find the missing information"
    ),
  reasoning: z.string().describe("Brief explanation of the assessment"),
});
