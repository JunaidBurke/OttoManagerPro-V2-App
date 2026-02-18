export function InventoryPanelSkeleton() {
  return (
    <section className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="h-6 w-48 rounded bg-slate-200" />
      <div className="mt-2 h-4 w-80 max-w-full rounded bg-slate-200" />

      <div className="mt-5 grid gap-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 w-20 rounded bg-slate-200" />
            <div className="h-10 w-full rounded-xl bg-slate-100" />
          </div>
        ))}
      </div>

      <div className="mt-6 h-10 w-full rounded-xl bg-slate-100 sm:w-72" />

      <div className="mt-4 hidden overflow-hidden rounded-xl border border-slate-200 md:block">
        <div className="h-10 w-full border-b border-slate-200 bg-slate-50" />
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-12 w-full border-b border-slate-100 bg-white last:border-b-0" />
        ))}
      </div>

      <div className="mt-4 space-y-3 md:hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-24 rounded-xl border border-slate-200 bg-slate-50" />
        ))}
      </div>
    </section>
  );
}
