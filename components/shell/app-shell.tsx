import type { ReactNode } from "react";
import { PrimaryNav } from "./primary-nav";
import { Topbar } from "./topbar";

type AppShellProps = Readonly<{
  children: ReactNode;
}>;

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_15%_0%,rgba(14,116,144,0.14),transparent_45%),radial-gradient(circle_at_85%_15%,rgba(15,23,42,0.09),transparent_40%)]"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-24 pt-4 sm:px-6 lg:px-8">
        <Topbar />

        <div className="mt-6 flex flex-1 gap-6">
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-28 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold tracking-[0.06em] text-slate-500">
                Shop Navigation
              </p>
              <div className="mt-3">
                <PrimaryNav mode="desktop" />
              </div>
              <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                Quick search and location context stay visible while you move through the app.
              </p>
            </div>
          </aside>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 pb-4 pt-3 backdrop-blur lg:hidden">
        <PrimaryNav mode="mobile" />
      </div>
    </div>
  );
}
