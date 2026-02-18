export default function Loading() {
  return (
    <section className="space-y-5 animate-pulse" aria-label="Dashboard loading">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="h-7 w-44 rounded-md bg-slate-200" />
        <div className="mt-3 h-4 w-80 max-w-full rounded-md bg-slate-100" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="h-4 w-24 rounded-md bg-slate-100" />
          <div className="mt-4 h-8 w-10 rounded-md bg-slate-200" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="h-4 w-24 rounded-md bg-slate-100" />
          <div className="mt-4 h-8 w-10 rounded-md bg-slate-200" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="h-4 w-24 rounded-md bg-slate-100" />
          <div className="mt-4 h-8 w-10 rounded-md bg-slate-200" />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="h-5 w-40 rounded-md bg-slate-200" />
          <div className="mt-2 h-4 w-full rounded-md bg-slate-100" />
          <div className="mt-4 h-40 rounded-xl border border-dashed border-slate-200 bg-slate-50" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="h-5 w-32 rounded-md bg-slate-200" />
          <div className="mt-2 h-4 w-full rounded-md bg-slate-100" />
          <div className="mt-4 h-40 rounded-xl border border-dashed border-slate-200 bg-slate-50" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="h-5 w-44 rounded-md bg-slate-200" />
          <div className="mt-2 h-4 w-full rounded-md bg-slate-100" />
          <div className="mt-4 h-40 rounded-xl border border-dashed border-slate-200 bg-slate-50" />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="h-5 w-36 rounded-md bg-slate-200" />
          <div className="mt-2 h-4 w-full rounded-md bg-slate-100" />
          <div className="mt-4 h-44 rounded-xl border border-dashed border-slate-200 bg-slate-50" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="h-5 w-52 rounded-md bg-slate-200" />
          <div className="mt-2 h-4 w-full rounded-md bg-slate-100" />
          <div className="mt-4 h-44 rounded-xl border border-dashed border-slate-200 bg-slate-50" />
        </div>
      </div>
    </section>
  );
}
