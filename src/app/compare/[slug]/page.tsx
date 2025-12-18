import { comparisons } from '@/lib/comparisons';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';

const Calculator = dynamic(() => import('@/app/components/Calculator'), { ssr: false });

export default function ComparisonPage({ params }: { params: { slug: string } }) {
  const data = comparisons.find(c => c.slug === params.slug);

  if (!data) return notFound();

  return (
    <main className="bg-[#030712] min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-8">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
          {data.title}
        </h1>
        <p className="text-slate-400 text-xl mb-12 italic">
          &quot;{data.desc}&quot;
        </p>
        
        {/* Hazırladığımız efsane hesaplayıcıyı buraya gömüyoruz */}
        <div className="mb-20">
           <Calculator />
        </div>

        {/* SEO İçin Uzun Makale Alanı */}
        <article className="prose prose-invert max-w-none pb-20 text-slate-300">
          <h2 className="text-2xl font-bold text-white uppercase tracking-widest mb-4">Maliyet Analizi</h2>
          <p>
            2025 yılında bulut altyapısı kurarken {data.p1.name} ve {data.p2.name} arasındaki seçim, projenizin ölçeğine göre değişir.
            Yapılan testlerde {data.p1.name} servisinin verimlilik oranı... (Burayı AI ile doldurtacağız).
          </p>
          {/* Buraya AdSense reklam kodu gelecek */}
          <div className="h-64 bg-slate-900 my-10 rounded-2xl flex items-center justify-center border border-dashed border-slate-700">
            <span className="text-xs text-slate-500">REKLAM ALANI - TBM POTANSİYELİ YÜKSEK</span>
          </div>
        </article>
      </div>
    </main>
  );
}