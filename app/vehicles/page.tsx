import { EmptyStateCard } from "@/components/shell/empty-state-card";
import { PageFrame } from "@/components/shell/page-frame";

export default function VehiclesPage() {
  return (
    <PageFrame
      title="Vehicles"
      description="Track mileage, service timelines, and next service recommendations."
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Vehicle Service Timeline</h2>
        <p className="mt-1 text-sm text-slate-600">
          Returning customers should see their last visit and next due service at a glance.
        </p>
        <div className="mt-4">
          <EmptyStateCard
            title="No vehicles assigned yet"
            description="Vehicles linked to customer profiles will appear here with service history context."
            actionLabel="Add Vehicle (Soon)"
          />
        </div>
      </section>
    </PageFrame>
  );
}
