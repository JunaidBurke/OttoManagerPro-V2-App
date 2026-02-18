import type { InventoryScope } from "./types";

export type InventoryScopedRecord = {
  organizationId: string;
  locationId: string;
};

export function inventoryScopeWhere(scope: InventoryScope): InventoryScope {
  return {
    organizationId: scope.organizationId,
    locationId: scope.locationId
  };
}

export function readInventoryScoped<T extends InventoryScopedRecord>(
  records: readonly T[],
  scope: InventoryScope
): T[] {
  return records.filter(
    (record) =>
      record.organizationId === scope.organizationId &&
      record.locationId === scope.locationId
  );
}

type ScopedClientInput = Partial<InventoryScope> & Record<string, unknown>;

export function enforceInventoryWriteScope<T extends ScopedClientInput>(
  input: T,
  scope: InventoryScope
): Omit<T, keyof InventoryScope> & InventoryScope {
  const unsafeRest = { ...input };
  delete unsafeRest.organizationId;
  delete unsafeRest.locationId;

  return {
    ...(unsafeRest as Omit<T, keyof InventoryScope>),
    organizationId: scope.organizationId,
    locationId: scope.locationId
  };
}

export function canUpdateInventoryRecord(
  record: InventoryScopedRecord,
  scope: InventoryScope
): boolean {
  return (
    record.organizationId === scope.organizationId &&
    record.locationId === scope.locationId
  );
}
