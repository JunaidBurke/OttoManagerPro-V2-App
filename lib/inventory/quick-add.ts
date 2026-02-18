import type { CreateInventoryInput, InventoryCondition } from "./types";

export type QuickAddFieldName = "item" | "condition" | "size" | "price" | "qty";

export type QuickAddFieldErrors = Partial<Record<QuickAddFieldName, string>>;

export type QuickAddInventoryFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: QuickAddFieldErrors;
};

export const QUICK_ADD_INVENTORY_INITIAL_STATE: QuickAddInventoryFormState = {
  status: "idle",
  message: null,
  fieldErrors: {}
};

type ValidationResult = {
  value: CreateInventoryInput | null;
  fieldErrors: QuickAddFieldErrors;
};

function readString(formData: FormData, key: QuickAddFieldName): string {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function parseCondition(value: string): InventoryCondition | null {
  if (value === "New" || value === "Used") {
    return value;
  }

  return null;
}

function parsePrice(value: string): number | null {
  const price = Number(value);
  if (!Number.isFinite(price)) {
    return null;
  }

  if (price <= 0 || price >= 1000000) {
    return null;
  }

  return price;
}

function parseQty(value: string): number | null {
  const qty = Number(value);
  if (!Number.isInteger(qty)) {
    return null;
  }

  if (qty <= 0 || qty > 100000) {
    return null;
  }

  return qty;
}

export function validateQuickAddInventoryFormData(formData: FormData): ValidationResult {
  const item = readString(formData, "item");
  const conditionRaw = readString(formData, "condition");
  const size = readString(formData, "size");
  const priceRaw = readString(formData, "price");
  const qtyRaw = readString(formData, "qty");

  const fieldErrors: QuickAddFieldErrors = {};

  if (item.length === 0) {
    fieldErrors.item = "Item name is required.";
  } else if (item.length > 120) {
    fieldErrors.item = "Item name must be 120 characters or less.";
  }

  const condition = parseCondition(conditionRaw);
  if (!condition) {
    fieldErrors.condition = "Condition must be New or Used.";
  }

  if (size.length === 0) {
    fieldErrors.size = "Size is required.";
  } else if (size.length > 40) {
    fieldErrors.size = "Size must be 40 characters or less.";
  }

  const price = parsePrice(priceRaw);
  if (price === null) {
    fieldErrors.price = "Enter a valid price greater than 0.";
  }

  const qty = parseQty(qtyRaw);
  if (qty === null) {
    fieldErrors.qty = "Enter a whole-number quantity greater than 0.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      value: null,
      fieldErrors
    };
  }

  return {
    value: {
      item,
      condition: condition as InventoryCondition,
      size,
      price: price as number,
      qty: qty as number
    },
    fieldErrors: {}
  };
}
