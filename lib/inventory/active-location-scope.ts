import { getLocationContext } from "@/lib/location/getLocationContext";
import type { InventoryScope } from "./types";

type InventoryScopeErrorCode = "NO_LOCATIONS" | "NO_ACTIVE_LOCATION";

export class InventoryScopeError extends Error {
  readonly code: InventoryScopeErrorCode;

  constructor(code: InventoryScopeErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = "InventoryScopeError";
  }
}

export type ActiveInventoryScope = InventoryScope & {
  locationName: string;
};

export async function resolveActiveInventoryScope(): Promise<ActiveInventoryScope> {
  const locationContext = await getLocationContext();

  if (locationContext.locations.length === 0) {
    throw new InventoryScopeError(
      "NO_LOCATIONS",
      "At least one location is required before inventory can be used."
    );
  }

  const activeLocation = locationContext.activeLocation;
  if (!activeLocation || !activeLocation.isActive) {
    throw new InventoryScopeError(
      "NO_ACTIVE_LOCATION",
      "An active location is required before inventory can be used."
    );
  }

  return {
    organizationId: locationContext.organizationId,
    locationId: activeLocation.id,
    locationName: activeLocation.name
  };
}
