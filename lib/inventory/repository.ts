import type { InventoryCondition as PrismaInventoryCondition } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { enforceInventoryWriteScope, inventoryScopeWhere } from "./scope";
import type {
  CreateInventoryInput,
  InventoryListItem,
  InventoryScope,
  UpdateInventoryQtyInput
} from "./types";

function toPrismaCondition(condition: CreateInventoryInput["condition"]): PrismaInventoryCondition {
  return condition === "New" ? "NEW" : "USED";
}

function fromPrismaCondition(condition: PrismaInventoryCondition): CreateInventoryInput["condition"] {
  return condition === "NEW" ? "New" : "Used";
}

function toPriceCents(price: number): number {
  return Math.round(price * 100);
}

function fromPriceCents(priceCents: number): number {
  return priceCents / 100;
}

function toInventoryListItem(row: {
  id: string;
  item: string;
  condition: PrismaInventoryCondition;
  size: string;
  priceCents: number;
  qty: number;
  updatedAt: Date;
}): InventoryListItem {
  return {
    id: row.id,
    item: row.item,
    condition: fromPrismaCondition(row.condition),
    size: row.size,
    price: fromPriceCents(row.priceCents),
    qty: row.qty,
    updatedAt: row.updatedAt
  };
}

const inventorySelect = {
  id: true,
  item: true,
  condition: true,
  size: true,
  priceCents: true,
  qty: true,
  updatedAt: true
} as const;

export async function listInventoryByScope(scope: InventoryScope): Promise<InventoryListItem[]> {
  const rows = await prisma.inventoryItem.findMany({
    where: inventoryScopeWhere(scope),
    orderBy: [{ item: "asc" }, { updatedAt: "desc" }],
    select: inventorySelect
  });

  return rows.map(toInventoryListItem);
}

export async function createInventoryByScope(
  scope: InventoryScope,
  input: CreateInventoryInput
): Promise<InventoryListItem> {
  const data = enforceInventoryWriteScope(
    {
      item: input.item,
      condition: toPrismaCondition(input.condition),
      size: input.size,
      priceCents: toPriceCents(input.price),
      qty: input.qty
    },
    scope
  );

  const row = await prisma.inventoryItem.create({
    data,
    select: inventorySelect
  });

  return toInventoryListItem(row);
}

export async function updateInventoryQtyByScope(
  scope: InventoryScope,
  input: UpdateInventoryQtyInput
): Promise<InventoryListItem | null> {
  const updateResult = await prisma.inventoryItem.updateMany({
    where: {
      id: input.id,
      ...inventoryScopeWhere(scope)
    },
    data: {
      qty: input.qty
    }
  });

  if (updateResult.count === 0) {
    return null;
  }

  const row = await prisma.inventoryItem.findFirst({
    where: {
      id: input.id,
      ...inventoryScopeWhere(scope)
    },
    select: inventorySelect
  });

  return row ? toInventoryListItem(row) : null;
}
