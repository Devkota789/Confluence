import React from 'react';

const WorkspaceShell = ({
  title,
  description,
  actions,
  sidebar,
  rightSidebar,
  children,
}) => {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-white pt-24 pb-12">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 text-slate-900 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[260px,1fr] xl:grid-cols-[280px,1fr,320px]">
          {sidebar && (
            <aside className="h-max rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
              {sidebar}
            </aside>
          )}

          <main className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-lg">
            <header className="flex flex-col gap-4 border-b border-slate-100 pb-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  Workspace
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900">{title}</h1>
                {description && <p className="mt-2 text-base text-slate-600">{description}</p>}
              </div>
              {actions && <div className="flex flex-wrap gap-3 lg:justify-end">{actions}</div>}
            </header>

            <section className="mt-6 flex flex-col gap-6">{children}</section>
          </main>

          {rightSidebar && (
            <aside className="h-max rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur">
              {rightSidebar}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceShell;
