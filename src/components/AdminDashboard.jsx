
import { useGame } from '../context/useGame';

export default function AdminDashboard() {
  const { dailyReport, adminApproveReport, adminRejectReport } = useGame();

  // Als er geen actieve link is ingestuurd, tonen we een leeg-status
  if (dailyReport.status === 'Empty' || dailyReport.status === 'Approved' || dailyReport.status === 'Rejected') {
    return (
      <div className="p-6 bg-stone-900 border border-stone-800 rounded-2xl max-w-md mx-auto shadow-xl mt-6 text-center">
        <h3 className="text-lg font-serif text-amber-500 font-bold mb-2">🔔 Admin Review Feed</h3>
        <p className="text-sm text-stone-500 py-4">Er zijn momenteel geen nieuwe dagelijkse rapportages om te controleren. 👍</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-stone-900 border border-stone-800 rounded-2xl max-w-md mx-auto shadow-xl mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-serif text-amber-500 font-bold">🔔 Admin Review Feed</h3>
        <span className="bg-amber-950 text-amber-400 border border-amber-800 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold animate-pulse">
          1 Nieuw
        </span>
      </div>

      <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="text-sm font-bold text-stone-200">Ingezonden Voortgang</h4>
            <p className="text-xs text-amber-400 font-mono mt-0.5">Geclaimd: 💧 {dailyReport.estimatedDroplets} Druppels</p>
          </div>
          <a 
            href={dailyReport.fileLink} 
            target="_blank" 
            rel="noreferrer"
            className="text-xs bg-stone-800 hover:bg-amber-600 hover:text-stone-950 px-2.5 py-1.5 rounded border border-stone-700 font-bold transition duration-200 cursor-pointer shadow"
          >
            🔗 Open Link
          </a>
        </div>

        {/* Actieknoppen voor de president (WDD440 / CSE320 Concurrency Guard) */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button 
            onClick={adminApproveReport}
            className="bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-950 text-emerald-100 py-2 rounded-lg text-xs font-bold transition duration-200 cursor-pointer shadow-md"
          >
            Goedkeuren (Behouden)
          </button>
          <button 
            onClick={() => adminRejectReport(dailyReport.estimatedDroplets)}
            className="bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 py-2 rounded-lg text-xs font-bold transition duration-200 cursor-pointer shadow-md"
          >
            Afkeuren (Aftrekken)
          </button>
        </div>
      </div>
    </div>
  );
}
