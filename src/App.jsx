
import { GameProvider } from './context/GameProvider';
import VineyardDashboard from './components/VineyardDashboard';
import AdminDashboard from './components/AdminDashboard'; // 1. Voeg deze import toe!

export default function App() {
  return (
    <GameProvider>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-stone-950 text-stone-100">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-serif text-amber-500 font-bold tracking-wide">
            🫙 YW Vineyard Tracker
          </h1>
          <p className="text-xs text-stone-400 mt-1 font-mono">
            G-Schijf Project Mode Actief ⚡
          </p>
        </header>

        <main className="w-full max-w-md space-y-6"> {/* 2. Toegevoegd: space-y-6 voor mooie tussenruimte */}
          {/* Toont de actieve meiden-interface */}
          <VineyardDashboard />

          {/* 3. Voeg hier jouw admin-dashboard review feed toe! */}
          <AdminDashboard />
        </main>
      </div>
    </GameProvider>
  );
}
