import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const navCards = [
  {
    title: "Spaces",
    description: "Browse every workspace and spin up new knowledge hubs.",
    to: "/spaces",
    accent: "from-sky-500/20 to-cyan-500/20",
  },
  {
    title: "Pages",
    description: "Open a page tree inside a space to edit or reorganize docs.",
    to: "/spaces",
    accent: "from-violet-500/20 to-indigo-500/20",
  },
  {
    title: "Version history",
    description: "Select any page to review edits and roll back if needed.",
    to: "/spaces",
    accent: "from-amber-500/20 to-orange-500/20",
  },
];

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="rounded-3xl border border-slate-800 bg-linear-to-r from-slate-900 to-slate-950 p-8 shadow-2xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold">
                Welcome back, {user?.name || "teammate"} 👋
              </h1>
              <p className="text-sm text-slate-400">
                Navigate between spaces, pages, and version history to keep work in sync.
              </p>
            </div>
            <button
              onClick={logout}
              className="rounded-2xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-red-400 hover:text-red-200"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {navCards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg"
            >
              <div className={`inline-flex rounded-full bg-linear-to-r ${card.accent} px-3 py-1 text-xs font-semibold text-slate-200`}>
                {card.title}
              </div>
              <p className="mt-4 text-sm text-slate-400">{card.description}</p>
              <Link
                to={card.to}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200"
              >
                Open
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Need to update a page?</h2>
              <p className="text-sm text-slate-400">
                Head to the Spaces area to create new docs or drill into an existing hierarchy, then use the page view to edit content or review versions.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/spaces"
                className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-400"
              >
                Browse spaces
              </Link>
              <Link
                to="/spaces"
                className="rounded-xl border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
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
