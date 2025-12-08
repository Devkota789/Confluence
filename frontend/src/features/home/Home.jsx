import { Link } from "react-router-dom";

const featureTiles = [
	{
		title: "Spaces for every team",
		description: "Keep product specs, campaign briefs, and runbooks organized by workspace.",
	},
	{
		title: "Real-time collaboration",
		description: "Co-edit docs, leave decisions inline, and keep discussions contextual.",
	},
	{
		title: "Knowledge base search",
		description: "Surface the docs people actually use with intelligent, typo-tolerant search.",
	},
];

const steps = [
	{
		label: "Create",
		copy: "Start with a template for product specs, standups, or onboarding and make it yours.",
	},
	{
		label: "Organize",
		copy: "Group pages into spaces, lock permissions, and keep everything version-controlled.",
	},
	{
		label: "Align",
		copy: "Share updates with stakeholders, collect feedback, and turn ideas into action.",
	},
];

const Home = () => {
	return (
		<div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-10">
				<nav className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/60 px-6 py-4 shadow-lg backdrop-blur md:flex-row md:items-center md:justify-between">
					<div className="flex items-center gap-3">
						<div className="rounded-xl bg-emerald-500/20 px-3 py-1 text-sm font-semibold text-emerald-300">
							Confluence Clone
						</div>
						<p className="text-xs uppercase tracking-[0.4em] text-slate-500">Workspace OS</p>
					</div>
					<div className="flex flex-wrap gap-3 text-sm">
						<Link
							className="rounded-xl border border-transparent px-4 py-2 text-slate-300 transition hover:text-white"
							to="/login"
						>
							Login
						</Link>
						<Link
							className="rounded-xl border border-emerald-400 px-4 py-2 text-emerald-300 transition hover:bg-emerald-400 hover:text-slate-950"
							to="/register"
						>
							Get started
						</Link>
					</div>
				</nav>

				<header className="grid gap-10 rounded-4xl border border-slate-800 bg-slate-950/70 px-8 py-12 shadow-2xl lg:grid-cols-2">
					<div className="space-y-6">
						<p className="text-sm uppercase tracking-[0.4em] text-slate-500">Team knowledge, orchestrated</p>
						<h1 className="text-4xl font-semibold leading-tight lg:text-5xl">
							Bring every team, doc, and decision into one living workspace.
						</h1>
						<p className="text-lg text-slate-300">
							Launch projects faster with AI-assisted templates, page analytics, and workflows inspired by Atlassian Confluence.
						</p>
						<div className="flex flex-wrap gap-4">
							<Link
								to="/register"
								className="rounded-2xl bg-emerald-500 px-6 py-3 font-semibold text-slate-900 transition hover:bg-emerald-400"
							>
								Create free workspace
							</Link>
							<Link
								to="/login"
								className="rounded-2xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:border-slate-500"
							>
								View dashboard
							</Link>
						</div>
						<p className="text-xs text-slate-500">No credit card required • Unlimited collaborators • Export anytime</p>
					</div>

					<div className="space-y-6 rounded-[28px] border border-emerald-500/20 bg-slate-900/80 p-6">
						<div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
							<p className="text-xs uppercase tracking-[0.4em] text-emerald-300">Live doc preview</p>
							<p className="mt-3 text-lg font-medium text-slate-100">Quarterly Roadmap • Product Org</p>
							<ul className="mt-4 space-y-3 text-sm text-slate-400">
								<li className="rounded-xl border border-slate-800/70 px-4 py-3">
									✅ Discovery completed • Engineering handoff 03/22
								</li>
								<li className="rounded-xl border border-slate-800/70 px-4 py-3">
									✏️ Drafting AI onboarding playbook
								</li>
								<li className="rounded-xl border border-slate-800/70 px-4 py-3">
									💬 12 comments • 4 unresolved decisions
								</li>
							</ul>
						</div>
						<div className="rounded-2xl border border-dashed border-slate-700/70 p-5 text-sm text-slate-400">
							Automations route feedback to the right space, trigger Jira tickets, and keep Slack in the loop.
						</div>
					</div>
				</header>

				<section className="grid gap-6 lg:grid-cols-3">
					{featureTiles.map((tile) => (
						<article
							key={tile.title}
							className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-lg"
						>
							<p className="text-xs uppercase tracking-[0.4em] text-slate-500">Feature</p>
							<h3 className="mt-4 text-xl font-semibold">{tile.title}</h3>
							<p className="mt-3 text-sm text-slate-400">{tile.description}</p>
						</article>
					))}
				</section>

				<section className="rounded-4xl border border-slate-800 bg-slate-950/70 p-8">
					<div className="flex flex-col gap-8 lg:flex-row lg:items-start">
						<div className="lg:w-1/3">
							<p className="text-xs uppercase tracking-[0.3em] text-slate-500">How teams flow</p>
							<h2 className="mt-3 text-2xl font-semibold">Plan → Publish → Align</h2>
						</div>
						<div className="flex-1 space-y-6">
							{steps.map((step, index) => (
								<div key={step.label} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
									<div className="flex items-center justify-between">
										<h3 className="text-lg font-semibold">{step.label}</h3>
										<span className="text-xs text-slate-500">0{index + 1}</span>
									</div>
									<p className="mt-2 text-sm text-slate-400">{step.copy}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="rounded-4xl border border-emerald-500/30 bg-linear-to-r from-emerald-500/20 via-slate-900 to-slate-950 p-8 text-center shadow-2xl">
					<p className="text-xs uppercase tracking-[0.4em] text-emerald-200">Ready when you are</p>
					<h2 className="mt-4 text-3xl font-semibold">Start organizing your company knowledge today.</h2>
					<p className="mt-3 text-sm text-emerald-100/80">
						Spin up a space, invite teammates, and bring documentation, decisions, and updates into one collaborative hub.
					</p>
					<div className="mt-6 flex flex-wrap justify-center gap-4">
						<Link
							to="/register"
							className="rounded-2xl bg-emerald-500 px-8 py-3 font-semibold text-slate-900 transition hover:bg-emerald-400"
						>
							Create workspace
						</Link>
						<Link
							to="/login"
							className="rounded-2xl border border-emerald-400 px-8 py-3 font-semibold text-emerald-200 transition hover:bg-emerald-400/10"
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
