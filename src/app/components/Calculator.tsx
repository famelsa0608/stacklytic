"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart as ChartIcon, TrendingUp, MousePointerClick, Sparkles, Menu } from 'lucide-react';
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
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      
      <div className="flex flex-col xl:flex-row justify-between w-full max-w-480 mx-auto min-h-screen relative z-10">
        
        {/* MASAÜSTÜ SOL REKLAM (Mobilde Gizli) */}
        <aside className="hidden xl:flex w-64 flex-col items-center pt-24 sticky top-0 h-screen border-r border-white/5 bg-white/1">
            <div className="w-40 h-150 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-center italic text-[10px] text-slate-800 text-center px-4">
                160x600 REKLAM
            </div>
        </aside>

        {/* ANA İÇERİK */}
        <main className="grow w-full max-w-7xl px-4 md:px-8 pt-6 md:pt-12 pb-20">
            
            {/* Navbar - Mobil Uyumlu */}
            <motion.nav 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center mb-8 md:mb-16 backdrop-blur-xl p-3 md:p-4 border border-white/5 rounded-2xl md:rounded-3xl bg-black/20"
            >
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-linear-to-br from-blue-500 to-indigo-700 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                        <TrendingUp className="text-white w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic">STACKLYTIC</span>
                </div>
                <div className="flex gap-2 md:gap-4">
                  <button onClick={shareLayout} className="hidden sm:block text-[10px] font-bold text-blue-500 border border-blue-500/30 px-4 py-2 rounded-xl hover:bg-blue-500 hover:text-white transition-colors">
                    PAYLAŞ
                  </button>
                  <button className="bg-white text-black px-4 md:px-6 py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-tighter">
                    BAŞLA
                  </button>
                </div>
            </motion.nav>

            {/* MOBİL ÜST REKLAM (Sadece Mobilde) */}
            <div className="xl:hidden w-full h-20 bg-white/2 border border-white/5 rounded-xl mb-8 flex items-center justify-center italic text-[10px] text-slate-700 uppercase tracking-widest">
                Mobil Banner Reklam
            </div>

            <div className="grid lg:grid-cols-12 gap-6 md:gap-10">
                
                {/* Kontrol Paneli */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-4 space-y-6 md:space-y-8"
                >
                    <div className="p-6 md:p-8 rounded-3xl md:rounded-4xl bg-white/3 border border-white/10 backdrop-blur-2xl text-left">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 block">Ölçek</span>
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-5xl md:text-6xl font-black tracking-tighter text-white">{(scale / 1000).toFixed(0)}k</span>
                            <span className="text-slate-500 font-bold uppercase text-xs">İstek</span>
                        </div>
                        <input 
                            type="range" min="1000" max="100000" step="1000" value={scale} 
                            onChange={(e) => setScale(parseInt(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>

                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-linear-to-br from-blue-600/10 to-purple-600/10 p-6 md:p-8 rounded-3xl md:rounded-4xl border border-white/5 text-left"
                    >
                        <Sparkles className="w-5 h-5 text-blue-400 mb-4" />
                        <h3 className="text-lg font-black mb-2 uppercase italic text-blue-400">Optimize Et</h3>
                        <p className="text-[11px] text-slate-400 leading-relaxed mb-6">
                            Maliyetlerini <span className="text-white font-bold">%35</span> düşürmek için verilerini analiz ediyoruz.
                        </p>
                        <motion.button 
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-blue-600 text-white rounded-xl md:rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-3 shadow-lg"
                        >
                            ANALİZİ GÖR <MousePointerClick className="w-4 h-4" />
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Grafik Paneli */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-8 bg-white/2 border border-white/5 rounded-3xl md:rounded-4xl p-6 md:p-10 relative flex flex-col"
                >
                    <div className="flex justify-between items-center mb-8 md:mb-12">
                        <div className="flex items-center gap-2">
                            <ChartIcon className="w-4 h-4 text-blue-500" />
                            <h2 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Projeksiyon</h2>
                        </div>
                        <div className="flex gap-3 text-[9px] font-bold">
                          <span className="text-slate-600">MARKET</span>
                          <span className="text-blue-500 underline decoration-2 underline-offset-4">OPTIMIZE</span>
                        </div>
                    </div>
                    
                    <div className="h-64 md:h-100 w-full grow">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorOpt" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="10 10" stroke="#ffffff" vertical={false} opacity={0.03} />
                                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', fontSize: '10px' }} />
                                <Area animationDuration={1000} type="monotone" dataKey="marketAvg" stroke="#334155" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                                <Area animationDuration={1500} type="monotone" dataKey="optimized" stroke="#3b82f6" fill="url(#colorOpt)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* MOBİL ALT REKLAM (Sadece Mobilde) */}
            <div className="xl:hidden w-full h-40 bg-white/2 border border-white/5 rounded-xl mt-8 flex items-center justify-center italic text-[10px] text-slate-800 uppercase text-center px-4">
                Native Akış Reklamı <br/> (AdSense In-Feed)
            </div>

        </main>

        {/* MASAÜSTÜ SAĞ REKLAM (Mobilde Gizli) */}
        <aside className="hidden xl:flex w-64 flex-col items-center pt-24 sticky top-0 h-screen border-l border-white/5 bg-white/1">
            <div className="w-40 h-150 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-center italic text-[10px] text-slate-800 text-center px-4">
                160x600 REKLAM
            </div>
        </aside>

      </div>
    </div>
  );
}