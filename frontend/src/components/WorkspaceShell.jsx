import React from 'react';
import { Search } from 'lucide-react';

const WorkspaceShell = ({
  title,
  description,
  actions,
  sidebar,
  rightSidebar,
  children,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
}) => {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-white pt-24 pb-12 dark:from-gray-900 dark:via-gray-800 dark:to-gray-800">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 text-slate-900 dark:text-gray-100 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[260px,1fr] xl:grid-cols-[280px,1fr,320px]">
          {sidebar && (
            <aside className="h-max rounded-3xl border border-slate-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 p-6 shadow-sm backdrop-blur">
              {sidebar}
            </aside>
          )}

          <main className="rounded-3xl border border-slate-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 p-6 shadow-sm backdrop-blur-lg">
            <header className="flex flex-col gap-4 border-b border-slate-100 dark:border-gray-700 pb-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400 dark:text-gray-500">
                  Workspace
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-gray-100">{title}</h1>
                {description && <p className="mt-2 text-base text-slate-600 dark:text-gray-400">{description}</p>}

                {/* Search Bar */}
                {onSearchChange && (
                  <div className="mt-4 relative max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-slate-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      placeholder={searchPlaceholder}
                      className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-slate-900 dark:text-gray-100 placeholder-slate-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                    />
                  </div>
                )}
              </div>
              {actions && <div className="flex flex-wrap gap-3 lg:justify-end">{actions}</div>}
            </header>

            <section className="mt-6 flex flex-col gap-6">{children}</section>
          </main>

          {rightSidebar && (
            <aside className="h-max rounded-3xl border border-slate-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 p-6 shadow-sm backdrop-blur">
              {rightSidebar}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceShell;
