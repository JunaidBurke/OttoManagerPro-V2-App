export const TENANT_ROLES = ["org:owner", "org:manager", "org:staff"] as const;

export type TenantRole = (typeof TENANT_ROLES)[number];

export type TenantContext = {
  userId: string;
  organizationId: string;
  locationId: string | null;
  role: TenantRole;
};

export type TenantSnapshot = {
  userId: string | null;
  organizationId: string | null;
  orgRole: string | null;
  sessionClaims: Record<string, unknown> | null;
};

export type TenantContextSource = () => Promise<TenantSnapshot>;
