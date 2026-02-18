import { TenantContextError } from "./errors.ts";
import type { TenantSnapshot } from "./types.ts";

type ClerkAuthResult = {
  userId?: string | null;
  orgId?: string | null;
  orgRole?: string | null;
  sessionClaims?: unknown;
};

type ClerkServerModule = {
  auth: () => ClerkAuthResult | Promise<ClerkAuthResult>;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

async function loadClerkServerModule(): Promise<ClerkServerModule> {
  try {
    const importClerkServer = Function(
      "return import('@clerk/nextjs/server')"
    ) as () => Promise<unknown>;
    const moduleValue = (await importClerkServer()) as Partial<ClerkServerModule>;

    if (typeof moduleValue.auth !== "function") {
      throw new Error("Missing auth export from @clerk/nextjs/server.");
    }

    return moduleValue as ClerkServerModule;
  } catch (error) {
    throw new TenantContextError(
      "CLERK_UNAVAILABLE",
      "Unable to load @clerk/nextjs/server. Install and configure Clerk before resolving tenant context.",
      { cause: error instanceof Error ? error : undefined }
    );
  }
}

export async function getClerkTenantSnapshot(): Promise<TenantSnapshot> {
  const clerkServer = await loadClerkServerModule();
  const authResult = await Promise.resolve(clerkServer.auth());

  return {
    userId: authResult.userId ?? null,
    organizationId: authResult.orgId ?? null,
    orgRole: authResult.orgRole ?? null,
    sessionClaims: asRecord(authResult.sessionClaims)
  };
}
