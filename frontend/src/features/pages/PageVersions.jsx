import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
    if (!confirm("Revert to this version?")) return;
    await API.post(`/pages/${id}/revert`, { versionIndex: index });
    alert("Successfully reverted! Go back to page.");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Version History</h2>

      {versions.length === 0 && (
        <div>No previous versions available.</div>
      )}

      {versions.map((v, i) => (
        <div key={i} className="border p-4 rounded mb-3">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">
                {v.editedBy?.name || "Unknown"}
              </div>
              <div className="text-sm text-gray-600">
                {new Date(v.editedAt).toLocaleString()}
              </div>
            </div>

            <button
              onClick={() => revert(i)}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Revert
            </button>
          </div>

          <div
            className="prose mt-4"
            dangerouslySetInnerHTML={{ __html: v.contentHtml }}
          />
        </div>
      ))}
    </div>
  );
}
