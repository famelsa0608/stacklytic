'use client';
import { useState } from 'react';

// 1. TİP TANIMI: Backend'den gelen verinin şablonunu buraya yazıyoruz.
// Bu sayede 'any' hatası ortadan kalkıyor.
interface ProductData {
  id: string;
  title: string;
  price: number;
  image: string;
  url: string;
  source: string;
  seller?: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  // 2. STATE GÜNCELLEMESİ: <any[]> yerine <ProductData[]> kullanıyoruz.
  const [results, setResults] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setResults([]);
    
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Arama hatası');
      
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setResults(data);
      }
    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row gap-2 mb-8 items-center justify-center">
        <input 
          type="text" 
          placeholder="Ürün ara (örn: iPhone 13, Süt, Çay)" 
          className="border-2 border-gray-300 p-3 flex-1 rounded-lg text-black w-full md:w-auto focus:outline-none focus:border-blue-500 transition"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button 
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold w-full md:w-auto disabled:opacity-50"
        >
          {loading ? 'Aranıyor...' : 'Ara'}
        </button>
      </div>

      {/* Yükleniyor Göstergesi */}
      {loading && (
        <div className="text-center text-gray-500 mt-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2">Fiyatlar taranıyor...</p>
        </div>
      )}

      {/* Sonuç Listesi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-xl transition duration-300 bg-white flex flex-col h-full">
            {/* Ürün Görseli */}
            <div className="h-48 flex items-center justify-center mb-4 bg-gray-50 rounded-lg p-2 relative">
               {/* Not: Scraper kullandığımız için next/image yerine standart img kullanıyoruz */}
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img 
                  src={item.image} 
                  alt={item.title} 
                  className="max-h-full max-w-full object-contain mix-blend-multiply" 
                  loading="lazy"
               />
               <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                 {item.source}
               </span>
            </div>
            
            {/* İçerik */}
            <div className="flex-1 flex flex-col">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-800 hover:text-blue-600 line-clamp-2 mb-2 text-sm leading-relaxed" title={item.title}>
                {item.title}
              </a>

              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Fiyat</p>
                        <div className="text-2xl font-bold text-gray-900">
                        {item.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} <span className="text-sm font-normal text-gray-500">TL</span>
                        </div>
                    </div>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition">
                        Satıcıya Git
                    </a>
                </div>
                {item.seller && (
                    <p className="text-xs text-gray-400 mt-2 text-right">Satıcı: {item.seller}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}