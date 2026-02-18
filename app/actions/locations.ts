"use server";

import { prisma } from "@/lib/prisma";
import {
  getTenantContext,
  requireManagerOrOwner
} from "@/lib/tenant/getTenantContext";

export type CreateLocationInput = {
  name: string;
  address?: string | null;
};

export type LocationSummary = {
  id: string;
  organizationId: string;
  name: string;
  address: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function normalizeName(value: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) {
    throw new Error("Location name is required.");
  }

  if (normalized.length > 120) {
    throw new Error("Location name must be 120 characters or less.");
  }

  return normalized;
}

function normalizeAddress(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

async function requireExistingOrganization(organizationId: string): Promise<void> {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { id: true }
  });

  if (!organization) {
    throw new Error(
      "Organization is missing in the database. Create the organization record before creating locations."
    );
  }
}

export async function createLocation(
  input: CreateLocationInput
): Promise<LocationSummary> {
  const tenantContext = await getTenantContext();
  requireManagerOrOwner(tenantContext);
  await requireExistingOrganization(tenantContext.organizationId);

  return prisma.location.create({
    data: {
      organizationId: tenantContext.organizationId,
      name: normalizeName(input.name),
      address: normalizeAddress(input.address),
      isActive: true
    },
    select: {
      id: true,
      organizationId: true,
      name: true,
      address: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

export async function listLocations(): Promise<LocationSummary[]> {
  const tenantContext = await getTenantContext();

  return prisma.location.findMany({
    where: {
      organizationId: tenantContext.organizationId
    },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    select: {
      id: true,
      organizationId: true,
      name: true,
      address: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });
}
