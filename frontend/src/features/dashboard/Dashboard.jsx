import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const statCards = [
	{ label: "Projects", value: 4, accent: "from-sky-500 to-cyan-400" },
	{ label: "Team Members", value: 12, accent: "from-emerald-500 to-lime-400" },
	{ label: "Pending Tasks", value: 9, accent: "from-amber-500 to-orange-400" },
];

const activityItems = [
	{ title: "Product strategy sync", time: "Today • 10:30 AM" },
	{ title: "Content calendar review", time: "Tomorrow • 09:00 AM" },
	{ title: "Quarterly OKR update", time: "Friday • 02:00 PM" },
];

const Dashboard = () => {
	const navigate = useNavigate();
	const token = useMemo(() => localStorage.getItem("token"), []);

	useEffect(() => {
		if (!token) navigate("/login", { replace: true });
	}, [navigate, token]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login", { replace: true });
	};

	return (
		<div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
			<header className="mx-auto flex w-full max-w-6xl flex-col gap-4 rounded-3xl border border-slate-800 bg-linear-to-r from-slate-900 to-slate-950 p-8 shadow-2xl md:flex-row md:items-center md:justify-between">
				<div>
					<p className="text-sm uppercase tracking-[0.3em] text-slate-400">Dashboard</p>
					<h1 className="mt-2 text-3xl font-semibold">Welcome back 👋</h1>
					<p className="text-sm text-slate-400">All your teams, documents, and updates in one place.</p>
				</div>
				<button
					onClick={handleLogout}
					className="rounded-2xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-400 hover:text-white"
				>
					Logout
				</button>
			</header>

			<section className="mx-auto mt-10 grid w-full max-w-6xl gap-6 md:grid-cols-3">
				{statCards.map((card) => (
					<article
						key={card.label}
						className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg"
					>
						<div className={`inline-flex rounded-full bg-linear-to-r ${card.accent} px-3 py-1 text-xs font-semibold text-slate-950`}>
							{card.label}
						</div>
						<p className="mt-6 text-4xl font-bold">{card.value}</p>
						<p className="text-sm text-slate-400">Active {card.label.toLowerCase()}</p>
					</article>
				))}
			</section>

			<section className="mx-auto mt-10 grid w-full max-w-6xl gap-6 lg:grid-cols-3">
				<div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 lg:col-span-2">
					<h2 className="text-xl font-semibold">Activity Feed</h2>
					<ul className="mt-6 space-y-5">
						{activityItems.map((item) => (
							<li key={item.title} className="flex items-center justify-between rounded-2xl border border-slate-800/60 bg-slate-950/40 px-4 py-3">
								<div>
									<p className="font-medium">{item.title}</p>
									<p className="text-xs text-slate-400">{item.time}</p>
								</div>
								<span className="text-xs uppercase tracking-widest text-slate-500">View</span>
							</li>
						))}
					</ul>
				</div>

				<div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
					<h2 className="text-xl font-semibold">Quick Notes</h2>
					<p className="mt-4 text-sm text-slate-400">
						Use this space to jot down quick reminders for the team. Coming soon: synced notes from
						collaborative docs.
					</p>
					<div className="mt-6 rounded-2xl border border-dashed border-slate-700/80 p-4 text-center text-sm text-slate-500">
						+ Add note
					</div>
				</div>
			</section>
		</div>
	);
};

export default Dashboard;
