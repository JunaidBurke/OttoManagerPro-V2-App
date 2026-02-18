export function CustomerPanelSkeleton() {
  return (
    <section className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="h-6 w-44 rounded bg-slate-200" />
      <div className="mt-2 h-4 w-96 max-w-full rounded bg-slate-200" />

      <div className="mt-4 h-11 w-full rounded-xl bg-slate-100" />

      <div className="mt-3 space-y-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-16 rounded-xl border border-slate-200 bg-slate-50"
          />
        ))}
      </div>
    </section>
  );
}
