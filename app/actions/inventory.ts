"use server";

import { revalidatePath } from "next/cache";
import { resolveActiveInventoryScope } from "@/lib/inventory/active-location-scope";
import {
  createInventoryByScope,
  listInventoryByScope,
  updateInventoryQtyByScope
} from "@/lib/inventory/repository";
import {
  validateQuickAddInventoryFormData,
  type QuickAddInventoryFormState
} from "@/lib/inventory/quick-add";
import type { InventoryListItem, UpdateInventoryQtyInput } from "@/lib/inventory/types";

function toInventoryErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to complete the inventory action.";
}

export async function listInventoryForActiveLocation(): Promise<{
  locationName: string;
  items: InventoryListItem[];
}> {
  const scope = await resolveActiveInventoryScope();
  const items = await listInventoryByScope(scope);

  return {
    locationName: scope.locationName,
    items
  };
}

export async function createInventoryQuickAddAction(
  _previousState: QuickAddInventoryFormState,
  formData: FormData
): Promise<QuickAddInventoryFormState> {
  const validation = validateQuickAddInventoryFormData(formData);
  if (!validation.value) {
    return {
      status: "error",
      message: "Fix the highlighted fields and try again.",
      fieldErrors: validation.fieldErrors
    };
  }

  try {
    const scope = await resolveActiveInventoryScope();
    await createInventoryByScope(scope, validation.value);
    revalidatePath("/inventory");

    return {
      status: "success",
      message: `Added ${validation.value.item} to ${scope.locationName}.`,
      fieldErrors: {}
    };
  } catch (error) {
    return {
      status: "error",
      message: toInventoryErrorMessage(error),
      fieldErrors: {}
    };
  }
}

function normalizeQty(input: UpdateInventoryQtyInput): UpdateInventoryQtyInput {
  const id = input.id.trim();
  if (id.length === 0) {
    throw new Error("Inventory item id is required.");
  }

  if (!Number.isInteger(input.qty) || input.qty < 0) {
    throw new Error("Quantity must be a non-negative whole number.");
  }

  return {
    id,
    qty: input.qty
  };
}

export async function updateInventoryQtyAction(
  input: UpdateInventoryQtyInput
): Promise<InventoryListItem> {
  const normalizedInput = normalizeQty(input);
  const scope = await resolveActiveInventoryScope();
  const updated = await updateInventoryQtyByScope(scope, normalizedInput);

  if (!updated) {
    throw new Error("Inventory item was not found in the active location.");
  }

  revalidatePath("/inventory");
  return updated;
}
