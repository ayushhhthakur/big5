import { PlayCircle } from 'lucide-react';

interface SplashPageProps {
  onStart: () => void;
  isEmbedded?: boolean;
}

export function SplashPage({ onStart, isEmbedded = false }: SplashPageProps) {


  return (
    <div className={`flex flex-col items-center justify-center ${isEmbedded ? 'min-h-[400px]' : 'min-h-screen'} bg-amber-50`}>
      <div className="bg-white p-8 rounded-xl border border-amber-100 w-full max-w-sm text-center animate-fade-in">
        <h1 className="text-2xl font-semibold text-amber-800 mb-4">Big Five Personality Test</h1>
        <p className="text-amber-700 mb-8 text-base">Discover your personality traits through a quick, science-based assessment.</p>
        <button
          onClick={onStart}
          className="w-full py-2 rounded bg-amber-500 text-white font-medium hover:bg-amber-600 transition"
        >
          Start Test
        </button>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(12px);} to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 0.5s cubic-bezier(.4,0,.2,1); }
      `}</style>
    </div>
  );
}