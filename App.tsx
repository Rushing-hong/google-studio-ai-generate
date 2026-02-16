
import React, { useState } from 'react';
import GameScene from './components/GameScene';

const App: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(true);

  return (
    <div className="relative w-full h-screen bg-[#000308] overflow-hidden font-sans">
      {/* Game Viewport */}
      <GameScene />

      {/* Cinematic HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none border-[30px] border-black/10">
        {/* Top Left: Vessel Info */}
        <div className="absolute top-8 left-8">
          <h1 className="text-cyan-400 font-light text-3xl tracking-[0.3em] uppercase opacity-80">
            Aura <span className="font-bold text-white">Explorer</span>
          </h1>
          <div className="mt-2 flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-cyan-500/70 tracking-widest uppercase font-medium">
              Systems Optimal // Deep Sea Observation Mode
            </span>
          </div>
        </div>

        {/* Top Right: Status */}
        <div className="absolute top-8 right-8 text-right font-mono">
          <div className="text-cyan-400 text-sm">COORDINATES: UNKNOWN</div>
          <div className="text-white/50 text-[10px]">ENCRYPTION ACTIVE</div>
        </div>

        {/* Realistic Grounding Links */}
        <div className="absolute top-24 right-8 text-right pointer-events-auto">
            <p className="text-[8px] text-white/30 uppercase tracking-widest mb-1">Observation Data Sources</p>
            <a href="https://oceanexplorer.noaa.gov/facts/benthic.html" target="_blank" className="block text-[10px] text-cyan-500/50 hover:text-cyan-400 transition-colors mb-1">NOAA Benthic Studies</a>
            <a href="https://www.mbari.org/science/deep-sea-biology/" target="_blank" className="block text-[10px] text-cyan-500/50 hover:text-cyan-400 transition-colors">MBARI Marine Life</a>
        </div>

        {/* Bottom Left: Telemetry */}
        <div className="absolute bottom-12 left-12 flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-cyan-500/50 uppercase tracking-widest">Atmospheric Pressure</span>
            <span className="text-white text-xl font-light">450.2 kg/cm²</span>
          </div>
          <div className="w-32 h-[1px] bg-cyan-500/20" />
          <div className="flex flex-col">
            <span className="text-[10px] text-cyan-500/50 uppercase tracking-widest">Ambient Light Level</span>
            <span className="text-white text-xl font-light">0.02%</span>
          </div>
        </div>
      </div>

      {/* Instructions Overlay */}
      {showInstructions && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50">
          <div className="max-w-xl w-full p-12 text-center">
            <div className="inline-block px-4 py-1 border border-cyan-500/50 text-cyan-400 text-[10px] tracking-[0.5em] uppercase mb-8">
              Deep Sea Sightseeing
            </div>
            <h2 className="text-5xl font-light text-white mb-6 tracking-tight">The Silent Abyss</h2>
            <p className="text-slate-400 text-lg mb-12 font-serif italic leading-relaxed">
              Explore the untouched wonders of the deep. No objectives, no limits. Based on real-world oceanographic research visuals.
            </p>
            
            <div className="grid grid-cols-2 gap-8 text-left mb-12 border-t border-b border-white/10 py-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-500 text-xs font-bold uppercase">Navigation</span>
                  <span className="text-white text-sm font-mono">W / S / A / D</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-500 text-xs font-bold uppercase">Depth</span>
                  <span className="text-white text-sm font-mono">Up / Down</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-cyan-500 text-xs font-bold uppercase">Observation Lights</span>
                  <span className="text-white text-sm font-mono">F Key</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cyan-500 text-xs font-bold uppercase">View Mode</span>
                  <span className="text-white text-sm font-mono">Free Motion</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowInstructions(false)}
              className="group relative px-12 py-4 bg-white text-black font-bold uppercase tracking-widest overflow-hidden transition-all hover:pr-16"
            >
              <span className="relative z-10">Initiate Observation</span>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all text-xl">→</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Footer Telemetry */}
      <div className="absolute bottom-8 right-12 text-right pointer-events-none opacity-40">
        <div className="text-[10px] text-cyan-500 uppercase tracking-widest mb-1">Observation Log</div>
        <div className="text-white text-xs font-mono">SYS.TIME_RUNTIME: {Math.floor(performance.now() / 1000)}s</div>
        <div className="text-white text-xs font-mono">SIGNAL_STRENGTH: 100%</div>
      </div>
    </div>
  );
};

export default App;
