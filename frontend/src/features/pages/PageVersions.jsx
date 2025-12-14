// import { useCallback, useEffect, useMemo, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { AlertTriangle, History, RotateCcw } from 'lucide-react';
// import WorkspaceShell from '../../components/WorkspaceShell';
// import { pagesAPI } from '../../services/api';

// export default function PageVersions() {
//   const { pageId } = useParams();
//   const navigate = useNavigate();
//   const [versions, setVersions] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);

//   const loadVersions = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await pagesAPI.getVersions(pageId);
//       setVersions(res.data);
//       setError('');
//     } catch {
//       setError('Unable to load version history');
//     } finally {
//       setLoading(false);
//     }
//   }, [pageId]);

//   useEffect(() => {
//     loadVersions();
//   }, [loadVersions]);

//   const revert = async (index) => {
//     if (!window.confirm('Revert to this version?')) return;
//     try {
//       await pagesAPI.revertToVersion(pageId, index);
//       navigate(`/pages/${pageId}`);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Unable to revert right now');
//     }
//   };

//   const sidebar = useMemo(
//     () => (
//       <div className="space-y-5 text-sm text-slate-600">
//         <div>
//           <p className="text-xs uppercase tracking-[0.3em] text-slate-400">How it works</p>
//           <p className="mt-2 text-slate-500">
//             Every save stores the previous body copy. Use history to recover context or undo experiments.
//           </p>
//         </div>
//         <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//           <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Versions tracked</p>
//           <p className="mt-2 text-3xl font-semibold text-slate-900">{versions.length}</p>
//           <p className="text-xs text-slate-500">Snapshots available</p>
//         </div>
//       </div>
//     ),
//     [versions.length]
//   );

//   return (
//     <WorkspaceShell
//       title="Version history"
//       description="Audit edits over time, compare content, and revert with confidence."
//       sidebar={sidebar}
//     >
//       {error && (
//         <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           <AlertTriangle className="h-4 w-4" />
//           {error}
//         </div>
//       )}

//       {loading ? (
//         <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
//           Loading version history…
//         </div>
//       ) : versions.length === 0 ? (
//         <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
//           No previous versions available yet.
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {versions.map((version, index) => {
//             const raw = version.content || '';
//             const trimmed = raw.trim();
//             const looksHtml = /^<([a-z]+)([^>]*)>/i.test(trimmed);
//             const snapshotHtml = looksHtml ? trimmed : `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;

//             return (
//             <article key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//               <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//                 <div>
//                   <p className="text-sm font-semibold text-slate-900">
//                     {version.editedBy?.name || 'Unknown author'}
//                   </p>
//                   <p className="text-xs text-slate-500">
//                     {version.editedAt ? new Date(version.editedAt).toLocaleString() : 'Unknown date'}
//                   </p>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => revert(index)}
//                     className="inline-flex items-center gap-2 rounded-xl border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-600 transition hover:bg-amber-50"
//                   >
//                     <RotateCcw className="h-4 w-4" />
//                     Revert to this version
//                   </button>
//                 </div>
//               </div>
//               <div
//                 className="prose mt-4 max-w-none text-slate-800"
//                 dangerouslySetInnerHTML={{ __html: snapshotHtml || '<p>No snapshot available.</p>' }}
//               />
//             </article>
//           );
//           })}
//         </div>
//       )}
//     </WorkspaceShell>
//   );
// }
