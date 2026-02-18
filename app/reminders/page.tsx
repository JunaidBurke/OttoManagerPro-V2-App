import { EmptyStateCard } from "@/components/shell/empty-state-card";
import { PageFrame } from "@/components/shell/page-frame";

export default function RemindersPage() {
  return (
    <PageFrame
      title="Reminders"
      description="Upcoming, due, and overdue service reminders for Main Shop."
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Reminder Queue</h2>
        <p className="mt-1 text-sm text-slate-600">
          Reminder status badges will prioritize follow-up calls and automated outreach.
        </p>
        <div className="mt-4">
          <EmptyStateCard
            title="No reminders yet"
            description="As services are completed, this queue will show upcoming, due, and overdue records."
            actionLabel="Schedule Reminder (Soon)"
          />
        </div>
      </section>
    </PageFrame>
  );
}
