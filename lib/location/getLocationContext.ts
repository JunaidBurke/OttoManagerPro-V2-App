import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getTenantContext } from "@/lib/tenant/getTenantContext";
import { resolveActiveLocation } from "./resolveActiveLocation";
import type { LocationContext } from "./types";
import { OTTO_LOCATION_COOKIE_NAME } from "./types";

export async function getLocationContext(): Promise<LocationContext> {
  const tenantContext = await getTenantContext();
  const cookieStore = await cookies();
  const cookieLocationId = cookieStore.get(OTTO_LOCATION_COOKIE_NAME)?.value ?? null;

  const locations = await prisma.location.findMany({
    where: {
      organizationId: tenantContext.organizationId
    },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      isActive: true
    }
  });

  const activeLocation = resolveActiveLocation({
    locations,
    cookieLocationId
  });

  return {
    organizationId: tenantContext.organizationId,
    activeLocation,
    locations
  };
}
