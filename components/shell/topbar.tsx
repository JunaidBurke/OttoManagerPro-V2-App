import { getLocationContext } from "@/lib/location/getLocationContext";
import { TenantContextError } from "@/lib/tenant/errors";
import { LocationSwitcher } from "./location-switcher";

export async function Topbar() {
  let locationContext:
    | Awaited<ReturnType<typeof getLocationContext>>
    | null = null;

  try {
    locationContext = await getLocationContext();
  } catch (error) {
    if (
      error instanceof TenantContextError &&
      (error.code === "UNAUTHENTICATED" ||
        error.code === "MISSING_ORGANIZATION" ||
        error.code === "CLERK_UNAVAILABLE")
    ) {
      locationContext = null;
    } else {
      throw error;
    }
  }

  return (
    <header className="sticky top-4 z-30 rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 shadow-sm backdrop-blur md:px-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 md:flex-row md:items-center">
          <div className="w-full md:max-w-md">
            <label htmlFor="global-search" className="sr-only">
              Global search
            </label>
            <input
              id="global-search"
              type="search"
              placeholder="Search phone, customer, vehicle..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none ring-offset-2 placeholder:text-slate-500 focus:border-slate-400 focus:ring-2 focus:ring-slate-300"
            />
          </div>

          {locationContext ? (
            <LocationSwitcher
              activeLocation={locationContext.activeLocation}
              locations={locationContext.locations}
            />
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="inline-flex rounded-md bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
                Location
              </span>
              <span className="text-sm font-semibold text-slate-900">Main Shop</span>
            </div>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Alex Rivera
          <span className="ml-2 text-slate-400">Manager</span>
        </button>
      </div>
    </header>
  );
}
