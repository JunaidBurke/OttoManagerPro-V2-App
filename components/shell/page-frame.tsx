import type { ReactNode } from "react";

type PageFrameProps = Readonly<{
  title: string;
  description: string;
  children: ReactNode;
}>;

export function PageFrame({ title, description, children }: PageFrameProps) {
  return (
    <section className="space-y-5">
      <header className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </header>
      {children}
    </section>
  );
}
