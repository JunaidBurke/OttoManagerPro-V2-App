import { NextResponse } from "next/server";
import {
  searchCustomersByScope,
  toCustomerQuickSummary
} from "@/lib/customers/repository";
import { TenantContextError } from "@/lib/tenant/errors";
import { getTenantContext } from "@/lib/tenant/getTenantContext";

function parseLimit(raw: string | null): number {
  if (!raw) {
    return 8;
  }

  const limit = Number(raw);
  if (!Number.isFinite(limit)) {
    return 8;
  }

  return Math.trunc(limit);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ?? "";
    const limit = parseLimit(searchParams.get("limit"));

    const tenantContext = await getTenantContext();
    const customers = await searchCustomersByScope({
      scope: {
        organizationId: tenantContext.organizationId
      },
      query,
      limit
    });

    return NextResponse.json(
      {
        items: customers.map(toCustomerQuickSummary)
      },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } catch (error) {
    if (
      error instanceof TenantContextError &&
      (error.code === "UNAUTHENTICATED" ||
        error.code === "MISSING_ORGANIZATION" ||
        error.code === "CLERK_UNAVAILABLE")
    ) {
      return NextResponse.json(
        {
          items: [],
          error: "Tenant context unavailable."
        },
        { status: 401 }
      );
    }

    throw error;
  }
}
