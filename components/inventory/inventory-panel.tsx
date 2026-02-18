import Link from "next/link";
import {
  InventoryScopeError,
  resolveActiveInventoryScope
} from "@/lib/inventory/active-location-scope";
import { listInventoryByScope } from "@/lib/inventory/repository";
import { TenantContextError } from "@/lib/tenant/errors";
import { InventoryTable } from "./inventory-table";

function NoLocationSetupState() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">No locations configured</h2>
      <p className="mt-2 text-sm text-slate-600">
        Create your first location before adding inventory so stock stays scoped to the right
        shop.
      </p>
      <div className="mt-4">
        <Link
          href="/settings/locations"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-900 px-4 text-sm font-medium text-slate-50 hover:bg-slate-800"
        >
          Create Location
        </Link>
      </div>
    </section>
  );
}

function NoActiveLocationState() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">No active location available</h2>
      <p className="mt-2 text-sm text-slate-600">
        Activate a location in settings, then refresh this page to manage inventory.
      </p>
      <div className="mt-4">
        <Link
          href="/settings/locations"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Open Location Settings
        </Link>
      </div>
    </section>
  );
}

function TenantContextUnavailableState() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Tenant context unavailable</h2>
      <p className="mt-2 text-sm text-slate-600">
        Clerk is not configured (or no organization is active), so tenant-scoped inventory cannot
        be loaded yet.
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

export async function InventoryPanel() {
  try {
    const scope = await resolveActiveInventoryScope();
    const rows = await listInventoryByScope(scope);

    return <InventoryTable rows={rows} activeLocationName={scope.locationName} />;
  } catch (error) {
    if (error instanceof InventoryScopeError && error.code === "NO_LOCATIONS") {
      return <NoLocationSetupState />;
    }

    if (error instanceof InventoryScopeError && error.code === "NO_ACTIVE_LOCATION") {
      return <NoActiveLocationState />;
    }

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
