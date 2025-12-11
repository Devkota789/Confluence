import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import WorkspaceShell from "../../components/WorkspaceShell";
import API from "../../services/Api";

export default function PageView() {
  const { id } = useParams();
  const [page, setPage] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await API.get(`/pages/${id}`);
      setPage(res.data);
    })();
  }, [id]);

  const metaSidebar = useMemo(() => {
    if (!page) return null;
    return (
      <div className="flex flex-col gap-6 text-sm text-slate-600">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Details</p>
          <p className="mt-2 text-sm text-slate-500">
            Last edited {page.updatedAt ? new Date(page.updatedAt).toLocaleString() : "recently"}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Tags</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(page.tags && page.tags.length ? page.tags : ["Uncategorized"]).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
          Store decisions, checklists, and resources exactly where teammates expect them.
        </div>
      </div>
    );
  }, [page]);

  if (!page) return <div className="p-10 text-center text-slate-400">Loading page...</div>;

  return (
    <WorkspaceShell
      title={page.title}
      description={page.description || "Living documentation"}
      sidebar={metaSidebar}
      actions={
        <>
          <Link
            to={`/page/${id}/versions`}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300"
          >
            Versions
          </Link>
          <Link
            to={`/page/${id}/edit`}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Edit page
          </Link>
        </>
      }
    >
      <article
        className="prose max-w-none text-slate-800"
        dangerouslySetInnerHTML={{ __html: page.contentHtml || "<p>No content yet.</p>" }}
      />
    </WorkspaceShell>
  );
}
