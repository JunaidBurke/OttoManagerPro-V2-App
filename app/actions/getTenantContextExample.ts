"use server";

import {
  getTenantContext,
  requireManagerOrOwner
} from "@/lib/tenant/getTenantContext";

type TenantContextPayload = {
  organizationId: string;
  locationId: string | null;
  role: "org:owner" | "org:manager" | "org:staff";
};

export async function getTenantContextExample(): Promise<TenantContextPayload> {
  const tenantContext = await getTenantContext();
  requireManagerOrOwner(tenantContext);

  return {
    organizationId: tenantContext.organizationId,
    locationId: tenantContext.locationId,
    role: tenantContext.role
  };
}
