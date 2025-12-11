const WorkspaceShell = ({
  title,
  description,
  sidebar,
  actions,
  children,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
        <header className="rounded-3xl border border-slate-200 bg-linear-to-r from-white via-slate-50 to-white p-6 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Workspace</p>
              <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
              {description && (
                <p className="mt-2 text-sm text-slate-500">{description}</p>
              )}
            </div>
            {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md">
            {sidebar || (
              <div className="text-sm text-slate-500">
                Provide a sidebar prop to show navigation or metadata.
              </div>
            )}
          </aside>

          <main className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceShell;
