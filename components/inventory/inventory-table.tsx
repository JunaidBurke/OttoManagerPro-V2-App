"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { createInventoryQuickAddAction } from "@/app/actions/inventory";
import {
  QUICK_ADD_INVENTORY_INITIAL_STATE,
  type QuickAddInventoryFormState
} from "@/lib/inventory/quick-add";
import type { InventoryListItem } from "@/lib/inventory/types";
import { cn } from "@/lib/utils";

type InventoryTableProps = {
  rows: InventoryListItem[];
  activeLocationName: string;
};

function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

function matchRow(row: InventoryListItem, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length === 0) {
    return true;
  }

  return (
    row.item.toLowerCase().includes(normalizedQuery) ||
    row.condition.toLowerCase().includes(normalizedQuery) ||
    row.size.toLowerCase().includes(normalizedQuery)
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-1 text-xs text-red-700">{message}</p>;
}

function QuickAddSubmitButton() {
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
      {pending ? "Adding..." : "Add Inventory"}
    </button>
  );
}

function QuickAddFormFeedback({ state }: { state: QuickAddInventoryFormState }) {
  if (!state.message) {
    return null;
  }

  return (
    <p
      className={cn(
        "text-sm",
        state.status === "success" ? "text-emerald-700" : "text-red-700"
      )}
    >
      {state.message}
    </p>
  );
}

export function InventoryTable({ rows, activeLocationName }: InventoryTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [formState, formAction] = useActionState(
    createInventoryQuickAddAction,
    QUICK_ADD_INVENTORY_INITIAL_STATE
  );
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (formState.status === "success") {
      formRef.current?.reset();
      router.refresh();
    }
  }, [formState.status, router]);

  const filteredRows = useMemo(
    () => rows.filter((row) => matchRow(row, searchQuery)),
    [rows, searchQuery]
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-slate-900">Inventory List</h2>
        <p className="text-sm text-slate-600">
          Search by tire name, condition, or size for quick front-desk lookup.
        </p>
        <p className="text-xs font-semibold tracking-[0.04em] text-slate-500">
          ACTIVE LOCATION: {activeLocationName}
        </p>
      </div>

      <form ref={formRef} action={formAction} className="mt-5 space-y-3 rounded-xl border border-slate-200 p-3">
        <div className="grid gap-3 lg:grid-cols-5">
          <div>
            <label htmlFor="quick-add-item" className="text-xs font-semibold text-slate-700">
              Item
            </label>
            <input
              id="quick-add-item"
              name="item"
              type="text"
              placeholder="Michelin Defender 2"
              className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none ring-offset-2 placeholder:text-slate-500 focus:border-slate-400 focus:ring-2 focus:ring-slate-300"
              aria-invalid={formState.fieldErrors.item ? true : undefined}
            />
            <FieldError message={formState.fieldErrors.item} />
          </div>

          <div>
            <label htmlFor="quick-add-condition" className="text-xs font-semibold text-slate-700">
              Condition
            </label>
            <select
              id="quick-add-condition"
              name="condition"
              defaultValue="New"
              className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none ring-offset-2 focus:border-slate-400 focus:ring-2 focus:ring-slate-300"
              aria-invalid={formState.fieldErrors.condition ? true : undefined}
            >
              <option value="New">New</option>
              <option value="Used">Used</option>
            </select>
            <FieldError message={formState.fieldErrors.condition} />
          </div>

          <div>
            <label htmlFor="quick-add-size" className="text-xs font-semibold text-slate-700">
              Size
            </label>
            <input
              id="quick-add-size"
              name="size"
              type="text"
              placeholder="205/55R16"
              className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none ring-offset-2 placeholder:text-slate-500 focus:border-slate-400 focus:ring-2 focus:ring-slate-300"
              aria-invalid={formState.fieldErrors.size ? true : undefined}
            />
            <FieldError message={formState.fieldErrors.size} />
          </div>

          <div>
            <label htmlFor="quick-add-price" className="text-xs font-semibold text-slate-700">
              Price
            </label>
            <input
              id="quick-add-price"
              name="price"
              type="number"
              min="0.01"
              max="999999.99"
              step="0.01"
              placeholder="139.99"
              className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none ring-offset-2 placeholder:text-slate-500 focus:border-slate-400 focus:ring-2 focus:ring-slate-300"
              aria-invalid={formState.fieldErrors.price ? true : undefined}
            />
            <FieldError message={formState.fieldErrors.price} />
          </div>

          <div>
            <label htmlFor="quick-add-qty" className="text-xs font-semibold text-slate-700">
              Qty
            </label>
            <input
              id="quick-add-qty"
              name="qty"
              type="number"
              min="1"
              step="1"
              placeholder="12"
              className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none ring-offset-2 placeholder:text-slate-500 focus:border-slate-400 focus:ring-2 focus:ring-slate-300"
              aria-invalid={formState.fieldErrors.qty ? true : undefined}
            />
            <FieldError message={formState.fieldErrors.qty} />
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <QuickAddSubmitButton />
          <QuickAddFormFeedback state={formState} />
        </div>
      </form>

      <div className="mt-5 w-full sm:w-72">
        <label htmlFor="inventory-search" className="sr-only">
          Search inventory
        </label>
        <input
          id="inventory-search"
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search item, condition, or size..."
          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none ring-offset-2 placeholder:text-slate-500 focus:border-slate-400 focus:ring-2 focus:ring-slate-300"
        />
      </div>

      {filteredRows.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
          <p className="text-base font-semibold text-slate-900">No inventory items found</p>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
            Try a different search term or add tire inventory to this location.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-4 hidden overflow-x-auto md:block">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-semibold tracking-[0.04em] text-slate-500">
                  <th className="px-3 py-3">Item</th>
                  <th className="px-3 py-3">Condition</th>
                  <th className="px-3 py-3">Size</th>
                  <th className="px-3 py-3">Price</th>
                  <th className="px-3 py-3">Qty</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <td className="px-3 py-3 font-medium text-slate-900">{row.item}</td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                          row.condition === "New"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        )}
                      >
                        {row.condition}
                      </span>
                    </td>
                    <td className="px-3 py-3">{row.size}</td>
                    <td className="px-3 py-3 font-medium text-slate-900">{formatPrice(row.price)}</td>
                    <td className="px-3 py-3">{row.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 space-y-3 md:hidden">
            {filteredRows.map((row) => (
              <article
                key={row.id}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{row.item}</p>
                    <p className="mt-1 text-xs text-slate-600">{row.size}</p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                      row.condition === "New"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    )}
                  >
                    {row.condition}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <p className="text-slate-700">Price: {formatPrice(row.price)}</p>
                  <p className="font-medium text-slate-900">Qty: {row.qty}</p>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
