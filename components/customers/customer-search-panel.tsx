import Link from "next/link";
import {
  listRecentCustomersByScope,
  toCustomerQuickSummary
} from "@/lib/customers/repository";
import { TenantContextError } from "@/lib/tenant/errors";
import { getTenantContext } from "@/lib/tenant/getTenantContext";
import { CustomerSearchFlow } from "./customer-search-flow";

function TenantContextUnavailableState() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Tenant context unavailable</h2>
      <p className="mt-2 text-sm text-slate-600">
        Clerk is not configured (or no organization is active), so tenant-scoped customer lookup
        cannot load yet.
      </p>
      <div className="mt-4">
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Back to Dashboard
        </Link>
      </div>
    </section>
  );
}

export async function CustomerSearchPanel() {
  try {
    const tenantContext = await getTenantContext();
    const recentCustomers = await listRecentCustomersByScope({
      organizationId: tenantContext.organizationId
    });

    return (
      <CustomerSearchFlow
        initialCustomers={recentCustomers.map(toCustomerQuickSummary)}
      />
    );
  } catch (error) {
    if (
      error instanceof TenantContextError &&
      (error.code === "UNAUTHENTICATED" ||
        error.code === "MISSING_ORGANIZATION" ||
        error.code === "CLERK_UNAVAILABLE")
    ) {
      return <TenantContextUnavailableState />;
    }

    throw error;
  }
}
