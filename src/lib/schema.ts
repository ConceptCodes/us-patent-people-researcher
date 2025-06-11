import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const extractSchema = z.object({
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
});
export type ExtractSchema = z.infer<typeof extractSchema>;
export const extractionSchemaJson = zodToJsonSchema(extractSchema);

// ----------------------------------------------------------------------------

export const queriesSchema = z.object({
  queries: z
    .array(z.string())
    .describe(
      "List of search queries related to the schema that you want to populate."
    ),
});

// ----------------------------------------------------------------------------

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

// ----------------------------------------------------------------------------

export const emailDraftSchema = z.object({
  subject: z.string().describe("Subject line of the email draft"),
  body: z
    .string()
    .describe("Body of the email draft, including a greeting and closing"),
});
export type EmailDraftSchema = z.infer<typeof emailDraftSchema>;

// ----------------------------------------------------------------------------

export const reviewDraftEmailSchema = z.object({
  isSatisfactory: z
    .boolean()
    .describe(
      "True if the email draft is satisfactory, False otherwise. If True, feedback is not required."
    ),
  feedback: z
    .string()
    .optional()
    .describe(
      "Feedback on the email draft, including any changes needed or suggestions for improvement"
    ),
});
