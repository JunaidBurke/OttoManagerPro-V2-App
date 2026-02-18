type EmptyStateCardProps = {
  title: string;
  description: string;
  actionLabel: string;
};

export function EmptyStateCard({
  title,
  description,
  actionLabel
}: EmptyStateCardProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
      <p className="text-base font-semibold text-slate-900">{title}</p>
      <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600">{description}</p>
      <button
        type="button"
        className="mt-4 inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        {actionLabel}
      </button>
    </div>
  );
}
