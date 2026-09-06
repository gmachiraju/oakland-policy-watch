import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const ordinances = JSON.parse(
  fs.readFileSync(path.join(dir, "..", "data", "ordinances.json"), "utf8"),
);

const REQUIRED_FIELDS = [
  "slug",
  "identifier",
  "title",
  "topic",
  "issue",
  "district",
  "author",
  "sponsors",
  "status",
  "voteHistory",
  "keyDates",
  "summary",
  "description",
  "whyItMatters",
  "source",
];

const VALID_STATUSES = new Set(["Proposed", "Passed", "Failed", "Signed", "Vetoed"]);

assert.ok(ordinances.length >= 3 && ordinances.length <= 5, "expected 3-5 ordinances");

const slugs = new Set();
for (const ordinance of ordinances) {
  for (const field of REQUIRED_FIELDS) {
    assert.ok(ordinance[field] !== undefined, `${ordinance.slug ?? "?"} missing ${field}`);
  }

  assert.ok(!slugs.has(ordinance.slug), `duplicate slug: ${ordinance.slug}`);
  slugs.add(ordinance.slug);

  const issueWordCount = ordinance.issue.trim().split(/\s+/).length;
  assert.ok(issueWordCount <= 3, `${ordinance.slug} issue must be <=3 words, got "${ordinance.issue}"`);

  assert.ok(
    VALID_STATUSES.has(ordinance.status),
    `${ordinance.slug} has invalid status: ${ordinance.status}`,
  );

  assert.ok(ordinance.source.url && ordinance.source.label, `${ordinance.slug} missing source citation`);
}

console.log(`OK: ${ordinances.length} ordinances validated`);
