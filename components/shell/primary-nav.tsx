"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";

type PrimaryNavProps = {
  mode: "desktop" | "mobile";
};

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function PrimaryNav({ mode }: PrimaryNavProps) {
  const pathname = usePathname();

  if (mode === "mobile") {
    return (
      <nav aria-label="Primary" className="grid grid-cols-4 gap-2">
        {NAV_ITEMS.map((item) => {
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-xl px-3 py-2 text-center text-xs font-medium transition-colors",
                active
                  ? "bg-slate-900 text-slate-50 shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              {item.shortLabel}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label="Primary" className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const active = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-xl border px-3 py-3 transition-colors",
              active
                ? "border-slate-900 bg-slate-900 text-slate-50"
                : "border-transparent bg-transparent hover:border-slate-200 hover:bg-slate-100"
            )}
          >
            <p className={cn("text-sm font-semibold", active ? "text-slate-50" : "text-slate-900")}>
              {item.label}
            </p>
            <p
              className={cn(
                "mt-1 text-xs",
                active ? "text-slate-300" : "text-slate-500"
              )}
            >
              {item.subtitle}
            </p>
          </Link>
        );
      })}
    </nav>
  );
}
