import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import WorkspaceShell from "../../components/WorkspaceShell";
import API from "../../services/api";

export default function SpaceList() {
  const [spaces, setSpaces] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [query, setQuery] = useState("");

  const loadSpaces = async () => {
    const res = await API.get("/spaces");
    setSpaces(res.data);
  };

  useEffect(() => {
    loadSpaces();
  }, []);

  const createSpace = async (event) => {
    event.preventDefault();
    const res = await API.post("/spaces", { title, description });
    setSpaces([res.data, ...spaces]);
    setTitle("");
    setDescription("");
  };

  const filteredSpaces = useMemo(() => {
    if (!query.trim()) return spaces;
    return spaces.filter((space) =>
      space.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, spaces]);

  const sidebar = (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Search</p>
        <input
          className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          placeholder="Filter spaces"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Overview</p>
        <p className="mt-3 text-3xl font-semibold text-slate-900">{spaces.length}</p>
        <p className="text-xs text-slate-500">Spaces in this workspace</p>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-600">
        Organize work like folders: spaces collect related pages, briefs, and runbooks.
      </div>
    </div>
  );

  return (
    <WorkspaceShell
      title="Spaces & folders"
      description="Curate focused hubs for every team, program, or initiative."
      sidebar={sidebar}
      actions={
        <button
          form="create-space"
          type="submit"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Create space
        </button>
      }
    >
      <form
        id="create-space"
        onSubmit={createSpace}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <p className="text-sm font-semibold text-slate-900">New space</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:outline-none"
            placeholder="Space title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <input
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:outline-none"
            placeholder="Description (optional)"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
      </form>

      <div className="mt-6 grid gap-4">
        {filteredSpaces.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            No spaces match "{query}". Create a new one or adjust your search.
          </div>
        )}

        {filteredSpaces.map((space) => (
          <Link
            key={space._id}
            to={`/space/${space._id}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-900">{space.title}</p>
                <p className="text-sm text-slate-500">{space.description || "No description provided"}</p>
              </div>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Open →</span>
            </div>
          </Link>
        ))}
      </div>
    </WorkspaceShell>
  );
}
