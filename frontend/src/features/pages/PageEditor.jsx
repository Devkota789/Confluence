import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import WorkspaceShell from "../../components/WorkspaceShell";
import API from "../../services/Api";

export default function PageEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [tags, setTags] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
      setIsSaving(true);
      await API.put(`/pages/${id}`, {
        title,
        contentHtml,
        contentDelta: {},
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      });

      navigate(`/page/${id}`);
    } catch (error) {
      window.alert("Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const sidebar = useMemo(
    () => (
      <div className="space-y-5 text-sm text-slate-600">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Editing tips</p>
          <p className="mt-2 text-slate-500">
            Keep sections short and reference supporting docs with links or mentions.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Status</p>
          <p className="mt-2 font-semibold text-slate-900">
            {isSaving ? "Saving changes..." : "Drafting"}
          </p>
          <p className="text-xs text-slate-500">Changes persist when you click Save.</p>
        </div>
      </div>
    ),
    [isSaving]
  );

  return (
    <WorkspaceShell
      title="Page editor"
      description="Craft structured documentation with rich media, mentions, and tags."
      sidebar={sidebar}
      actions={
        <>
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300"
          >
            Cancel
          </button>
          <button
            onClick={savePage}
            className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <input
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-2xl font-semibold text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:outline-none"
          placeholder="Page title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <Editor
          apiKey="m7nx3p9l7r8y5izr8zir8cc336u5trwqk1jm6wszyqc72t6y"
          value={contentHtml}
          init={{
            height: 520,
            menubar: true,
            skin: "oxide",
            content_css: "default",
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
          }}
          onEditorChange={(newHtml) => setContentHtml(newHtml)}
        />

        <div className="grid gap-3 md:grid-cols-[1fr_240px]">
          <input
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:outline-none"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
          />
          <p className="text-sm text-slate-500">
            Tags make it effortless to search across spaces.
          </p>
        </div>
      </div>
    </WorkspaceShell>
  );
}
