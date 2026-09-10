import { useState } from 'react';
import { useGame } from '../context/useGame';

export default function VineyardDashboard() {
  const { gameState, dailyReport, submitDailyProgress, triggerDailyReset } = useGame();

  const [activeGoals, setActiveGoals] = useState({ spiritual: false, social: false, intellectual: false, physical: false });
  const [progressScores, setProgressScores] = useState({ spiritual: 2, social: 2, intellectual: 2, physical: 2 });

  const handleCheckboxChange = (category) => {
    setActiveGoals(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleSliderChange = (category, value) => {
    setProgressScores(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    let totalDroplets = 0;
    if (activeGoals.spiritual) totalDroplets += progressScores.spiritual;
    if (activeGoals.social) totalDroplets += progressScores.social;
    if (activeGoals.intellectual) totalDroplets += progressScores.intellectual;
    if (activeGoals.physical) totalDroplets += progressScores.physical;

    if (totalDroplets === 0) return alert('Vink minstens één doel aan!');

    submitDailyProgress(gameState.savedLink, totalDroplets);
    alert(`Rapport succesvol ingediend! Je hebt er tijdelijk 💧 ${totalDroplets} druppels bij gekregen.`);
    setActiveGoals({ spiritual: false, social: false, intellectual: false, physical: false });
  };

  return (
    <div className="p-6 bg-stone-900 border border-stone-800 rounded-2xl max-w-md mx-auto shadow-xl space-y-6">
      
      {/* 🎒 1. NIEUW: HET INTERACTIEVE INVENTARIS PANEL */}
      <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-3">
        <div className="flex justify-between items-center border-b border-stone-800 pb-2">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">🎒 Mijn Schatkist & Inventaris</h3>
          <span className="text-[10px] bg-amber-950/60 border border-amber-900/60 text-amber-400 px-2 py-0.5 rounded font-bold font-mono">
            🎟️ Activity Passes: {gameState.activityPasses || 0}
          </span>
        </div>

        {/* Tabelindeling voor Talentdruppels vs Echte Talenten */}
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono font-bold">
          {/* Rood (Common) */}
          <div className="p-2 bg-stone-900/40 border border-stone-800 rounded-lg space-y-1">
            <p className="text-rose-400 text-xs">🔴 Rood (Algemeen)</p>
            <p className="text-stone-400 text-[10px] font-sans font-medium">Druppels: {gameState.talentDroplets?.red || 0}</p>
            <p className="text-rose-300 font-bold border-t border-stone-800/60 pt-1">Talent: {gameState.talents?.red || 0}</p>
          </div>

          {/* Blauw (Uncommon) */}
          <div className="p-2 bg-stone-900/40 border border-stone-800 rounded-lg space-y-1">
            <p className="text-cyan-400 text-xs">🔵 Blauw (Uncommon)</p>
            <p className="text-stone-400 text-[10px] font-sans font-medium">Druppels: {gameState.talentDroplets?.blue || 0}</p>
            <p className="text-cyan-300 font-bold border-t border-stone-800/60 pt-1">Talent: {gameState.talents?.blue || 0}</p>
          </div>

          {/* Goud (Rare) */}
          <div className="p-2 bg-stone-900/40 border border-stone-800 rounded-lg space-y-1">
            <p className="text-amber-400 text-xs">🟡 Goud (Zeldzaam)</p>
            <p className="text-stone-400 text-[10px] font-sans font-medium">Druppels: {gameState.talentDroplets?.gold || 0}</p>
            <p className="text-amber-300 font-bold border-t border-stone-800/60 pt-1">Talent: {gameState.talents?.gold || 0}</p>
          </div>
        </div>
      </div>

      {/* Admin notificaties bij afkeuring/goedkeuring */}
      {dailyReport.status === 'Rejected' && (
        <div className="p-3 bg-rose-950/40 border border-rose-900 rounded-xl text-center text-rose-300 text-xs">
          <p className="font-bold">⚠️ President heeft je voortgang afgekeurd. Druppels zijn afgetrokken.</p>
          <button onClick={triggerDailyReset} className="mt-1 bg-rose-900 px-2 py-0.5 rounded font-bold cursor-pointer">Sluiten</button>
        </div>
      )}

      {dailyReport.status === 'Approved' && dailyReport.droppedTalent && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-900 rounded-xl text-center text-emerald-400 space-y-2 animate-fadeIn">
          <p className="text-sm font-bold">✓ Voortgang Goedgekeurd!</p>
          <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 text-xs space-y-1">
            <p className="text-stone-500 uppercase tracking-widest text-[10px] font-bold">🎁 Je Loot Drop Beloning:</p>
            {dailyReport.droppedTalent.category === 'oil' && <span className="text-amber-500 font-bold block">💧 Olie-Bonus! +{dailyReport.droppedTalent.amount} Druppels!</span>}
            {dailyReport.droppedTalent.category === 'droplet' && (
              <span className="block">
                {dailyReport.droppedTalent.rarity === 'rare' && <span className="text-amber-400 font-bold">✨ +1 Gouden Talentdruppel! (💧)</span>}
                {dailyReport.droppedTalent.rarity === 'uncommon' && <span className="text-cyan-400 font-bold">💎 +1 Blauwe Talentdruppel! (🔹)</span>}
                {dailyReport.droppedTalent.rarity === 'common' && <span className="text-rose-400 font-bold">🔴 +1 Rode Talentdruppel! (🔸)</span>}
              </span>
            )}
            {dailyReport.droppedTalent.category === 'talent' && (
              <span className="block p-1 bg-amber-500/10 border border-amber-500/20 rounded mt-1 animate-bounce">
                {dailyReport.droppedTalent.rarity === 'rare' && <span className="text-amber-400 font-black">👑 +1 ECHT GOUD TALENT! (+1 Activiteitspas)</span>}
                {dailyReport.droppedTalent.rarity === 'uncommon' && <span className="text-cyan-300 font-black">🔷 +1 ECHT BLAUW TALENT!</span>}
                {dailyReport.droppedTalent.rarity === 'common' && <span className="text-rose-300 font-black">🔺 +1 ECHT ROOD TALENT!</span>}
              </span>
            )}
          </div>
          <button onClick={triggerDailyReset} className="mt-2 text-xs bg-emerald-900/60 hover:bg-emerald-900 px-3 py-1 rounded-md font-bold text-emerald-100 block mx-auto">Sluiten</button>
        </div>
      )}

      {/* Olijflamp Header */}
      <div className="text-center">
        <div className="text-4xl animate-pulse mb-1">🫙</div>
        <h2 className="text-lg font-serif text-amber-500 font-bold">Mijn Olijflamp</h2>
        <p className="text-2xl font-mono font-bold text-amber-400">💧 {gameState.oilInLamp} Druppels</p>
      </div>

      {/* 4 Gebieden Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Vink aan wat je vandaag hebt gedaan:</h3>
        <div className="grid grid-cols-1 gap-3 text-xs">
          {['spiritual', 'social', 'intellectual', 'physical'].map((cat) => {
            const colors = { spiritual: 'amber', social: 'cyan', intellectual: 'emerald', physical: 'rose' };
            const names = { spiritual: '✨ Spiritueel', social: '🤝 Sociaal', intellectual: '🧠 Intellectueel', physical: '💪 Fysiek' };
            return (
              <div key={cat} className={`p-3 border rounded-xl transition ${activeGoals[cat] ? `bg-stone-950 border-${colors[cat]}-500/40` : 'bg-stone-950/40 border-stone-800'}`}>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input type="checkbox" checked={activeGoals[cat]} onChange={() => handleCheckboxChange(cat)} className={`accent-${colors[cat]}-500 h-4 w-4 mt-0.5`} />
                  <div>
                    <p className={`font-bold text-${colors[cat]}-400`}>{names[cat]}</p>
                    <p className="text-stone-400 mt-0.5">{gameState.goals[cat] || `Mijn ${cat} plan`}</p>
                  </div>
                </label>
                {activeGoals[cat] && (
                  <div className="mt-3 pt-2 border-t border-stone-800/60">
                    <label className="text-stone-400 block mb-1">Hoe goed ging het? (💧 {progressScores[cat]} druppels)</label>
                    <input type="range" min="1" max="5" value={progressScores[cat]} onChange={(e) => handleSliderChange(cat, parseInt(e.target.value))} className={`w-full accent-${colors[cat]}-500 bg-stone-800 h-1.5 rounded-lg cursor-pointer`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actie-sectie */}
      <div className="space-y-3 pt-2">
        <a href={gameState.savedLink} target="_blank" rel="noreferrer" className="block text-center text-xs text-stone-400 bg-stone-950 hover:bg-stone-800 border border-stone-800 py-2 rounded-lg transition font-mono">
          🔗 Mijn Uitgebreide Google Doc Openen
        </a>
        {!dailyReport.fileLink ? (
          <button onClick={handleSubmitReport} className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-3 rounded-xl text-sm transition cursor-pointer shadow-lg tracking-wide">
            Dien Mijn Voortgang In!
          </button>
        ) : (
          <div className="p-3 bg-stone-950/60 border border-stone-800 text-stone-500 text-center rounded-xl text-xs font-bold font-mono">
            ⚡ Ingediend! Wachten op review van de president.
          </div>
        )}
      </div>
    </div>
  );
}
