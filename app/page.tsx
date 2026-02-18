import { EmptyStateCard } from "@/components/shell/empty-state-card";
import { PageFrame } from "@/components/shell/page-frame";

const KPI_CARDS = [
  { label: "Today's Jobs", value: "0", tone: "text-slate-900" },
  { label: "Due Services", value: "0", tone: "text-amber-700" },
  { label: "Overdue", value: "0", tone: "text-red-700" }
] as const;

export default function HomePage() {
  return (
    <PageFrame
      title="Dashboard"
      description="Your daily shop overview for Main Shop. Prioritize walk-ins, due services, and quick actions."
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {KPI_CARDS.map((card) => (
          <article
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
          >
            <p className="text-sm text-slate-600">{card.label}</p>
            <p className={`mt-3 text-3xl font-semibold tracking-tight ${card.tone}`}>{card.value}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Today&apos;s Queue</h2>
          <p className="mt-1 text-sm text-slate-600">
            Keep front desk flow fast with quick customer lookup and service add.
          </p>
          <div className="mt-4">
            <EmptyStateCard
              title="No jobs started yet"
              description="As walk-ins and calls are added, active jobs will appear here."
              actionLabel="Add Walk-In (Soon)"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Due & Overdue Reminders</h2>
          <p className="mt-1 text-sm text-slate-600">
            Service reminders drive repeat business. This panel will highlight what needs attention today.
          </p>
          <div className="mt-4">
            <EmptyStateCard
              title="No reminders available yet"
              description="Once services are completed, upcoming, due, and overdue reminders will populate here."
              actionLabel="Open Reminders"
            />
          </div>
        </section>
      </div>
    </PageFrame>
  );
}
