import React, { useEffect, useState } from 'react';
import { Shield, UserPlus, Users, ServerCog, Database, Zap, Search, Trash2, Edit } from 'lucide-react';

const SAMPLE_USERS = [
  { id: '1', name: 'Alice Roberts', email: 'alice@example.com', role: 'superadmin', active: true, createdAt: '2024-09-12' },
  { id: '2', name: 'Bob Martin', email: 'bob@example.com', role: 'admin', active: true, createdAt: '2025-01-08' },
  { id: '3', name: 'Cathy Lee', email: 'cathy@example.com', role: 'editor', active: false, createdAt: '2025-03-22' },
];

export default function SuperAdmin() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setUsers(SAMPLE_USERS);
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, []);

  const filtered = users.filter(u => (u.name + u.email + u.role).toLowerCase().includes(query.toLowerCase()));

  const toggleActive = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const deleteUser = (id) => setUsers(prev => prev.filter(u => u.id !== id));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Superadmin Console</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">System-level controls: users, roles, system health and integrations.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-700">
              <Shield className="h-4 w-4" /> Global Settings
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              <UserPlus className="h-4 w-4" /> Invite
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <main className="lg:col-span-2 space-y-6">
            <section className="rounded-xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Users</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="Search users, email or role"
                      className="pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-100"
                    />
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500">
                      <th className="py-2">Name</th>
                      <th className="py-2">Email</th>
                      <th className="py-2">Role</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Joined</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && <tr><td colSpan={6} className="py-4 text-center text-slate-500">Loading...</td></tr>}
                    {!loading && filtered.length === 0 && <tr><td colSpan={6} className="py-4 text-center text-slate-500">No users</td></tr>}
                    {!loading && filtered.map(u => (
                      <tr key={u.id} className="border-t border-slate-100 dark:border-slate-700">
                        <td className="py-3 align-top font-medium text-slate-900 dark:text-slate-100">{u.name}</td>
                        <td className="py-3 align-top text-slate-500 dark:text-slate-300">{u.email}</td>
                        <td className="py-3 align-top">{u.role}</td>
                        <td className="py-3 align-top">{u.active ? <span className="text-green-600">Active</span> : <span className="text-rose-600">Disabled</span>}</td>
                        <td className="py-3 align-top text-slate-500 dark:text-slate-300">{u.createdAt}</td>
                        <td className="py-3 align-top">
                          <div className="flex items-center gap-2">
                            <button onClick={() => toggleActive(u.id)} className="text-amber-600 text-sm">{u.active ? 'Disable' : 'Enable'}</button>
                            <button onClick={() => deleteUser(u.id)} className="flex items-center gap-1 text-rose-600 text-sm"><Trash2 className="h-4 w-4"/> Remove</button>
                            <button className="flex items-center gap-1 text-slate-600 text-sm"><Edit className="h-4 w-4"/> Edit</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
              <h3 className="text-lg font-semibold">Audit & Logs</h3>
              <div className="mt-3 text-sm text-slate-600 dark:text-slate-300 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="text-slate-400">2025-12-16</div>
                  <div>New space created: Engineering by alice@example.com</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-slate-400">2025-12-15</div>
                  <div>User invited: newuser@example.com</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-slate-400">2025-12-10</div>
                  <div>Role updated for bob@example.com</div>
                </div>
              </div>
            </section>
          </main>

          <aside className="space-y-6">
            <div className="rounded-xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
              <h4 className="text-sm font-semibold">System Health</h4>
              <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex justify-between"><span>API</span><strong className="text-green-600">OK</strong></div>
                <div className="flex justify-between mt-2"><span>DB</span><strong className="text-green-600">Connected</strong></div>
                <div className="flex justify-between mt-2"><span>Last backup</span><strong>2025-12-16</strong></div>
              </div>
            </div>

            <div className="rounded-xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
              <h4 className="text-sm font-semibold">Integrations</h4>
              <div className="mt-3 text-sm text-slate-600 dark:text-slate-300 space-y-2">
                <div className="flex items-center justify-between"><span>Slack</span><span className="text-green-600">Connected</span></div>
                <div className="flex items-center justify-between"><span>Google SSO</span><span className="text-amber-500">Partial</span></div>
                <div className="flex items-center justify-between"><span>Email</span><span className="text-green-600">OK</span></div>
              </div>
            </div>

            <div className="rounded-xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
              <h4 className="text-sm font-semibold">Quick Tasks</h4>
              <div className="mt-3 flex flex-col gap-2">
                <button className="inline-flex items-center gap-2 justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">Run health check</button>
                <button className="inline-flex items-center gap-2 justify-center rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white">Export users</button>
                <button className="inline-flex items-center gap-2 justify-center rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white">Purge inactive</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
