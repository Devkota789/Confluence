import { Link } from "react-router-dom";

const highlights = [
  {
    title: "Spaces behave like folders",
    description:
      "Nest documentation by team, product line, or sprint cycle so everyone knows where to publish.",
  },
  {
    title: "Pages capture the work",
    description:
      "Specs, briefs, and runbooks stay in sync with inline comments and decision callouts.",
  },
  {
    title: "Search finds anything",
    description: "AI-assisted search surfaces the exact page, snippet, or attachment you need.",
  },
];

const folders = [
  {
    label: "Product org",
    color: "text-sky-600",
    rows: ["Roadmaps", "RFCs", "Discovery notes", "Launch briefs"],
  },
  {
    label: "Growth team",
    color: "text-emerald-600",
    rows: ["Campaign calendars", "Experiment logs", "Persona library"],
  },
  {
    label: "People ops",
    color: "text-amber-600",
    rows: ["Onboarding", "Policies", "Benefit guides"],
  },
];

const templates = ["Quarterly roadmap", "Design proposal", "OKR tracker", "Incident review"];

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-10">
        <nav className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
              Confluence Studio
            </span>
            <div className="hidden gap-4 text-sm text-slate-500 lg:flex">
              <a className="transition hover:text-slate-900" href="#spaces">
                Spaces
              </a>
              <a className="transition hover:text-slate-900" href="#templates">
                Templates
              </a>
              <a className="transition hover:text-slate-900" href="#structure">
                Structure
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              className="rounded-xl border border-transparent px-4 py-2 text-slate-600 transition hover:text-slate-900"
              to="/login"
            >
              Login
            </Link>
            <Link
              className="rounded-xl border border-blue-500 px-4 py-2 text-blue-600 transition hover:bg-blue-600 hover:text-white"
              to="/register"
            >
              Get started
            </Link>
          </div>
        </nav>

        <header className="grid gap-10 rounded-4xl border border-slate-200 bg-white px-8 py-12 shadow-xl lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
              Modern Confluence experience
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 lg:text-5xl">
              Bring folders, docs, and discussions together inside one calm workspace.
            </h1>
            <p className="text-lg text-slate-600">
              Build a knowledge base that mirrors your org chart: spaces for every team, hierarchical pages for every project, and actions that keep deadlines realistic.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
              >
                Create workspace
              </Link>
              <Link
                to="/login"
                className="rounded-2xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:border-blue-300"
              >
                View dashboard
              </Link>
            </div>
            <p className="text-xs text-slate-500">No credit card required • Unlimited viewers • Export anytime</p>
          </div>

          <div className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Live tree preview</p>
              <div className="mt-4 grid gap-3">
                {folders.map((folder) => (
                  <div key={folder.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className={`text-sm font-semibold ${folder.color}`}>{folder.label}</p>
                    <ul className="mt-2 space-y-1 text-xs text-slate-500">
                      {folder.rows.map((row) => (
                        <li key={row} className="flex items-center gap-2">
                          <span className="text-slate-400">▸</span>
                          {row}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
              Automations route approvals to Jira, notify Slack channels, and keep everyone aligned.
            </div>
          </div>
        </header>

        <section id="spaces" className="grid gap-6 lg:grid-cols-3">
          {highlights.map((item) => (
            <article key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Feature</p>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-600">{item.description}</p>
            </article>
          ))}
        </section>

        <section id="structure" className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            <div className="lg:w-1/3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Folder-first thinking</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">Plan → Publish → Align</h2>
              <p className="mt-3 text-sm text-slate-600">
                Spaces behave like clearly labeled folders. Inside them, nested pages inherit context, permissions, and history.
              </p>
            </div>
            <div className="flex-1 space-y-4">
              {folders.map((folder) => (
                <div key={folder.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">{folder.label}</h3>
                    <span className="text-xs text-slate-500">{folder.rows.length} pages</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                    {folder.rows.map((row) => (
                      <span key={row} className="rounded-full border border-slate-200 bg-white px-3 py-1">
                        {row}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="templates" className="rounded-4xl border border-slate-200 bg-linear-to-r from-blue-50 via-white to-blue-50 p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-blue-500">Templates</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900">
            Start from curated structures inspired by Atlassian Confluence.
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {templates.map((template) => (
              <span key={template} className="rounded-2xl border border-blue-200 bg-white px-4 py-2 text-sm text-slate-700">
                {template}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link to="/register" className="rounded-2xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-500">
              Create workspace
            </Link>
            <Link
              to="/login"
              className="rounded-2xl border border-blue-300 px-8 py-3 font-semibold text-blue-600 transition hover:border-blue-500"
            >
              Explore dashboard
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
