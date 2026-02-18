import assert from "node:assert/strict";
import test from "node:test";
import {
  getTenantContext,
  requireManagerOrOwner,
  requireOwner
} from "../lib/tenant/getTenantContext.ts";
import { TenantContextError } from "../lib/tenant/errors.ts";
import type { TenantContext, TenantSnapshot } from "../lib/tenant/types.ts";

const BASE_TENANT_SNAPSHOT: TenantSnapshot = {
  userId: "user_123",
  organizationId: "org_123",
  orgRole: "org:manager",
  sessionClaims: {
    metadata: {
      activeLocationId: "loc_123"
    }
  }
};

function tenantSource(overrides: Partial<TenantSnapshot> = {}) {
  return async (): Promise<TenantSnapshot> => ({
    ...BASE_TENANT_SNAPSHOT,
    ...overrides
  });
}

function createContext(role: TenantContext["role"]): TenantContext {
  return {
    userId: "user_123",
    organizationId: "org_123",
    locationId: "loc_123",
    role
  };
}

test("orgId is required when resolving tenant context", async () => {
  await assert.rejects(
    () =>
      getTenantContext({
        source: tenantSource({ organizationId: null })
      }),
    (error: unknown) =>
      error instanceof TenantContextError &&
      error.code === "MISSING_ORGANIZATION"
  );
});

test("requireOwner blocks non-owner roles", () => {
  assert.throws(
    () => requireOwner(createContext("org:manager")),
    (error: unknown) =>
      error instanceof TenantContextError && error.code === "FORBIDDEN_ROLE"
  );
});

test("requireManagerOrOwner allows owner or manager and blocks staff", () => {
  const ownerContext = createContext("org:owner");
  const managerContext = createContext("org:manager");
  const staffContext = createContext("org:staff");

  assert.equal(requireManagerOrOwner(ownerContext), ownerContext);
  assert.equal(requireManagerOrOwner(managerContext), managerContext);
  assert.throws(
    () => requireManagerOrOwner(staffContext),
    (error: unknown) =>
      error instanceof TenantContextError && error.code === "FORBIDDEN_ROLE"
  );
});
