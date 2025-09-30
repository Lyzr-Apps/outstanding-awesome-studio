import React, { useState } from 'react';
import parseLLMJson from './utils/jsonParser';

interface FortuneResponse {
  fortune: string;
  theme: string;
  tone: string;
  metadata: {
    length: number;
    timestamp: string;
  };
}

function App() {
  const [selectedPill, setSelectedPill] = useState<'red' | 'blue' | null>(null);
  const [fortune, setFortune] = useState<FortuneResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFortune, setShowFortune] = useState(false);

  const AGENTS = {
    red: '68dbdf8bcfbf5728ff2fa6d9',
    blue: '68dbdf959170cfcb2e8da7f3'
  };

  const generateUserId = () => `user_${Math.random().toString(36).substr(2, 9)}@test.com`;
  const generateSessionId = (agentId: string) => `${agentId}_${Math.random().toString(36).substr(2, 9)}`;

  const fetchFortune = async (agentId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'sk-default-obhGvAo6gG9YT9tu6ChjyXLqnw7TxSGY',
        },
        body: JSON.stringify({
          user_id: generateUserId(),
          agent_id: agentId,
          session_id: generateSessionId(agentId),
          message: JSON.stringify({ request: "generate_fortune" })
        }),
      });

      const data = await response.json();
      const parsedContent = parseLLMJson(data.response);
      setFortune(parsedContent);

      setTimeout(() => {
        setShowFortune(true);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching fortune:', error);
      setIsLoading(false);
    }
  };

  const handlePillClick = (pill: 'red' | 'blue') => {
    setSelectedPill(pill);
    fetchFortune(AGENTS[pill]);
  };

  const handleReset = () => {
    setSelectedPill(null);
    setFortune(null);
    setShowFortune(false);
    setIsLoading(false);
  };

  const getIcon = (theme: string) => {
    if (theme.includes('adventure') || theme.includes('challenge')) return '🚀';
    if (theme.includes('peace') || theme.includes('wisdom')) return '🧘';
    return '✨';
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-rose-900 to-pink-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,182,172,0.1),transparent_50%)] animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="h-full w-full">{Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/5 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 3}s`
              }}
            />
          ))}</div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {!selectedPill && (
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
              The Choice is Yours
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto animate-fade-in-delay">
              Select a pill to reveal your destiny. The universe awaits your decision...
            </p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              {/* Red Pill */}
              <div className="group relative">
                <button
                  onClick={() => handlePillClick('red')}
                  className="w-48 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-bold text-xl shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden focus:outline-none focus:ring-4 focus:ring-red-400/50"
                  aria-label="Choose the Red Pill for bold adventurous fortunes"
                >
                  <span className="relative z-10">Red Pill</span>
                  <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </button>
                <p className="text-red-300 mt-4 text-sm">For Bold Adventures</p>
              </div>

              {/* Blue Pill */}
              <div className="group relative">
                <button
                  onClick={() => handlePillClick('blue')}
                  className="w-48 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white font-bold text-xl shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden focus:outline-none focus:ring-4 focus:ring-blue-400/50"
                  aria-label="Choose the Blue Pill for calm wise fortunes"
                >
                  <span className="relative z-10">Blue Pill</span>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </button>
                <p className="text-blue-300 mt-4 text-sm">For Calm Wisdom</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center animate-fade-in">
            <div className="relative mb-8">
              <div className="w-20 h-20 mx-auto rounded-full border-4 border-white/20 border-t-white animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl animate-pulse">{selectedPill === 'red' ? '🔴' : '🔵'}</div>
              </div>
            </div>
            <p className="text-2xl text-white font-semibold">
              Revealing your destiny...
            </p>
            <p className="text-gray-300 mt-2">
              The cosmic forces are aligning
            </p>
          </div>
        )}

        {/* Fortune Card */}
        {showFortune && fortune && (
          <div className="w-full max-w-md animate-fortune-in">
            <div className="bg-[#271F47CC] backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden">
              {/* Glass morphism effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-400 via-rose-400 to-pink-400 rounded-full opacity-20 blur-2xl animate-float" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-red-300 via-rose-300 to-pink-200 rounded-full opacity-20 blur-2xl animate-float" style={{ animationDelay: '2s' }} />

              <div className="relative z-10 text-center">
                <div className="text-6xl mb-6 animate-bounce">{getIcon(fortune.theme)}</div>

                <h2 className="text-3xl font-bold text-white mb-6 capitalize">
                  {fortune.theme.replace('/', ' • ')}
                </h2>

                <p className={`text-lg leading-relaxed mb-8 px-4 font-medium ${
                  fortune.tone === 'bold'
                    ? 'text-red-200'
                    : 'text-blue-200'
                }`}>
                  {fortune.fortune}
                </p>

                <button
                  onClick={handleReset}
                  className="mx-auto block w-40 h-12 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-semibold text-sm shadow-lg transform hover:scale-105 transition-all duration-300 relative overflow-hidden group focus:outline-none focus:ring-4 focus:ring-indigo-400/50"
                  aria-label="Try again with different fortune"
                >
                  <span className="relative z-10">Try Again</span>
                  <div className="absolute right-4 top-3 text-lg transform group-hover:rotate-180 transition-transform duration-500"
                  style={{ filter: 'hue-rotate(340deg) saturate(1.2)' }}
                >🔄</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-delay {
          from { opacity: 0; transform: translateY(20px); }
          25% { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fortune-in {
          from { opacity: 0; transform: scale(0.8) rotateY(-15deg); }
          to { opacity: 1; transform: scale(1) rotateY(0); }
        }
        @keyframes shimmer {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-fade-in-delay {
          animation: fade-in-delay 1.5s ease-out forwards;
        }
        .animate-fortune-in {
          animation: fortune-in 1s ease-out forwards;
        }
        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .group:hover .group-hover\:rotate-180 {
          transform: rotate(180deg);
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;