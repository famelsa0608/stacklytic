import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// Front-end'e dönecek verinin tipi
interface ProductData {
  id: string;
  title: string;
  price: number;
  image: string;
  url: string;
  source: string; // 'Akakçe', 'Cimri' vb.
  seller?: string; // 'Migros', 'Amazon' vb.
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Lütfen bir ürün ismi girin.' }, { status: 400 });
  }

  console.log(`🕵️ Backend Aranıyor: ${query}`);
  const products: ProductData[] = [];

  // --- İNSAN TAKLİDİ YAPAN HEADERLAR (User-Agent Spoofing) ---
  // Bu kısım çok önemli. Bot olduğumuzu gizlemeye çalışıyoruz.
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
    'Referer': 'https://www.google.com/',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  };

  try {
    // 1. ADIM: Akakçe Arama Sayfasına Git
    const targetUrl = `https://www.akakce.com/arama/?q=${encodeURIComponent(query)}`;
    
    const response = await fetch(targetUrl, { headers });
    
    if (!response.ok) {
        throw new Error(`Akakçe Erişim Hatası: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // 2. ADIM: HTML İçinden Verileri Ayıkla (Parsing)
    // Akakçe'nin listeleme yapısı genelde "ul#CPL > li" içindedir.
    $('ul#CPL > li').each((index, element) => {
        // Çok fazla sonuç çekmemek için ilk 5-10 ürünü alalım
        if (index > 8) return;

        // a) Ürün Linki
        let link = $(element).find('a').attr('href');
        // Akakçe linkleri "/urun/..." diye başlar, başına domain eklemeliyiz
        if (link && !link.startsWith('http')) {
            link = `https://www.akakce.com${link}`;
        }

        // b) Ürün Görseli
        // Bazen lazy-load olur, data-src veya src kontrol edilir
        const image = $(element).find('img').attr('src') || 
                      $(element).find('img').attr('data-src') || 
                      'https://via.placeholder.com/150';

        // c) Ürün Başlığı
        const title = $(element).find('.pn_v8').text().trim();

        // d) Fiyat
        // "1.250,00 TL" formatında gelir, sayıya çevirmemiz lazım
        const priceText = $(element).find('.pt_v8').text().trim();
        
        // e) Satıcı (Opsiyonel - bazen listede görünmez, detayda görünür)
        // Akakçe listede bazen satıcı göstermez ama en ucuz satıcıyı tahmin edebiliriz.
        // Şimdilik "Piyasa" diyoruz.
        
        if (title && priceText && link) {
            // Fiyatı temizle (TL yazısını at, noktaları sil, virgülü nokta yap)
            const cleanPrice = parseFloat(
                priceText.replace('TL', '').replace(/\./g, '').replace(',', '.').trim()
            );

            products.push({
                id: `ak-${index}`,
                source: 'Akakçe',
                seller: 'En Uygun Satıcı', // Detay sayfasına girilmediği için genel yazdık
                title: title,
                price: cleanPrice,
                image: image,
                url: link
            });
        }
    });

    console.log(`✅ ${products.length} ürün bulundu.`);

  } catch (error) {
    console.error("Scraping Hatası:", error);
    // Hata olsa bile boş dizi dön ki frontend çökmesin
  }

  // --- SONUÇ ---
  if (products.length === 0) {
      // Eğer Akakçe engellerse veya ürün yoksa boş döner
      return NextResponse.json({ message: 'Ürün bulunamadı veya erişim engellendi.' }, { status: 404 });
  }

  // En ucuzdan pahalıya sıralayıp gönderelim
  return NextResponse.json(products.sort((a, b) => a.price - b.price));
}