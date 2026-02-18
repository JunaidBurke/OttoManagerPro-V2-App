import assert from "node:assert/strict";
import test from "node:test";
import {
  canUpdateInventoryRecord,
  enforceInventoryWriteScope,
  readInventoryScoped
} from "../lib/inventory/scope.ts";

const SCOPE = {
  organizationId: "org_main",
  locationId: "loc_front_desk"
};

const ALL_INVENTORY = [
  {
    id: "inv_main_1",
    organizationId: "org_main",
    locationId: "loc_front_desk",
    item: "Michelin Defender 2"
  },
  {
    id: "inv_main_2",
    organizationId: "org_main",
    locationId: "loc_back_shop",
    item: "Goodyear Assurance All-Season"
  },
  {
    id: "inv_other_org_1",
    organizationId: "org_other",
    locationId: "loc_front_desk",
    item: "Bridgestone Turanza QuietTrack"
  }
];

test("cannot read inventory from another organization", () => {
  const visibleRecords = readInventoryScoped(ALL_INVENTORY, {
    organizationId: "org_main",
    locationId: "loc_front_desk"
  });

  assert.equal(visibleRecords.length, 1);
  assert.deepEqual(visibleRecords.map((record) => record.id), ["inv_main_1"]);
});

test("cannot read inventory from another location in the same organization", () => {
  const visibleRecords = readInventoryScoped(ALL_INVENTORY, SCOPE);

  assert.equal(visibleRecords.length, 1);
  assert.equal(visibleRecords[0]?.locationId, "loc_front_desk");
});

test("cannot create or update inventory outside active org/location scope", () => {
  const unsafeClientInput = {
    organizationId: "org_other",
    locationId: "loc_back_shop",
    item: "Pirelli Scorpion AS Plus 3",
    condition: "New",
    size: "235/65R18",
    priceCents: 17900,
    qty: 5
  };

  const scopedCreateData = enforceInventoryWriteScope(unsafeClientInput, SCOPE);
  assert.equal(scopedCreateData.organizationId, "org_main");
  assert.equal(scopedCreateData.locationId, "loc_front_desk");

  assert.equal(
    canUpdateInventoryRecord(
      {
        organizationId: "org_other",
        locationId: "loc_front_desk"
      },
      SCOPE
    ),
    false
  );

  assert.equal(
    canUpdateInventoryRecord(
      {
        organizationId: "org_main",
        locationId: "loc_back_shop"
      },
      SCOPE
    ),
    false
  );
});
