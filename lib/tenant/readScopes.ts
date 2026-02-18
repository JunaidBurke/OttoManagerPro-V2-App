export type OrganizationScopedRecord = {
  organizationId: string;
};

export type LocationScopedRecord = OrganizationScopedRecord & {
  locationId: string;
};

export type OrganizationScope = {
  organizationId: string;
};

export type LocationScope = {
  organizationId: string;
  locationId: string;
};

export function readOrganizationScoped<T extends OrganizationScopedRecord>(
  records: readonly T[],
  scope: OrganizationScope
): T[] {
  return records.filter((record) => record.organizationId === scope.organizationId);
}

export function readLocationScoped<T extends LocationScopedRecord>(
  records: readonly T[],
  scope: LocationScope
): T[] {
  return records.filter(
    (record) =>
      record.organizationId === scope.organizationId &&
      record.locationId === scope.locationId
  );
}
