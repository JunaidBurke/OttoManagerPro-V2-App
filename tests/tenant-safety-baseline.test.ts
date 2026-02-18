import assert from "node:assert/strict";
import test from "node:test";
import {
  readLocationScoped,
  readOrganizationScoped
} from "../lib/tenant/readScopes.ts";

test("cannot read organization-scoped data from another organizationId", () => {
  const allRecords = [
    { id: "customer_1", organizationId: "org_main", name: "Main Org Customer" },
    { id: "customer_2", organizationId: "org_other", name: "Other Org Customer" }
  ];

  const visibleRecords = readOrganizationScoped(allRecords, {
    organizationId: "org_main"
  });

  assert.equal(visibleRecords.length, 1);
  assert.deepEqual(visibleRecords.map((record) => record.id), ["customer_1"]);
});

test("cannot read location-scoped data from another locationId in same org", () => {
  const allRecords = [
    {
      id: "job_a",
      organizationId: "org_main",
      locationId: "loc_front_desk",
      status: "open"
    },
    {
      id: "job_b",
      organizationId: "org_main",
      locationId: "loc_west_side",
      status: "open"
    },
    {
      id: "job_c",
      organizationId: "org_other",
      locationId: "loc_front_desk",
      status: "open"
    }
  ];

  const visibleRecords = readLocationScoped(allRecords, {
    organizationId: "org_main",
    locationId: "loc_front_desk"
  });

  assert.equal(visibleRecords.length, 1);
  assert.deepEqual(visibleRecords.map((record) => record.id), ["job_a"]);
});
