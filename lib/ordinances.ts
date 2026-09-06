import ordinancesData from "@/data/ordinances.json";

export type Ordinance = {
  slug: string;
  identifier: string;
  title: string;
  topic: string;
  issue: string;
  district: string;
  author: string;
  sponsors: string[];
  status: "Proposed" | "Passed" | "Failed" | "Signed" | "Vetoed";
  voteHistory: { member: string; vote: "Yes" | "No" | "Abstain" | "Absent" }[];
  keyDates: { label: string; date: string }[];
  commentDeadline?: string;
  summary: string;
  description: string;
  whyItMatters: string;
  quote?: { text: string; speaker: string };
  source: { label: string; url: string };
};

const ordinances = ordinancesData as Ordinance[];

export function getAllOrdinances(): Ordinance[] {
  return ordinances;
}

export function getOrdinanceBySlug(slug: string): Ordinance | undefined {
  return ordinances.find((ordinance) => ordinance.slug === slug);
}
