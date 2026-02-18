import { EmptyStateCard } from "@/components/shell/empty-state-card";
import { PageFrame } from "@/components/shell/page-frame";

export default function LocationsSettingsPage() {
  return (
    <PageFrame
      title="Locations"
      description="Manage shop locations and choose which one is active in the topbar."
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Location Management</h2>
        <p className="mt-1 text-sm text-slate-600">
          Creation and editing UI will be added in a follow-up task.
        </p>
        <div className="mt-4">
          <EmptyStateCard
            title="Location tools coming next"
            description="Use the topbar dropdown to switch active location. Full create and edit controls are staged for an upcoming DAY task."
            actionLabel="Back to Dashboard"
          />
        </div>
      </section>
    </PageFrame>
  );
}
