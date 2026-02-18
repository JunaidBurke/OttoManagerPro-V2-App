import { TenantContextError } from "./errors.ts";
import { getClerkTenantSnapshot } from "./getClerkTenantSnapshot.ts";
import type {
  TenantContext,
  TenantContextSource,
  TenantRole
} from "./types.ts";

const ROLE_ALIASES: Record<string, TenantRole> = {
  "org:owner": "org:owner",
  owner: "org:owner",
  "org:manager": "org:manager",
  manager: "org:manager",
  "org:staff": "org:staff",
  staff: "org:staff"
};

const LOCATION_CLAIM_PATHS: ReadonlyArray<ReadonlyArray<string>> = [
  ["metadata", "activeLocationId"],
  ["metadata", "locationId"],
  ["publicMetadata", "activeLocationId"],
  ["publicMetadata", "locationId"],
  ["activeLocationId"],
  ["locationId"]
];

export type GetTenantContextOptions = {
  requireLocation?: boolean;
  source?: TenantContextSource;
};

function normalizeRole(role: string | null): TenantRole | null {
  if (!role) {
    return null;
  }

  return ROLE_ALIASES[role.trim().toLowerCase()] ?? null;
}

function getStringClaim(
  claims: Record<string, unknown> | null,
  path: ReadonlyArray<string>
): string | null {
  if (!claims) {
    return null;
  }

  let current: unknown = claims;
  for (const segment of path) {
    if (current === null || typeof current !== "object" || Array.isArray(current)) {
      return null;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  if (typeof current !== "string") {
    return null;
  }

  const trimmed = current.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function resolveLocationId(claims: Record<string, unknown> | null): string | null {
  for (const path of LOCATION_CLAIM_PATHS) {
    const value = getStringClaim(claims, path);
    if (value) {
      return value;
    }
  }

  return null;
}

export async function getTenantContext(
  options: GetTenantContextOptions = {}
): Promise<TenantContext> {
  const source = options.source ?? getClerkTenantSnapshot;
  const tenantSnapshot = await source();

  if (!tenantSnapshot.userId) {
    throw new TenantContextError(
      "UNAUTHENTICATED",
      "A signed-in user is required to resolve tenant context."
    );
  }

  if (!tenantSnapshot.organizationId) {
    throw new TenantContextError(
      "MISSING_ORGANIZATION",
      "An active organization is required."
    );
  }

  const role = normalizeRole(tenantSnapshot.orgRole);
  if (!role) {
    throw new TenantContextError(
      "FORBIDDEN_ROLE",
      "The user's organization role is not authorized for OttoManagerPro."
    );
  }

  const locationId = resolveLocationId(tenantSnapshot.sessionClaims);
  if (options.requireLocation && !locationId) {
    throw new TenantContextError(
      "MISSING_LOCATION",
      "An active location is required for this operation."
    );
  }

  return {
    userId: tenantSnapshot.userId,
    organizationId: tenantSnapshot.organizationId,
    locationId,
    role
  };
}

export function requireOwner(context: TenantContext): TenantContext {
  if (context.role !== "org:owner") {
    throw new TenantContextError(
      "FORBIDDEN_ROLE",
      "Owner role is required for this operation."
    );
  }

  return context;
}

export function requireManagerOrOwner(context: TenantContext): TenantContext {
  if (context.role !== "org:owner" && context.role !== "org:manager") {
    throw new TenantContextError(
      "FORBIDDEN_ROLE",
      "Manager or owner role is required for this operation."
    );
  }

  return context;
}
