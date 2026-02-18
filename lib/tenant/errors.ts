export const TENANT_CONTEXT_ERROR_CODES = [
  "UNAUTHENTICATED",
  "MISSING_ORGANIZATION",
  "MISSING_LOCATION",
  "FORBIDDEN_ROLE",
  "CLERK_UNAVAILABLE"
] as const;

export type TenantContextErrorCode = (typeof TENANT_CONTEXT_ERROR_CODES)[number];

export class TenantContextError extends Error {
  readonly code: TenantContextErrorCode;

  constructor(
    code: TenantContextErrorCode,
    message: string,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.code = code;
    this.name = "TenantContextError";
  }
}
