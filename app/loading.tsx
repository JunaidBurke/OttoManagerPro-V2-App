export default function Loading() {
  return (
    <section className="space-y-5 animate-pulse">
      <div className="h-28 rounded-2xl border border-slate-200 bg-white" />
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="h-24 rounded-2xl border border-slate-200 bg-white" />
        <div className="h-24 rounded-2xl border border-slate-200 bg-white" />
        <div className="h-24 rounded-2xl border border-slate-200 bg-white" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="h-72 rounded-2xl border border-slate-200 bg-white" />
        <div className="h-72 rounded-2xl border border-slate-200 bg-white" />
      </div>
    </section>
  );
}
