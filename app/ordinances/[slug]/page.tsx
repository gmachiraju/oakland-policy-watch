import { notFound } from "next/navigation";
import { getAllOrdinances, getOrdinanceBySlug } from "@/lib/ordinances";

export function generateStaticParams() {
  return getAllOrdinances().map((ordinance) => ({ slug: ordinance.slug }));
}

export default async function OrdinancePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ordinance = getOrdinanceBySlug(slug);

  if (!ordinance) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm text-gray-500">
        Illustrative placeholder data for testing this site — not a real Oakland City Council record.
      </p>

      <h1 className="mt-2 text-2xl font-bold">{ordinance.title}</h1>
      <p className="mt-1 text-sm text-gray-500">{ordinance.identifier}</p>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <dt className="text-gray-500">Topic</dt>
        <dd>{ordinance.topic}</dd>
        <dt className="text-gray-500">Issue</dt>
        <dd>{ordinance.issue}</dd>
        <dt className="text-gray-500">District</dt>
        <dd>{ordinance.district}</dd>
        <dt className="text-gray-500">Status</dt>
        <dd>{ordinance.status}</dd>
        <dt className="text-gray-500">Author</dt>
        <dd>{ordinance.author}</dd>
        <dt className="text-gray-500">Sponsors</dt>
        <dd>{ordinance.sponsors.join(", ") || "—"}</dd>
      </dl>

      {ordinance.commentDeadline && (
        <p className="mt-4 inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
          Comment deadline: {ordinance.commentDeadline}
        </p>
      )}

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-gray-500">Summary</h2>
        <p className="mt-1">{ordinance.summary}</p>
      </section>

      <section className="mt-4">
        <h2 className="text-sm font-semibold text-gray-500">Description</h2>
        <p className="mt-1">{ordinance.description}</p>
      </section>

      <section className="mt-4">
        <h2 className="text-sm font-semibold text-gray-500">Why this matters</h2>
        <p className="mt-1">{ordinance.whyItMatters}</p>
      </section>

      {ordinance.quote && (
        <blockquote className="mt-4 border-l-4 border-gray-300 pl-4 italic text-gray-700">
          &ldquo;{ordinance.quote.text}&rdquo;
          <footer className="mt-1 text-sm not-italic text-gray-500">
            — {ordinance.quote.speaker}
          </footer>
        </blockquote>
      )}

      <section className="mt-6">
        <h2 className="text-sm font-semibold text-gray-500">Key dates</h2>
        <ul className="mt-1 space-y-1 text-sm">
          {ordinance.keyDates.map((d) => (
            <li key={d.label}>
              {d.date} — {d.label}
            </li>
          ))}
        </ul>
      </section>

      {ordinance.voteHistory.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold text-gray-500">Vote history</h2>
          <ul className="mt-1 space-y-1 text-sm">
            {ordinance.voteHistory.map((v) => (
              <li key={v.member}>
                {v.member}: {v.vote}
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-8 text-xs">
        <a href={ordinance.source.url} className="text-gray-500 underline">
          Source: {ordinance.source.label}
        </a>
      </p>
    </main>
  );
}
