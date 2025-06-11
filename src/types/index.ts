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

export type PatentsViewInfo = {
  total_patent_count: number;
  total_inventor_count: number;
  patents: Patent[];
};

export type Patent = {
  patent_id: string;
  patent_title?: string;
  patent_date?: string;
  inventors: Inventor[];
};

export type Inventor = {
  inventor_id: string;
  inventor_name_first?: string;
  inventor_name_last?: string;
  inventor_city?: string;
  inventor_state?: string;
  inventor_country?: string;
};
