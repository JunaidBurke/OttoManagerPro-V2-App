import { prisma } from "@/lib/prisma";
import { toPhoneDigits } from "./phone.ts";
import type {
  CreateCustomerInput,
  CustomerListItem,
  CustomerQuickSummary,
  CustomerScope
} from "./types.ts";

const customerSelect = {
  id: true,
  name: true,
  phone: true,
  phoneDigits: true,
  lastVisitAt: true,
  createdAt: true,
  updatedAt: true
} as const;

function toCustomerListItem(row: {
  id: string;
  name: string;
  phone: string;
  phoneDigits: string;
  lastVisitAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): CustomerListItem {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    phoneDigits: row.phoneDigits,
    lastVisitAt: row.lastVisitAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

function clampLimit(limit: number): number {
  if (!Number.isInteger(limit)) {
    return 8;
  }

  return Math.max(1, Math.min(limit, 20));
}

export function toCustomerQuickSummary(
  customer: CustomerListItem
): CustomerQuickSummary {
  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    phoneDigits: customer.phoneDigits,
    lastVisitAt: customer.lastVisitAt ? customer.lastVisitAt.toISOString() : null
  };
}

export async function listRecentCustomersByScope(
  scope: CustomerScope,
  limit = 8
): Promise<CustomerListItem[]> {
  const rows = await prisma.customer.findMany({
    where: {
      organizationId: scope.organizationId
    },
    orderBy: [{ updatedAt: "desc" }],
    take: clampLimit(limit),
    select: customerSelect
  });

  return rows.map(toCustomerListItem);
}

export async function searchCustomersByScope(input: {
  scope: CustomerScope;
  query: string;
  limit?: number;
}): Promise<CustomerListItem[]> {
  const normalizedQuery = input.query.trim();
  const limit = clampLimit(input.limit ?? 8);

  if (normalizedQuery.length === 0) {
    return listRecentCustomersByScope(input.scope, limit);
  }

  const phoneDigitsQuery = toPhoneDigits(normalizedQuery);
  if (phoneDigitsQuery.length === 0) {
    const rows = await prisma.customer.findMany({
      where: {
        organizationId: input.scope.organizationId,
        name: {
          contains: normalizedQuery,
          mode: "insensitive"
        }
      },
      orderBy: [{ updatedAt: "desc" }],
      take: limit,
      select: customerSelect
    });

    return rows.map(toCustomerListItem);
  }

  const phoneRows = await prisma.customer.findMany({
    where: {
      organizationId: input.scope.organizationId,
      phoneDigits: {
        startsWith: phoneDigitsQuery
      }
    },
    orderBy: [{ updatedAt: "desc" }],
    take: limit,
    select: customerSelect
  });

  if (phoneRows.length >= limit) {
    return phoneRows.map(toCustomerListItem);
  }

  const remaining = limit - phoneRows.length;
  const hasLetters = /[a-z]/i.test(normalizedQuery);
  if (!hasLetters) {
    return phoneRows.map(toCustomerListItem);
  }

  const excludedIds = phoneRows.map((row) => row.id);

  const nameRows = await prisma.customer.findMany({
    where: {
      organizationId: input.scope.organizationId,
      name: {
        contains: normalizedQuery,
        mode: "insensitive"
      },
      ...(excludedIds.length > 0
        ? {
            id: {
              notIn: excludedIds
            }
          }
        : {})
    },
    orderBy: [{ updatedAt: "desc" }],
    take: remaining,
    select: customerSelect
  });

  return [...phoneRows, ...nameRows].map(toCustomerListItem);
}

export async function createCustomerByScope(
  scope: CustomerScope,
  input: CreateCustomerInput
): Promise<CustomerListItem> {
  const existing = await prisma.customer.findUnique({
    where: {
      organizationId_phoneDigits: {
        organizationId: scope.organizationId,
        phoneDigits: input.phoneDigits
      }
    },
    select: {
      id: true
    }
  });

  if (existing) {
    throw new Error("A customer with this phone number already exists.");
  }

  const row = await prisma.customer.create({
    data: {
      organizationId: scope.organizationId,
      name: input.name,
      phone: input.phone,
      phoneDigits: input.phoneDigits
    },
    select: customerSelect
  });

  return toCustomerListItem(row);
}
