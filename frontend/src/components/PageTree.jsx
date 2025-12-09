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
      <div className="py-1">
        <Link className="text-blue-600" to={`/page/${node._id}`}>
          {node.title}
        </Link>
      </div>

      {node.children.length > 0 && (
        <div className="border-l pl-4">
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
        <div className="text-gray-500">No pages in this space.</div>
      )}
      {roots.map((root) => (
        <Node key={root._id} node={root} />
      ))}
    </div>
  );
}
