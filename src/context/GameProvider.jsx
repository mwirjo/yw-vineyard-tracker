import { useState } from 'react';
import { GameContext } from './gameContext';

export const GameProvider = ({ children }) => {
  // 1. De stabiele resources uitgebreid met 6-maandendoelen en de vaste link
    // De stabiele resources uitgebreid met Droplets en echte Talenten
  const [gameState, setGameState] = useState({
    oilInLamp: 10,
    oilReserve: 50,
    goldDroplets: 0, // Zondagse kerkdruppels
    activityPasses: 0,
    treeStatus: 'Healthy',
    savedLink: '',
    goals: { spiritual: '', social: '', intellectual: '', physical: '' },
    
    // 🔴 🔵 🟡 TALENT DRUIPERELS (Vaker te krijgen)
    talentDroplets: { red: 0, blue: 0, gold: 0 },
    
    // 🔺 🔷 👑 ECHTE TALENTEN (Extreem zeldzaam!)
    talents: { red: 0, blue: 0, gold: 0 }
  });


  // 2. Vluchtige dagelijkse rapportage (Heeft gewerkt ja/nee)
  const [dailyReport, setDailyReport] = useState({
    fileLink: '',
    submittedAt: null,
    estimatedDroplets: 0,
    status: 'Empty', // Statussen: 'Empty', 'Pending', 'Approved', 'Rejected'
  });

  // NIEUW: Functie om de langetermijn doelen en de Google Doc link eenmalig op te slaan
  const saveLongTermSetup = (link, spiritualGoal, socialGoal, intellectualGoal, physicalGoal) => {
    setGameState(prev => ({
      ...prev,
      savedLink: link,
      goals: {
        spiritual: spiritualGoal,
        social: socialGoal,
        intellectual: intellectualGoal,
        physical: physicalGoal
      }
    }));
  };

  // Aangepast: Meiden klikken op de knop om te rapporteren dat ze gewerkt hebben aan hun plan
  const submitDailyProgress = (link, dropletsClaimed) => {
    setGameState(prev => ({
      ...prev,
      oilInLamp: prev.oilInLamp + dropletsClaimed
    }));

    setDailyReport({
      fileLink: link,
      submittedAt: new Date().toISOString(),
      estimatedDroplets: dropletsClaimed,
      status: 'Pending'
    });
  };

  // Dagelijkse automatische reset: De link verdwijnt, de status gaat terug naar leeg
  const triggerDailyReset = () => {
    setDailyReport({
      fileLink: '',
      submittedAt: null,
      estimatedDroplets: 0,
      status: 'Empty'
    });
  };

  // Admin acties (Alleen voor jou als president)
    const adminApproveReport = () => {
    let dropResult = {
      category: 'oil', // 'oil', 'droplet', 'talent'
      rarity: 'common', // 'common' (rood), 'uncommon' (blauw), 'rare' (goud)
      amount: 0
    };

    const mainRoll = Math.random(); // 0.0 tot 1.0

    setGameState(prev => {
      let updatedDroplets = { ...prev.talentDroplets };
      let updatedTalents = { ...prev.talents };
      let updatedReserve = prev.oilReserve;
      let updatedPasses = prev.activityPasses;

      // 🎰 STAGE 1: De 30% kans op de Talent-familie!
      if (mainRoll < 0.30) {
        const itemTypeRoll = Math.random(); // Bepaalt Droplet vs Echt Talent
        const rarityRoll = Math.random();   // Bepaalt Rood vs Blauw vs Goud

        // Bepaal eerst de zeldzaamheid (Rood: 70%, Blauw: 25%, Goud: 5%)
        const chosenRarity = rarityRoll < 0.05
          ? 'rare'
          : rarityRoll < 0.30
            ? 'uncommon'
            : 'common';

        dropResult.rarity = chosenRarity;

        // A. Is het een ECHT TALENT? (Heel zeldzaam: bijv. 10% kans binnen de winst)
        if (itemTypeRoll < 0.10) {
          dropResult.category = 'talent';
          if (chosenRarity === 'rare') {
            updatedTalents.gold += 1;
            updatedPasses += 1; // Goud talent geeft een Activity Pass!
          }
          else if (chosenRarity === 'uncommon') updatedTalents.blue += 1;
          else updatedTalents.red += 1;
        } 
        // B. Is het een TALENT DROPLET? (Komt vaker voor: 90% van de winst)
        else {
          dropResult.category = 'droplet';
          if (chosenRarity === 'rare') updatedDroplets.gold += 1;
          else if (chosenRarity === 'uncommon') updatedDroplets.blue += 1;
          else updatedDroplets.red += 1;
        }
      } 
      // 💧 STAGE 2: De overige 70% kans -> Gewone Olie-bonus voor de reserve
      else {
        dropResult.category = 'oil';
        const oilBonus = Math.floor(Math.random() * 16) + 10; // 10 tot 25 druppels
        dropResult.amount = oilBonus;
        updatedReserve += oilBonus;
      }

      return {
        ...prev,
        talentDroplets: updatedDroplets,
        talents: updatedTalents,
        oilReserve: updatedReserve,
        activityPasses: updatedPasses
      };
    });

    setDailyReport(prev => ({
      ...prev,
      status: 'Approved',
      droppedTalent: dropResult
    }));
  };


  const adminRejectReport = (penaltyAmount) => {
    setDailyReport(prev => ({ ...prev, status: 'Rejected' }));
    setGameState(prev => ({
      ...prev,
      oilInLamp: Math.max(0, prev.oilInLamp - penaltyAmount)
    }));
  };

  return (
    <GameContext.Provider value={{ 
      gameState, 
      dailyReport, 
      saveLongTermSetup, // Geëxporteerd naar de app!
      submitDailyProgress, 
      triggerDailyReset, 
      adminApproveReport, 
      adminRejectReport 
    }}>
      {children}
    </GameContext.Provider>
  );
};
