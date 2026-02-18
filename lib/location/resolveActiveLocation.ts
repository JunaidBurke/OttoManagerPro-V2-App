import type { OrgLocation } from "./types";

type ResolveActiveLocationInput = {
  locations: OrgLocation[];
  cookieLocationId: string | null;
};

function normalizeLocationName(value: string): string {
  return value.trim().toLowerCase();
}

function isMainShop(location: OrgLocation): boolean {
  return normalizeLocationName(location.name) === "main shop";
}

function getFirstActiveLocation(locations: OrgLocation[]): OrgLocation | null {
  for (const location of locations) {
    if (location.isActive) {
      return location;
    }
  }

  return null;
}

function getDefaultLocation(locations: OrgLocation[]): OrgLocation | null {
  const mainShop = locations.find((location) => location.isActive && isMainShop(location));
  if (mainShop) {
    return mainShop;
  }

  const firstActive = getFirstActiveLocation(locations);
  if (firstActive) {
    return firstActive;
  }

  return locations[0] ?? null;
}

export function resolveActiveLocation({
  locations,
  cookieLocationId
}: ResolveActiveLocationInput): OrgLocation | null {
  if (locations.length === 0) {
    return null;
  }

  if (cookieLocationId) {
    const locationFromCookie = locations.find(
      (location) => location.id === cookieLocationId && location.isActive
    );
    if (locationFromCookie) {
      return locationFromCookie;
    }
  }

  return getDefaultLocation(locations);
}
