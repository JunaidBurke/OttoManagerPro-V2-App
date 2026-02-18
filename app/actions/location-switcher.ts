"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getTenantContext } from "@/lib/tenant/getTenantContext";
import { OTTO_LOCATION_COOKIE_NAME } from "@/lib/location/types";

function parseLocationId(formData: FormData): string {
  const rawValue = formData.get("locationId");
  if (typeof rawValue !== "string") {
    throw new Error("Location selection is required.");
  }

  const locationId = rawValue.trim();
  if (locationId.length === 0) {
    throw new Error("Location selection is required.");
  }

  return locationId;
}

export async function switchActiveLocation(formData: FormData): Promise<void> {
  const tenantContext = await getTenantContext();
  const locationId = parseLocationId(formData);

  const matchedLocation = await prisma.location.findFirst({
    where: {
      id: locationId,
      organizationId: tenantContext.organizationId,
      isActive: true
    },
    select: {
      id: true
    }
  });

  if (!matchedLocation) {
    throw new Error("Invalid location selection for the active organization.");
  }

  const cookieStore = await cookies();
  cookieStore.set(OTTO_LOCATION_COOKIE_NAME, matchedLocation.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365
  });

  revalidatePath("/", "layout");
}
