import type { EmailDraftSchema } from "@/lib/schema";

export function getExtractionPrompt(info: string, notes: string): string {
  return `Your task is to take notes gathered from web research and extract them into the following schema.

<schema>
${info}
</schema>

Here are all the notes from research:

<web_research_notes>
${notes}
</web_research_notes>
`;
}

export function getQueryWriterPrompt(
  person: string,
  maxSearchQueries: number,
  info: string,
  userNotes: string
): string {
  return `You are a search query generator tasked with creating targeted search queries to gather specific information about a person.

Here is the person you are researching: ${person}

Generate at most ${maxSearchQueries} search queries that will help gather the following information:

<schema>
${info}
</schema>

<user_notes>
${userNotes}
</user_notes>

Your query should:
1. Make sure to look up the right name
2. Use context clues as to the company the person works at (if it isn't concretely provided)
3. Do not hallucinate search terms that will make you miss the persons profile entirely
4. Take advantage of the Linkedin URL if it exists, you can include the raw URL in your search query as that will lead you to the correct page guaranteed.

Create a focused query that will maximize the chances of finding schema-relevant information about the person.
Remember we are interested in determining their work experience mainly.`;
}

export function getInfoPrompt(
  people: string,
  info: string,
  content: string,
  userNotes: string
): string {
  return `You are doing web research on people, ${people}. 

The following schema shows the type of information we're interested in:

<schema>
${info}
</schema>

You have just scraped website content. Your task is to take clear, organized notes about a person, focusing on topics relevant to our interests.

<Website contents>
${content}
</Website contents>

Here are any additional notes from the user:
<user_notes>
${userNotes}
</user_notes>

Please provide detailed research notes that:
1. Are well-organized and easy to read
2. Focus on topics mentioned in the schema
3. Include specific facts, dates, and figures when available
4. Maintain accuracy of the original content
5. Note when important information appears to be missing or unclear

Remember: Don't try to format the output to match the schema - just take clear notes that capture all relevant information.`;
}

export function getReflectionPrompt(schema: string, info: string): string {
  return `You are a research analyst tasked with reviewing the quality and completeness of extracted person information.

Compare the extracted information with the required schema:

<Schema>
${schema}
</Schema>

Here is the extracted information:
<extracted_info>
${info}
</extracted_info>

Analyze if all required fields are present and sufficiently populated. Consider:
1. Are any required fields missing?
2. Are any fields incomplete or containing uncertain information?
3. Are there fields with placeholder values or "unknown" markers?
`;
}

export function getEmailDraftPrompt(
  info: string,
  patentInfo: string,
  userNotes: string
): string {
  return `You are an email draft generator tasked with creating a professional outreach email.
  
Here is the information you have gathered about them:
<info>
${info}
</info>

Here is the patent information related to them:
<patent_info>
${patentInfo}
</patent_info>

Here are any additional notes from the user:
<user_notes>
${userNotes}
</user_notes> 

Please draft a concise, professional email that:
1. Introduces yourself and your purpose
2. References relevant information about the person
3. Clearly states your request or reason for contacting them
4. Maintains a polite and respectful tone
5. Is suitable for a professional context 
6. Avoids unnecessary jargon or overly complex language
7. Is no longer than 200 words
Make sure to include a clear subject line that summarizes the email's purpose.`;
}

export function getEmailReviewPrompt(emailDraft: EmailDraftSchema): string {
  return `You are an expert in professional communication. Your task is to review the following email draft and determine if it needs to be revised.

<email_draft>
${JSON.stringify(emailDraft, null, 2)}
</email_draft>

Consider the following:
1. Is the email clear, concise, and professional?
2. Does it have a clear subject line and purpose?
3. Is the tone appropriate for a professional context?
4. Are there any grammatical or spelling errors?
5. Is the request or reason for contacting clearly stated?

If the email meets all these criteria, respond with "No revision needed." If not, briefly explain what needs to be revised.`;
}
