import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";

const quickActions = [
  { label: "Browse spaces", to: "/spaces", color: "text-sky-500" },
  { label: "Create page", to: "/spaces", color: "text-emerald-500" },
  { label: "Review versions", to: "/spaces", color: "text-amber-500" },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [spaces, setSpaces] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/spaces");
        setSpaces(res.data.slice(0, 4));
      } catch {
        setSpaces([]);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Workspace overview</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                Welcome back, {user?.name || "teammate"} 👋
              </h1>
              <p className="text-sm text-slate-500">
                Jump into spaces like folders, edit pages, or review version history.
              </p>
            </div>
            <button
              onClick={logout}
              className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-red-300 hover:text-red-500"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">Pinned spaces</p>
              <Link className="text-xs font-semibold text-blue-600" to="/spaces">
                View all →
              </Link>
            </div>
            <div className="mt-4 grid gap-3">
              {spaces.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-sm text-slate-500">
                  No spaces yet. Create one to organize docs like folders.
                </div>
              )}
              {spaces.map((space) => (
                <Link
                  key={space._id}
                  to={`/spaces/${space._id}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:border-blue-300"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{space.title}</p>
                    <p className="text-xs text-slate-500">
                      {space.description || "No description"}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">Open →</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
            <p className="text-sm font-semibold text-slate-800">Quick actions</p>
            <div className="mt-4 space-y-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600 transition hover:border-blue-300"
                >
                  <span className="font-medium">
                    <span className={`${action.color}`}>▸</span> {action.label}
                  </span>
                  <span className="text-xs text-slate-400">Go</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Need to update a page?</h2>
              <p className="text-sm text-slate-500">
                Start from the Spaces view to select a folder hierarchy, then open any page to edit or inspect its version history.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/spaces"
                className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Browse spaces
              </Link>
              <Link
                to="/spaces"
                className="rounded-xl border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-300"
              >
                Choose a page
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
