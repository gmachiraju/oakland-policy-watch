import Link from "next/link";
import { getAllOrdinances } from "@/lib/ordinances";

const statusColors: Record<string, string> = {
  Proposed: "bg-amber-100 text-amber-800",
  Passed: "bg-blue-100 text-blue-800",
  Failed: "bg-red-100 text-red-800",
  Signed: "bg-green-100 text-green-800",
  Vetoed: "bg-red-100 text-red-800",
};

export default function Home() {
  const ordinances = getAllOrdinances();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Oakland Policy Watch</h1>
      <p className="mt-2 text-sm text-gray-500">
        Illustrative placeholder data for testing this site — not real Oakland City Council records.
      </p>

      <ul className="mt-8 space-y-4">
        {ordinances.map((ordinance) => (
          <li key={ordinance.slug} className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <Link
                href={`/ordinances/${ordinance.slug}`}
                className="text-lg font-semibold text-blue-700 hover:underline"
              >
                {ordinance.title}
              </Link>
              <span
                className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${statusColors[ordinance.status]}`}
              >
                {ordinance.status}
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-600">
              {ordinance.topic} &middot; {ordinance.issue} &middot; {ordinance.district}
            </p>
            <p className="mt-2 text-sm">{ordinance.summary}</p>

            {ordinance.commentDeadline && (
              <p className="mt-2 inline-block rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                Comment deadline: {ordinance.commentDeadline}
              </p>
            )}

            <p className="mt-2 text-xs">
              <a href={ordinance.source.url} className="text-gray-500 underline">
                Source: {ordinance.source.label}
              </a>
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
