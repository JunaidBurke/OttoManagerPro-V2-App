"use server";

import { revalidatePath } from "next/cache";
import { getTenantContext } from "@/lib/tenant/getTenantContext";
import {
  CREATE_CUSTOMER_INITIAL_STATE,
  type CreateCustomerFormState,
  validateCreateCustomerFormData
} from "@/lib/customers/create-customer";
import {
  createCustomerByScope,
  toCustomerQuickSummary
} from "@/lib/customers/repository";

function toCreateCustomerErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to create the customer.";
}

export async function createCustomerQuickAction(
  _previousState: CreateCustomerFormState,
  formData: FormData
): Promise<CreateCustomerFormState> {
  const validation = validateCreateCustomerFormData(formData);
  if (!validation.value) {
    return {
      status: "error",
      message: "Fix the highlighted fields and try again.",
      fieldErrors: validation.fieldErrors,
      createdCustomer: null
    };
  }

  try {
    const tenantContext = await getTenantContext();
    const created = await createCustomerByScope(
      {
        organizationId: tenantContext.organizationId
      },
      validation.value
    );

    revalidatePath("/customers");

    return {
      status: "success",
      message: `Created ${created.name}.`,
      fieldErrors: {},
      createdCustomer: toCustomerQuickSummary(created)
    };
  } catch (error) {
    return {
      status: "error",
      message: toCreateCustomerErrorMessage(error),
      fieldErrors: {},
      createdCustomer: null
    };
  }
}

export { CREATE_CUSTOMER_INITIAL_STATE };
