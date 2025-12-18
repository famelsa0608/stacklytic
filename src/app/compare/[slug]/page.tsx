"use client"

import { comparisons } from '@/lib/comparisons';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import React from 'react';

const Calculator = dynamic(() => import('@/app/components/Calculator'), { ssr: false });

export default function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = React.use(params);
  const data = comparisons.find(c => c.slug === unwrappedParams.slug);

  if (!data) return notFound();

  return (
    <div className="min-h-screen bg-[#02040a] text-white">
      <main className="max-w-7xl mx-auto px-8 pt-24 pb-32">
        <header className="mb-16 text-left">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-white to-slate-500 uppercase">
            {data.title}
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl leading-relaxed italic">
            &quot;{data.desc}&quot;
          </p>
        </header>

        <Calculator />

        <article className="mt-24 prose prose-invert max-w-none border-t border-white/5 pt-16">
          <h2 className="text-3xl font-bold mb-8">2025 Altyapı ve Maliyet Analizi</h2>
          <div className="text-slate-300 text-lg leading-loose space-y-6 text-left">
            <p>{data.content}</p>
          </div>
        </article>
      </main>
    </div>
  );
}