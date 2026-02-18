"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import {
  CREATE_CUSTOMER_INITIAL_STATE,
  createCustomerQuickAction
} from "@/app/actions/customers";
import { formatPhoneForDisplay, toPhoneDigits } from "@/lib/customers/phone";
import type { CustomerQuickSummary } from "@/lib/customers/types";
import { cn } from "@/lib/utils";

type CustomerSearchFlowProps = {
  initialCustomers: CustomerQuickSummary[];
};

type SearchState = "idle" | "searching" | "ready" | "error";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-1 text-xs text-red-700">{message}</p>;
}

function CreateCustomerSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium",
        pending
          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
          : "border-slate-900 bg-slate-900 text-slate-50 hover:bg-slate-800"
      )}
    >
      {pending ? "Creating..." : "Create customer"}
    </button>
  );
}

function formatLastVisitBadge(lastVisitAt: string | null): {
  label: string;
  tone: "fresh" | "aging" | "none";
} {
  if (!lastVisitAt) {
    return {
      label: "No visits yet",
      tone: "none"
    };
  }

  const visitDate = new Date(lastVisitAt);
  if (Number.isNaN(visitDate.valueOf())) {
    return {
      label: "Visit date unavailable",
      tone: "none"
    };
  }

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const daysAgo = Math.max(0, Math.floor((Date.now() - visitDate.valueOf()) / millisecondsPerDay));

  if (daysAgo === 0) {
    return {
      label: "Visited today",
      tone: "fresh"
    };
  }

  if (daysAgo === 1) {
    return {
      label: "Visited yesterday",
      tone: "fresh"
    };
  }

  if (daysAgo < 30) {
    return {
      label: `Visited ${daysAgo}d ago`,
      tone: "fresh"
    };
  }

  if (daysAgo < 365) {
    return {
      label: `Visited ${Math.floor(daysAgo / 30)}mo ago`,
      tone: "aging"
    };
  }

  return {
    label: `Visited ${Math.floor(daysAgo / 365)}y ago`,
    tone: "aging"
  };
}

export function CustomerSearchFlow({ initialCustomers }: CustomerSearchFlowProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<CustomerQuickSummary[]>(initialCustomers);
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const [formState, formAction] = useActionState(
    createCustomerQuickAction,
    CREATE_CUSTOMER_INITIAL_STATE
  );
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length === 0) {
      setResults(initialCustomers);
      setSearchState("idle");
      setSearchError(null);
      return;
    }

    const controller = new AbortController();

    const timeoutId = window.setTimeout(async () => {
      setSearchState("searching");
      setSearchError(null);

      try {
        const response = await fetch(
          `/api/customers/search?q=${encodeURIComponent(trimmed)}&limit=8`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal
          }
        );

        if (!response.ok) {
          let message = "Unable to search customers.";

          try {
            const payload = (await response.json()) as { error?: unknown };
            if (typeof payload.error === "string" && payload.error.trim().length > 0) {
              message = payload.error;
            }
          } catch {
            // Intentionally ignore JSON parse failures for non-JSON responses.
          }

          throw new Error(message);
        }

        const payload = (await response.json()) as {
          items?: CustomerQuickSummary[];
        };

        setResults(Array.isArray(payload.items) ? payload.items : []);
        setSearchState("ready");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setSearchState("error");
        setSearchError(
          error instanceof Error ? error.message : "Unable to search customers."
        );
      }
    }, 120);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [initialCustomers, searchQuery]);

  useEffect(() => {
    if (formState.status !== "success" || !formState.createdCustomer) {
      return;
    }

    const created = formState.createdCustomer;
    formRef.current?.reset();
    setSelectedCustomerId(created.id);
    setSearchQuery(created.phone);
    setResults((previous) => [
      created,
      ...previous.filter((customer) => customer.id !== created.id)
    ]);
    router.refresh();
  }, [formState, router]);

  const hasQuery = searchQuery.trim().length > 0;
  const hasNoMatches =
    hasQuery &&
    searchState !== "searching" &&
    searchState !== "error" &&
    results.length === 0;

  const selectedCustomer = useMemo(() => {
    if (!selectedCustomerId) {
      return null;
    }

    return (
      results.find((customer) => customer.id === selectedCustomerId) ??
      initialCustomers.find((customer) => customer.id === selectedCustomerId) ??
      null
    );
  }, [initialCustomers, results, selectedCustomerId]);

  function handleCreateFromQuery() {
    const trimmed = searchQuery.trim();
    const digits = toPhoneDigits(trimmed);

    if (digits.length > 0 && phoneInputRef.current) {
      phoneInputRef.current.value = formatPhoneForDisplay(digits);
      nameInputRef.current?.focus();
      return;
    }

    if (trimmed.length > 0 && nameInputRef.current) {
      nameInputRef.current.value = trimmed;
      phoneInputRef.current?.focus();
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Customer lookup
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Start with phone search, then pick the customer and continue to the next step.
          </p>

          <div className="mt-4">
            <label htmlFor="customer-search" className="sr-only">
              Search by phone or name
            </label>
            <input
              id="customer-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              autoComplete="off"
              placeholder="Search phone first, or name..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none ring-offset-2 placeholder:text-slate-500 focus:border-slate-400 focus:ring-2 focus:ring-slate-300"
            />
            <div className="mt-2 flex min-h-5 items-center">
              {searchState === "searching" ? (
                <p className="text-xs text-slate-500">Searching...</p>
              ) : null}
              {searchState === "error" && searchError ? (
                <p className="text-xs text-red-700">{searchError}</p>
              ) : null}
            </div>
          </div>

          {results.length === 0 && !hasQuery ? (
            <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
              <p className="text-sm font-semibold text-slate-900">
                No customers yet
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Create your first customer to speed up walk-in and phone workflows.
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {results.map((customer) => {
                const lastVisit = formatLastVisitBadge(customer.lastVisitAt);
                const isSelected = customer.id === selectedCustomerId;

                return (
                  <article
                    key={customer.id}
                    className={cn(
                      "rounded-xl border px-4 py-3 transition-colors",
                      isSelected
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-900">
                          {customer.name}
                        </p>
                        <p className="text-sm text-slate-700">{customer.phone}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                            lastVisit.tone === "fresh" &&
                              "bg-emerald-100 text-emerald-700",
                            lastVisit.tone === "aging" &&
                              "bg-amber-100 text-amber-700",
                            lastVisit.tone === "none" &&
                              "bg-slate-100 text-slate-600"
                          )}
                        >
                          {lastVisit.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedCustomerId(customer.id)}
                          className={cn(
                            "inline-flex h-8 items-center justify-center rounded-lg border px-3 text-xs font-semibold",
                            isSelected
                              ? "border-emerald-300 bg-white text-emerald-700"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                          )}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {hasNoMatches ? (
            <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4">
              <p className="text-sm font-semibold text-slate-900">
                No customer found for &quot;{searchQuery.trim()}&quot;.
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Create a customer now to continue this front-desk flow without leaving the page.
              </p>
              <button
                type="button"
                onClick={handleCreateFromQuery}
                className="mt-3 inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Create customer
              </button>
            </div>
          ) : null}
        </div>

        <aside className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <h3 className="text-base font-semibold text-slate-900">Quick create</h3>
          <p className="mt-1 text-sm text-slate-600">
            Keep it short: customer name + phone.
          </p>

          <form ref={formRef} action={formAction} className="mt-4 space-y-3">
            <div>
              <label
                htmlFor="create-customer-name"
                className="text-xs font-semibold text-slate-700"
              >
                Name
              </label>
              <input
                ref={nameInputRef}
                id="create-customer-name"
                name="name"
                type="text"
                placeholder="Jordan Miles"
                className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-offset-2 placeholder:text-slate-500 focus:border-slate-400 focus:ring-2 focus:ring-slate-300"
                aria-invalid={formState.fieldErrors.name ? true : undefined}
              />
              <FieldError message={formState.fieldErrors.name} />
            </div>

            <div>
              <label
                htmlFor="create-customer-phone"
                className="text-xs font-semibold text-slate-700"
              >
                Phone
              </label>
              <input
                ref={phoneInputRef}
                id="create-customer-phone"
                name="phone"
                type="tel"
                placeholder="(555) 123-4567"
                className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-offset-2 placeholder:text-slate-500 focus:border-slate-400 focus:ring-2 focus:ring-slate-300"
                aria-invalid={formState.fieldErrors.phone ? true : undefined}
              />
              <FieldError message={formState.fieldErrors.phone} />
            </div>

            <div className="flex flex-col gap-2">
              <CreateCustomerSubmitButton />
              {formState.message ? (
                <p
                  className={cn(
                    "text-sm",
                    formState.status === "success"
                      ? "text-emerald-700"
                      : "text-red-700"
                  )}
                >
                  {formState.message}
                </p>
              ) : null}
            </div>
          </form>
        </aside>
      </div>

      {selectedCustomer ? (
        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Selected: {selectedCustomer.name}
            </p>
            <p className="text-sm text-emerald-800">{selectedCustomer.phone}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/vehicles?customerId=${selectedCustomer.id}`}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-emerald-300 bg-white px-3 text-sm font-medium text-emerald-800 hover:bg-emerald-100"
            >
              Next action
            </Link>
            <button
              type="button"
              onClick={() => setSelectedCustomerId(null)}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-emerald-300 bg-emerald-100 px-3 text-sm font-medium text-emerald-800 hover:bg-emerald-200"
            >
              Clear
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
