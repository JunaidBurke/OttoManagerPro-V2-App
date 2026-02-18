import assert from "node:assert/strict";
import test from "node:test";
import { formatPhoneForDisplay, toPhoneDigits } from "../lib/customers/phone.ts";
import { validateCreateCustomerFormData } from "../lib/customers/create-customer.ts";

function buildFormData(input: { name?: string; phone?: string }): FormData {
  const formData = new FormData();

  if (typeof input.name === "string") {
    formData.set("name", input.name);
  }

  if (typeof input.phone === "string") {
    formData.set("phone", input.phone);
  }

  return formData;
}

test("phone helpers strip symbols and format US numbers", () => {
  assert.equal(toPhoneDigits("(415) 555-0123"), "4155550123");
  assert.equal(formatPhoneForDisplay("4155550123"), "(415) 555-0123");
});

test("customer create validator accepts name + phone and normalizes output", () => {
  const result = validateCreateCustomerFormData(
    buildFormData({
      name: "Jordan Miles",
      phone: "(415) 555-0123"
    })
  );

  assert.ok(result.value);
  assert.equal(result.value?.name, "Jordan Miles");
  assert.equal(result.value?.phoneDigits, "4155550123");
  assert.equal(result.value?.phone, "(415) 555-0123");
  assert.deepEqual(result.fieldErrors, {});
});

test("customer create validator rejects invalid fields", () => {
  const result = validateCreateCustomerFormData(
    buildFormData({
      name: " ",
      phone: "12"
    })
  );

  assert.equal(result.value, null);
  assert.equal(result.fieldErrors.name, "Customer name is required.");
  assert.equal(
    result.fieldErrors.phone,
    "Enter a valid phone number with 7 to 15 digits."
  );
});
