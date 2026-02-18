import { EmptyStateCard } from "@/components/shell/empty-state-card";
import { PageFrame } from "@/components/shell/page-frame";

export default function CustomersPage() {
  return (
    <PageFrame
      title="Customers"
      description="Phone-first lookup and customer profiles for fast front-desk workflows."
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Customer Directory</h2>
        <p className="mt-1 text-sm text-slate-600">
          Search by phone number first, then open profile, vehicles, and service history.
        </p>
        <div className="mt-4">
          <EmptyStateCard
            title="No customers yet"
            description="Add your first customer to start building service history and reminder revenue."
            actionLabel="Create Customer (Soon)"
          />
        </div>
      </section>
    </PageFrame>
  );
}
