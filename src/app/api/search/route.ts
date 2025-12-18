import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Sorgu bulunamadı' }, { status: 400 });
  }

  // BURASI KRİTİK: Gerçek dünyada burada 'Puppeteer' veya 'Cheerio' kütüphaneleriyle 
  // market sitelerine istek atılır. Şimdilik arama terimine göre 
  // gerçekçi fiyatlar döndüren bir motor kuruyoruz.
  
  const results = [
    { id: 'a101', name: 'A101', price: (Math.random() * 20 + 50).toFixed(2), updated: 'Az önce' },
    { id: 'sok', name: 'Şok Market', price: (Math.random() * 20 + 52).toFixed(2), updated: 'Az önce' },
    { id: 'migros', name: 'Migros', price: (Math.random() * 20 + 65).toFixed(2), updated: '5 dk önce' },
    { id: 'bim', name: 'BİM', price: (Math.random() * 20 + 51).toFixed(2), updated: 'Az önce' },
    { id: 'file', name: 'File Market', price: (Math.random() * 20 + 55).toFixed(2), updated: 'Az önce' },
  ];

  // Fiyata göre sırala
  results.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

  return NextResponse.json(results);
}