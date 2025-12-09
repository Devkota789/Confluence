import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

  if (!page) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{page.title}</h1>

        <div className="flex gap-2">
          <Link
            to={`/page/${id}/edit`}
            className="px-3 py-1 bg-yellow-500 text-white rounded"
          >
            Edit
          </Link>

          <Link
            to={`/page/${id}/versions`}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Versions
          </Link>
        </div>
      </div>

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: page.contentHtml }}
      />
    </div>
  );
}
