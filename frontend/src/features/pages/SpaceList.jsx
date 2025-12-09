import { useEffect, useState } from "react";
import API from "../../services/Api";
import { Link } from "react-router-dom";

export default function SpaceList() {
  const [spaces, setSpaces] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const loadSpaces = async () => {
    const res = await API.get("/spaces");
    setSpaces(res.data);
  };

  useEffect(() => {
    loadSpaces();
  }, []);

  const createSpace = async (e) => {
    e.preventDefault();
    const res = await API.post("/spaces", { title, description });
    setSpaces([res.data, ...spaces]);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Spaces</h1>

      <form onSubmit={createSpace} className="flex gap-2 mb-6">
        <input
          className="border p-2 flex-1"
          placeholder="Space title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          className="border p-2 flex-1"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="bg-blue-600 text-white px-4 rounded">Add</button>
      </form>

      <div className="grid gap-3">
        {spaces.map((sp) => (
          <Link
            key={sp._id}
            to={`/space/${sp._id}`}
            className="p-4 border rounded hover:bg-gray-50 block"
          >
            <div className="font-semibold">{sp.title}</div>
            <div className="text-sm text-gray-600">{sp.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
