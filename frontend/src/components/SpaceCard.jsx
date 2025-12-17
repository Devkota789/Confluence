import React from 'react';
import { Users } from 'lucide-react';

export default function SpaceCard({ space }) {
  const initials = (space.title || 'S')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const avatarUrl = space.avatar || space.image || null;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white dark:bg-slate-800/70 p-3 shadow-sm transition hover:shadow md:p-4">
      <div className="flex-shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={space.title}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-700 font-semibold">
            {initials}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{space.title}</h3>
          <span className="ml-3 text-xs text-slate-400">Open →</span>
        </div>
        <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-300">{space.description || 'No description'}</p>

        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-900 px-2 py-0.5">
            <Users className="h-3 w-3" />
            {(space.members || []).length}
          </span>
          <span className="rounded-full bg-slate-100 dark:bg-slate-900 px-2 py-0.5">
            {new Date(space.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
