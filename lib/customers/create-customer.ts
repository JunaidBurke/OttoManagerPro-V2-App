import { formatPhoneForDisplay, toPhoneDigits } from "./phone.ts";
import type { CreateCustomerInput, CustomerQuickSummary } from "./types.ts";

export type CreateCustomerFieldName = "name" | "phone";

export type CreateCustomerFieldErrors = Partial<
  Record<CreateCustomerFieldName, string>
>;

export type CreateCustomerFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: CreateCustomerFieldErrors;
  createdCustomer: CustomerQuickSummary | null;
};

export const CREATE_CUSTOMER_INITIAL_STATE: CreateCustomerFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
  createdCustomer: null
};

type ValidationResult = {
  value: CreateCustomerInput | null;
  fieldErrors: CreateCustomerFieldErrors;
};

function readString(formData: FormData, key: CreateCustomerFieldName): string {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export function validateCreateCustomerFormData(formData: FormData): ValidationResult {
  const name = readString(formData, "name");
  const phoneRaw = readString(formData, "phone");
  const phoneDigits = toPhoneDigits(phoneRaw);

  const fieldErrors: CreateCustomerFieldErrors = {};

  if (name.length === 0) {
    fieldErrors.name = "Customer name is required.";
  } else if (name.length > 120) {
    fieldErrors.name = "Customer name must be 120 characters or less.";
  }

  if (phoneDigits.length < 7 || phoneDigits.length > 15) {
    fieldErrors.phone = "Enter a valid phone number with 7 to 15 digits.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      value: null,
      fieldErrors
    };
  }

  return {
    value: {
      name,
      phone: formatPhoneForDisplay(phoneDigits),
      phoneDigits
    },
    fieldErrors: {}
  };
}
