"use client"
import React, { useState } from 'react';
import { LineChart as ChartIcon, TrendingUp, MousePointerClick, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function CalculatorComponent() {
  const [scale, setScale] = useState(5000);

  const chartData = [0.2, 0.5, 0.8, 1.2, 1.8, 2.5].map((multiplier) => {
    const projectedScale = scale * multiplier;
    return {
      name: `${(projectedScale / 1000).toFixed(0)}k`,
      marketAvg: Number((projectedScale * 0.095).toFixed(0)), 
      optimized: Number((projectedScale * 0.058).toFixed(0)), 
    };
  });

  const shareLayout = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}?scale=${scale}` : '';
    if (url) {
      navigator.clipboard.writeText(url);
      alert("Hesaplama linki kopyalandı!");
    }
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
      
      <div className="flex flex-row justify-between w-full max-w-480 mx-auto min-h-screen relative z-10">
        <aside className="hidden xl:flex w-64 flex-col items-center pt-24 sticky top-0 h-screen border-r border-white/5 bg-white/1">
            <div className="w-40 h-150 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-center italic text-[10px] text-slate-800 text-center px-4">
                160x600 REKLAM
            </div>
        </aside>

        <main className="grow max-w-7xl px-8 pt-12 pb-32">
            <nav className="flex justify-between items-center mb-16 backdrop-blur-xl p-4 border border-white/5 rounded-3xl bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                        <TrendingUp className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase italic">STACKLYTIC</span>
                </div>
                <div className="flex gap-4">
                  <button onClick={shareLayout} className="text-[10px] font-bold text-blue-500 border border-blue-500/30 px-4 py-2 rounded-xl hover:bg-blue-500 hover:text-white transition-all">PAYLAŞ</button>
                  <button className="bg-white text-black px-6 py-2 rounded-xl text-xs font-black uppercase tracking-tighter hover:bg-blue-500 hover:text-white transition-all">BAŞLA</button>
                </div>
            </nav>

            <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 space-y-8">
                    <div className="p-8 rounded-4xl bg-white/3 border border-white/10 backdrop-blur-2xl text-left">
                        <span className="text-6xl font-black tracking-tighter text-white block">{(scale / 1000).toFixed(0)}k</span>
                        <input 
                            type="range" min="1000" max="100000" step="1000" value={scale} 
                            onChange={(e) => setScale(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>
                    <div className="bg-linear-to-br from-blue-600/10 to-purple-600/10 p-8 rounded-4xl border border-white/5 text-left text-xs italic">
                        <Sparkles className="w-5 h-5 text-blue-400 mb-4" />
                        <button className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-3">
                            TEKLİFLERİ GÖR <MousePointerClick className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-8 bg-white/2 border border-white/5 rounded-4xl p-10 relative flex flex-col">
                    <div className="flex items-center gap-3 mb-12">
                        <ChartIcon className="w-5 h-5 text-blue-500" />
                        <h2 className="text-[10px] font-black uppercase text-slate-500">Maliyet Matrisi</h2>
                    </div>
                    <div className="h-100 w-full grow">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <CartesianGrid strokeDasharray="10 10" stroke="#ffffff" vertical={false} opacity={0.03} />
                                <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '24px' }} />
                                <Area type="monotone" dataKey="marketAvg" stroke="#334155" fill="transparent" strokeWidth={2} strokeDasharray="8 8" />
                                <Area type="monotone" dataKey="optimized" stroke="#3b82f6" fill="url(#colorOpt)" strokeWidth={4} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </main>

        <aside className="hidden xl:flex w-64 flex-col items-center pt-24 sticky top-0 h-screen border-l border-white/5 bg-white/1">
            <div className="w-40 h-150 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-center italic text-[10px] text-slate-800 text-center px-4">
                160x600 REKLAM
            </div>
        </aside>
      </div>
    </div>
  );
}