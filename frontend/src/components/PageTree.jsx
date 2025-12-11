import { Link } from "react-router-dom";

function buildTree(pages) {
  const map = {};
  pages.forEach((p) => (map[p._id] = { ...p, children: [] }));

  const roots = [];
  pages.forEach((p) => {
    if (p.parent && map[p.parent]) map[p.parent].children.push(map[p._id]);
    else roots.push(map[p._id]);
  });

  return roots;
}

function Node({ node }) {
  return (
    <div className="pl-4">
      <div className="relative border-l border-slate-200 py-2 pl-4 text-sm text-slate-700">
        <span className="absolute -left-[5px] top-4 h-2 w-2 -translate-x-1/2 rounded-full border border-slate-300 bg-white" />
        <Link className="font-medium text-slate-800 hover:text-blue-600" to={`/page/${node._id}`}>
          {node.title}
        </Link>
      </div>

      {node.children.length > 0 && (
        <div className="border-l border-slate-200 pl-4">
          {node.children.map((child) => (
            <Node key={child._id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PageTree({ pages }) {
  const roots = buildTree(pages);

  return (
    <div>
      {roots.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          No pages in this space.
        </div>
      )}
      {roots.map((root) => (
        <Node key={root._id} node={root} />
      ))}
    </div>
  );
}




