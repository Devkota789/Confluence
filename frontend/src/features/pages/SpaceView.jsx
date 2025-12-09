import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../services/Api";
import PageTree from "../../components/PageTree";

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
    const title = prompt("Page title:");
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

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Pages</h1>
        <div>
          <button
            onClick={createPage}
            className="bg-green-600 text-white px-3 py-1 rounded mr-2"
          >
            New Page
          </button>

          <Link to="/spaces" className="text-blue-600">
            Back
          </Link>
        </div>
      </div>

      <PageTree pages={pages} />
    </div>
  );
}
