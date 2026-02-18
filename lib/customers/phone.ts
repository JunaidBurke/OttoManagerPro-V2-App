const NON_DIGIT_PATTERN = /\D+/g;

export function toPhoneDigits(value: string): string {
  return value.replace(NON_DIGIT_PATTERN, "");
}

export function formatPhoneForDisplay(value: string): string {
  const digits = toPhoneDigits(value);

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    const local = digits.slice(1);
    return `+1 (${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
  }

  if (digits.length === 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  return digits;
}
