import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import WorkspaceShell from "../../components/WorkspaceShell";
import API from "../../services/Api";

export default function PageVersions() {
  const { id } = useParams();
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await API.get(`/pages/${id}/versions`);
      setVersions(res.data);
    })();
  }, [id]);

  const revert = async (index) => {
    if (!window.confirm("Revert to this version?")) return;
    await API.post(`/pages/${id}/revert`, { versionIndex: index });
    window.alert("Successfully reverted! Go back to the page to view the update.");
  };

  const sidebar = useMemo(
    () => (
      <div className="space-y-5 text-sm text-slate-600">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">How it works</p>
          <p className="mt-2 text-slate-500">
            Every save stores content, tags, and metadata. Roll back when experiments do not pan out.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Versions tracked</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{versions.length}</p>
          <p className="text-xs text-slate-500">Snapshots available</p>
        </div>
      </div>
    ),
    [versions.length]
  );

  return (
    <WorkspaceShell
      title="Version history"
      description="Audit edits over time, compare content, and revert with confidence."
      sidebar={sidebar}
    >
      <div className="space-y-4">
        {versions.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            No previous versions available yet.
          </div>
        )}

        {versions.map((version, index) => (
          <article
            key={index}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {version.editedBy?.name || "Unknown author"}
                </p>
                <p className="text-xs text-slate-500">
                  {version.editedAt
                    ? new Date(version.editedAt).toLocaleString()
                    : "Unknown date"}
                </p>
              </div>
              <button
                onClick={() => revert(index)}
                className="rounded-xl border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-600 transition hover:bg-amber-50"
              >
                Revert to this version
              </button>
            </div>

            <div
              className="prose mt-4 max-w-none text-slate-800"
              dangerouslySetInnerHTML={{ __html: version.contentHtml }}
            />
          </article>
        ))}
      </div>
    </WorkspaceShell>
  );
}
