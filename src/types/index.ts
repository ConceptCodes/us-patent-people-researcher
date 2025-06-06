type SocialContacts = {
  linkedin?: string;
  twitter?: string;
  github?: string;
  website?: string;
};

export type Person = {
  name: string;
  company?: string;
  email?: string;
  role?: string;
  socialContacts?: SocialContacts;
};

export enum Nodes {
  GATHER_US_PATENT_INFO = "gather-us-patent-info",
  GATHER_NOTES = "gather-notes",
  GENERATE_QUERIES = "generate-queries",
  RESEARCH_PERSON = "research-person",
  REFLECTION = "reflection",
  DRAFT_EMAIL = "draft-email",
  REVIEW_DRAFT = "review-draft",
}

export type PatentViewInfo = {
  patentNumber: string;
  patentTitle: string;
  patentDate: string;
  patentAbstract?: string;
  inventorFirstName?: string[];
  inventorLastName?: string[];
  assigneeOrganization?: string[];
};
