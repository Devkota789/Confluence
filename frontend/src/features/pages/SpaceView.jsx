import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageTree from "../../components/PageTree";
import WorkspaceShell from "../../components/WorkspaceShell";
import API from "../../services/Api";

export default function SpaceView() {
  const { id } = useParams();
  const [pages, setPages] = useState([]);
  const navigate = useNavigate();

  const loadPages = async () => {
    const res = await API.get(`/pages/space/${id}`);
    setPages(res.data);
  };

  useEffect(() => {
    loadPages();
  }, [id]);

  const createPage = async () => {
    const title = window.prompt("Page title");
    if (!title) return;

    const res = await API.post("/pages", {
      title,
      space: id,
      parent: null,
      contentDelta: {},
      contentHtml: "",
    });

    navigate(`/page/${res.data._id}`);
  };

  const sidebar = (
    <div className="flex h-full flex-col gap-5">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Hierarchy</p>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <PageTree pages={pages} />
        </div>
      </div>
      <button
        onClick={loadPages}
        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300"
      >
        Refresh tree
      </button>
      <Link
        to="/spaces"
        className="text-sm font-semibold text-blue-600 transition hover:text-blue-500"
      >
        ← Back to spaces
      </Link>
    </div>
  );

  return (
    <WorkspaceShell
      title="Space explorer"
      description="Navigate nested pages the same way you would drill into folders."
      sidebar={sidebar}
      actions={
        <button
          onClick={createPage}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          New page
        </button>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold text-slate-900">Structure overview</p>
          <p className="mt-2 text-sm text-slate-600">
            Each page inherits permissions and context from its parent, keeping your space structured like a professional knowledge tree.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Pages</p>
          <p className="mt-2 text-4xl font-semibold text-slate-900">{pages.length}</p>
          <p className="text-sm text-slate-500">Documents within this space</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Recently touched pages</p>
            <Link className="text-xs font-semibold text-blue-600" to="/spaces">
              Manage spaces
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {pages.slice(0, 5).map((page) => (
              <button
                key={page._id}
                onClick={() => navigate(`/page/${page._id}`)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-2 text-left text-sm text-slate-600 transition hover:border-blue-300"
              >
                <span className="font-medium text-slate-900">{page.title}</span>
                <span className="text-xs text-slate-400">Open →</span>
              </button>
            ))}
            {pages.length === 0 && (
              <p className="text-sm text-slate-500">No pages yet. Start by creating one.</p>
            )}
          </div>
        </div>
      </div>
    </WorkspaceShell>
  );
}
