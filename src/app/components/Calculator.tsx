"use client"
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, TrendingDown, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

// 1. TİP TANIMLAMASI: 'any' yerine bunu kullanıyoruz
interface MarketResult {
  id: string;
  name: string;
  color: string;
  price: string;
  updated: string;
}

const ALL_MARKETS = [
  { id: 'a101', name: 'A101', color: 'bg-blue-600' },
  { id: 'sok', name: 'Şok Market', color: 'bg-yellow-500' },
  { id: 'migros', name: 'Migros', color: 'bg-orange-500' },
  { id: 'carrefour', name: 'CarrefourSA', color: 'bg-blue-800' },
  { id: 'bim', name: 'BİM', color: 'bg-red-600' },
  { id: 'file', name: 'File Market', color: 'bg-green-700' },
  { id: 'koza', name: 'Koza Market', color: 'bg-emerald-600' },
];

export default function Marketlytic() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  // 2. STATE GÜNCELLEMESİ: 'any[]' yerine 'MarketResult[]'
  const [activeResults, setActiveResults] = useState<MarketResult[]>([]);

 const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!searchTerm.trim()) return;

  setIsSearching(true);
  
  try {
    // Kendi oluşturduğumuz API'ye istek atıyoruz
    const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
    const data = await response.json();
    
    // API'den gelen veriyi ekrana basıyoruz
    setActiveResults(data);
  } catch (error) {
    console.error("Bot hatası:", error);
    alert("Market verileri çekilemedi, tekrar dene!");
  } finally {
    setIsSearching(false);
  }
};

  const bestPrice = useMemo(() => activeResults[0], [activeResults]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-green-100">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/20">
              <ShoppingCart className="text-white w-6 h-6" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-800 uppercase italic">MARKETLYTIC</span>
          </div>
          
          <form onSubmit={handleSearch} className="relative hidden md:block w-96">
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ürün adı (Örn: Süt, Yağ...)" 
              className="w-full bg-slate-100 border-2 border-transparent rounded-2xl py-3 pl-12 pr-4 text-sm focus:bg-white focus:border-green-500 transition-all outline-none" 
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          </form>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight"
          >
            Fiyatları Karşılaştır, <br/><span className="text-green-600 italic">Mutfakta Kazan.</span>
          </motion.h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            Tüm market zincirlerini saniyeler içinde tarıyoruz.
          </p>
        </div>

        <AnimatePresence>
          {isSearching && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 mb-10"
            >
              <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
              <h3 className="text-xl font-bold text-slate-800 uppercase tracking-widest italic">Pazar Taranıyor...</h3>
            </motion.div>
          )}
        </AnimatePresence>

        {!isSearching && activeResults.length > 0 && (
          <div className="grid gap-4 mb-12">
            {activeResults.map((market, index) => (
              <motion.div 
                key={market.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-6 bg-white rounded-[2rem] border-2 transition-all ${
                  index === 0 ? 'border-green-500 shadow-xl shadow-green-500/10' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center gap-6 text-left">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xs ${market.color}`}>
                    {market.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-800">{market.name}</h3>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1 block italic underline underline-offset-4 decoration-green-500/30">CANLI VERİ</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-black tracking-tighter ${index === 0 ? 'text-green-600' : 'text-slate-900'}`}>
                    {market.price} <span className="text-sm font-bold uppercase">TL</span>
                  </div>
                  {index === 0 && (
                    <div className="inline-flex items-center gap-1 bg-green-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded-lg mt-2">
                      <TrendingDown className="w-3 h-3" /> EN UYGUN
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isSearching && activeResults.length === 0 && (
          <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
             <div className="relative z-10">
               <AlertCircle className="w-12 h-12 text-green-400 mx-auto mb-6" />
               <h2 className="text-3xl font-black mb-4 italic leading-tight">Nerede En Ucuz?</h2>
               <p className="text-slate-400 max-w-md mx-auto mb-8">
                 Arama yaparak tüm marketlerin fiyatlarını anlık olarak karşılaştırın.
               </p>
               <div className="flex flex-wrap justify-center gap-2">
                 {ALL_MARKETS.map(m => (
                   <span key={m.id} className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-bold text-slate-300">
                     {m.name}
                   </span>
                 ))}
               </div>
             </div>
          </div>
        )}

        {activeResults.length > 0 && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             className="mt-12 p-8 bg-green-600 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-green-600/30"
           >
             <div className="text-left">
               <h4 className="font-black text-2xl tracking-tighter uppercase italic leading-none">Marketlytic Önerisi</h4>
               <p className="text-green-100 text-sm font-medium mt-3 opacity-80 leading-relaxed">
                 Taramalarımıza göre en karlı alışveriş şu an <strong>{bestPrice?.name}</strong> üzerinden yapılabilir.
               </p>
             </div>
             <button className="bg-white text-green-600 font-black px-8 py-4 rounded-2xl flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-lg uppercase text-xs tracking-widest">
               LİSTEYE EKLE <ArrowRight className="w-4 h-4" />
             </button>
           </motion.div>
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] italic">
           © 2025 Marketlytic Intelligence Unit
        </p>
      </footer>
    </div>
  );
}