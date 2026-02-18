import { Suspense } from "react";
import { CustomerPanelSkeleton } from "@/components/customers/customer-panel-skeleton";
import { CustomerSearchPanel } from "@/components/customers/customer-search-panel";
import { PageFrame } from "@/components/shell/page-frame";

export default function CustomersPage() {
  return (
    <PageFrame
      title="Customers"
      description="Phone-first lookup and customer profiles for fast front-desk workflows."
    >
      <Suspense fallback={<CustomerPanelSkeleton />}>
        <CustomerSearchPanel />
      </Suspense>
    </PageFrame>
  );
}
