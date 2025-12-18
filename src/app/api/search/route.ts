import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) return NextResponse.json({ error: 'Sorgu yok' }, { status: 400 });

  const results = [];

  // --- 1. MIGROS (Gerçek API Kullanımı) ---
  try {
    // Migros'un frontend'inin kullandığı gizli API ucu
    const migrosPayload = {
      query: query,
      options: { sort: "RELEVANCE" }
    };

    const migrosRes = await fetch("https://www.migros.com.tr/api/product-search-service/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Referer": "https://www.migros.com.tr"
      },
      body: JSON.stringify(migrosPayload)
    });

    if (migrosRes.ok) {
      const data = await migrosRes.json();
      // Migros API yapısına göre ilk ürünü alıyoruz
      if (data.data && data.data.searchInfo && data.data.searchInfo.storeProductInfos && data.data.searchInfo.storeProductInfos.length > 0) {
        const product = data.data.searchInfo.storeProductInfos[0];
        // İndirimli fiyat varsa onu, yoksa normal satış fiyatını al
        const price = product.shownPrice || product.salePrice; 
        
        results.push({
          id: 'migros',
          name: 'Migros',
          productName: product.name, // Gerçek ürün adını da alalım
          price: (price / 100).toFixed(2), // Migros fiyatı kuruş cinsinden verir (örn: 5500 -> 55.00)
          updated: 'Canlı Veri',
          color: 'bg-orange-500'
        });
      }
    }
  } catch (e) {
    console.error("Migros Hatası:", e);
  }

  // --- 2. CARREFOURSA (HTML Scraping - Cheerio ile) ---
  try {
    const carrefourRes = await fetch(`https://www.carrefoursa.com/search/?text=${encodeURIComponent(query)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    const html = await carrefourRes.text();
    const $ = cheerio.load(html);

    // Carrefour'un ürün kartı yapısı (.product-card veya .item-price)
    // İlk ürünün fiyatını çekiyoruz
    const priceText = $('.item-price').first().text().trim() || $('.product_price').first().text().trim();
    
    // Fiyat metnini temizle (örn: "59,90 TL" -> "59.90")
    const cleanPrice = priceText.replace('TL', '').replace(/\s/g, '').replace(',', '.');

    if (cleanPrice && !isNaN(parseFloat(cleanPrice))) {
       results.push({
        id: 'carrefour',
        name: 'CarrefourSA',
        price: cleanPrice,
        updated: 'Canlı Veri',
        color: 'bg-blue-800'
      });
    }
  } catch (e) {
    console.error("Carrefour Hatası:", e);
  }

  // --- 3. A101 (Zorlu Bot Koruması) ---
  // Not: A101 sunucu taraflı istekleri çok sıkı bloklar.
  // Eğer bloklarsa yalan atmasın diye kontrol ekliyoruz.
  try {
      const a101Res = await fetch(`https://www.a101.com.tr/list/?search_text=${encodeURIComponent(query)}`, {
        headers: {
            "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
        }
      });
      const htmlA101 = await a101Res.text();
      // Basit bir regex denemesi, başarısız olursa eklemeyeceğiz.
      const matchA101 = htmlA101.match(/"currentPrice":(\d+\.?\d*)/) || htmlA101.match(/class="current-price"[^>]*>₺([\d,]+)/);
      
      if (matchA101) {
          const p = matchA101[1].replace(',', '.');
          results.push({ id: 'a101', name: 'A101', price: p, updated: 'Canlı Veri', color: 'bg-blue-500' });
      } else {
           // A101 verisi çekilemediyse boş dönüyoruz, uydurmuyoruz.
           // İstersen buraya "Fiyat Uygulamada" diye placeholder ekleyebilirsin.
      }
  } catch(e) { console.log("A101 Blokladı"); }

  // Eğer hiçbir marketten veri gelmediyse
  if (results.length === 0) {
      return NextResponse.json([{ 
          id: 'error', 
          name: 'Sonuç Bulunamadı', 
          price: '---', 
          updated: 'Lütfen ürün adını kontrol et' 
      }]);
  }

  // Ucuzdan pahalıya sırala
  return NextResponse.json(results.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)));
}