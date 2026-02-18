import Link from "next/link";
import { switchActiveLocation } from "@/app/actions/location-switcher";
import type { OrgLocation } from "@/lib/location/types";
import { cn } from "@/lib/utils";

type LocationSwitcherProps = {
  activeLocation: OrgLocation | null;
  locations: OrgLocation[];
};

export function LocationSwitcher({
  activeLocation,
  locations
}: LocationSwitcherProps) {
  const activeLocationName = activeLocation?.name ?? "Main Shop";

  return (
    <details className="group relative">
      <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 [&::-webkit-details-marker]:hidden">
        <span className="inline-flex rounded-md bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
          Location
        </span>
        <span>{activeLocationName}</span>
        <span className="text-slate-400 transition-transform group-open:rotate-180">▾</span>
      </summary>

      <div className="absolute right-0 z-40 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
        <p className="px-2 py-1 text-xs font-semibold tracking-[0.04em] text-slate-500">
          Select Active Location
        </p>

        <div className="mt-1 space-y-1">
          {locations.length === 0 ? (
            <p className="rounded-lg bg-slate-50 px-2 py-3 text-xs text-slate-600">
              No locations found for this organization.
            </p>
          ) : (
            locations.map((location) => (
              <form key={location.id} action={switchActiveLocation}>
                <input type="hidden" name="locationId" value={location.id} />
                <button
                  type="submit"
                  disabled={!location.isActive}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm transition-colors",
                    location.id === activeLocation?.id
                      ? "bg-slate-900 text-slate-50"
                      : "text-slate-700 hover:bg-slate-100",
                    !location.isActive && "cursor-not-allowed opacity-60"
                  )}
                >
                  <span className="truncate">{location.name}</span>
                  <span
                    className={cn(
                      "ml-3 inline-flex h-2.5 w-2.5 rounded-full",
                      location.id === activeLocation?.id
                        ? "bg-emerald-300"
                        : "bg-slate-300"
                    )}
                  />
                </button>
              </form>
            ))
          )}
        </div>

        <Link
          href="/settings/locations"
          className="mt-2 block rounded-lg border border-slate-200 px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Create location
        </Link>
      </div>
    </details>
  );
}
