import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import API from "../../services/Api";

export default function PageEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    (async () => {
      const res = await API.get(`/pages/${id}`);
      setTitle(res.data.title);
      setContentHtml(res.data.contentHtml || "");
      setTags((res.data.tags || []).join(", "));
    })();
  }, [id]);

  const savePage = async () => {
    try {
      await API.put(`/pages/${id}`, {
        title,
        contentHtml,
        contentDelta: {}, // Not needed for TinyMCE but kept for compatibility
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      });

      navigate(`/page/${id}`);
    } catch (err) {
      alert("Save failed");
    }
  };

  return (
    <div className="p-6">
      {/* Title */}
      <input
        className="w-full p-2 border mb-4"
        placeholder="Page title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* TinyMCE Editor */}
      <Editor
        apiKey="m7nx3p9l7r8y5izr8zir8cc336u5trwqk1jm6wszyqc72t6y"   // replace with your TinyMCE key
        value={contentHtml}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            "advlist autolink lists link image charmap preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table code help wordcount"
          ],
          toolbar:
            "undo redo | blocks | bold italic forecolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | removeformat | help",
        }}
        onEditorChange={(newHtml) => setContentHtml(newHtml)}
      />

      {/* Tags */}
      <input
        className="w-full p-2 border mt-4"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      {/* Buttons */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={savePage}
          className="bg-blue-600 px-4 py-2 rounded text-white"
        >
          Save
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
