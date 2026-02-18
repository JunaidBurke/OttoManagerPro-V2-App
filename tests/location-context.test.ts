import assert from "node:assert/strict";
import test from "node:test";
import { resolveActiveLocation } from "../lib/location/resolveActiveLocation.ts";
import type { OrgLocation } from "../lib/location/types.ts";

const LOCATIONS: OrgLocation[] = [
  { id: "loc_main", name: "Main Shop", isActive: true },
  { id: "loc_north", name: "North Shop", isActive: true },
  { id: "loc_old", name: "Old Shop", isActive: false }
];

test("uses cookie location when it belongs to the org location list", () => {
  const activeLocation = resolveActiveLocation({
    locations: LOCATIONS,
    cookieLocationId: "loc_north"
  });

  assert.equal(activeLocation?.id, "loc_north");
});

test("falls back to Main Shop when cookie location is invalid", () => {
  const activeLocation = resolveActiveLocation({
    locations: LOCATIONS,
    cookieLocationId: "loc_unknown"
  });

  assert.equal(activeLocation?.id, "loc_main");
});

test("falls back to first active location when Main Shop does not exist", () => {
  const activeLocation = resolveActiveLocation({
    locations: [
      { id: "loc_east", name: "East Shop", isActive: true },
      { id: "loc_west", name: "West Shop", isActive: true }
    ],
    cookieLocationId: null
  });

  assert.equal(activeLocation?.id, "loc_east");
});
