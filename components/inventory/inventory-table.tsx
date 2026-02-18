"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type InventoryRow = {
  id: string;
  item: string;
  condition: "New" | "Used";
  size: string;
  price: number;
  qty: number;
};

const INVENTORY_ROWS: InventoryRow[] = [
  {
    id: "inv_1",
    item: "Michelin Defender 2",
    condition: "New",
    size: "205/55R16",
    price: 139.99,
    qty: 12
  },
  {
    id: "inv_2",
    item: "Goodyear Assurance All-Season",
    condition: "New",
    size: "225/60R17",
    price: 154.5,
    qty: 8
  },
  {
    id: "inv_3",
    item: "Bridgestone Turanza QuietTrack",
    condition: "Used",
    size: "215/55R17",
    price: 94,
    qty: 3
  },
  {
    id: "inv_4",
    item: "Pirelli Scorpion AS Plus 3",
    condition: "New",
    size: "235/65R18",
    price: 179,
    qty: 5
  }
];

function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

function matchRow(row: InventoryRow, query: string): boolean {
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

export function InventoryTable() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = useMemo(
    () => INVENTORY_ROWS.filter((row) => matchRow(row, searchQuery)),
    [searchQuery]
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Inventory List</h2>
          <p className="mt-1 text-sm text-slate-600">
            Search by tire name, condition, or size for quick front-desk lookup.
          </p>
        </div>
        <div className="w-full sm:w-72">
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
      </div>

      {filteredRows.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
          <p className="text-base font-semibold text-slate-900">No inventory items found</p>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">
            Try a different search term or add tire inventory to this location.
          </p>
          <button
            type="button"
            className="mt-4 inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Add Inventory (Soon)
          </button>
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
