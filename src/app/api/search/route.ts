import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// Tip Tanımları
interface ProductResult {
  id: string;
  name: string;
  productName: string;
  price: string;
  updated: string;
  color: string;
  image?: string;
  link?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 3) {
      return NextResponse.json([{ 
          id: 'warn', 
          name: 'Sorgu Kısa', 
          productName: 'En az 3 harf giriniz (Örn: Süt)',
          price: '0.00', 
          updated: 'Uyarı',
          color: 'bg-yellow-500',
          link: '#'
      }]);
  }

  console.log(`🛒 Pazarama ve Yerel Marketler Taranıyor: ${query}`);
  const results: ProductResult[] = [];

  // Tarayıcı Taklidi Yapan Headerlar
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "tr-TR,tr;q=0.9",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache"
  };

  // --------------------------------------------------------------------------
  // 1. HEDEF: PAZARAMA (API Yöntemi)
  // Pazarama, İş Bankası'nın pazar yeridir. Migros/A101 ürünleri de burada satılır.
  // --------------------------------------------------------------------------
  try {
    const pazaramaUrl = `https://www.pazarama.com/arama?q=${encodeURIComponent(query)}`;
    const res = await fetch(pazaramaUrl, { headers });
    
    if (res.ok) {
        const html = await res.text();
        const $ = cheerio.load(html);

        // Pazarama ürün kartlarını yakalıyoruz
        // CSS sınıfları bazen değişir, en genel yapıyı seçiyoruz
        $('[data-testid="product-card"]').each((i, el) => {
            if (i > 3) return; // İlk 4 sonuç

            const name = $(el).find('[data-testid="product-card-name"]').text().trim();
            const priceText = $(el).find('[data-testid="product-card-price"]').text().trim();
            const img = $(el).find('img').attr('src');
            let link = $(el).find('a').attr('href');
            if (link && !link.startsWith('http')) link = `https://www.pazarama.com${link}`;

            if (name && priceText) {
                // Fiyat temizliği: "1.250,00 TL" -> "1250.00"
                const cleanPrice = priceText
                    .replace('TL', '')
                    .replace(/\./g, '')  // Binlik ayracı sil
                    .replace(',', '.')   // Ondalık ayracı düzelt
                    .trim();

                results.push({
                    id: `pazarama-${i}`,
                    name: 'Pazarama (Piyasa)',
                    productName: name,
                    price: cleanPrice,
                    updated: 'Canlı Veri',
                    color: 'bg-pink-600', // Pazarama Rengi
                    image: img,
                    link: link || '#'
                });
            }
        });
        if (results.length > 0) console.log(`✅ Pazarama: ${results.length} veri alındı.`);
    } else {
        console.log(`❌ Pazarama Erişim Hatası: ${res.status}`);
    }
  } catch (e) { console.log("Pazarama Hata"); }

  // --------------------------------------------------------------------------
  // 2. HEDEF: ONUR MARKET (HTML Yöntemi)
  // Yerel market zincirleri genelde bot koruması kullanmaz.
  // --------------------------------------------------------------------------
  if (results.length < 5) {
      try {
        const onurUrl = `https://www.onurmarket.com/arama?q=${encodeURIComponent(query)}`;
        const res = await fetch(onurUrl, { headers });

        if (res.ok) {
            const html = await res.text();
            const $ = cheerio.load(html);

            $('.showcase-content').each((i, el) => {
                if (i > 2) return;
                const name = $(el).find('.showcase-title a').text().trim();
                const priceText = $(el).find('.showcase-price-new').text().trim();
                const img = $(el).find('.showcase-image img').attr('src');
                let link = $(el).find('.showcase-title a').attr('href');
                 if (link && !link.startsWith('http')) link = `https://www.onurmarket.com${link}`;

                if (name && priceText) {
                    const cleanPrice = priceText
                        .replace('TL', '')
                        .replace(/\s/g, '')
                        .replace(',', '.');

                    results.push({
                        id: `onur-${i}`,
                        name: 'Onur Market',
                        productName: name,
                        price: cleanPrice,
                        updated: 'Canlı Veri',
                        color: 'bg-green-600',
                        image: img,
                        link: link || '#'
                    });
                }
            });
            if (results.length > 0) console.log(`✅ Onur Market: Veri alındı.`);
        }
      } catch (e) { console.log("Onur Market Hata"); }
  }

    // --------------------------------------------------------------------------
  // 3. HEDEF: AMAZON TÜRKİYE (YEDEK)
  // Amazon bazen HTML isteğine izin verir (agresif olmazsan).
  // --------------------------------------------------------------------------
  if (results.length === 0) {
    try {
        const amazonUrl = `https://www.amazon.com.tr/s?k=${encodeURIComponent(query)}`;
        const res = await fetch(amazonUrl, { headers });
        if(res.ok) {
             const html = await res.text();
             const $ = cheerio.load(html);
             
             $('[data-component-type="s-search-result"]').each((i, el) => {
                 if (i > 1) return;
                 const name = $(el).find('h2 a span').text().trim();
                 const priceWhole = $(el).find('.a-price-whole').text().trim();
                 const priceFraction = $(el).find('.a-price-fraction').text().trim();
                 
                 if (name && priceWhole) {
                     const cleanPrice = `${priceWhole.replace(/\./g, '')}.${priceFraction}`;
                     results.push({
                         id: `amazon-${i}`,
                         name: 'Amazon TR',
                         productName: name,
                         price: cleanPrice,
                         updated: 'Canlı Veri',
                         color: 'bg-yellow-500',
                         link: '#'
                     });
                 }
             });
        }
    } catch (e) {}
  }


  // SONUÇ KONTROLÜ
  if (results.length === 0) {
      console.log("⚠️ Tüm kaynaklar erişimi reddetti.");
      return NextResponse.json([{ 
          id: 'error', 
          name: 'Bağlantı Sorunu', 
          productName: 'Marketler IP adresini engelledi.',
          price: '0.00', 
          updated: 'VPN/Proxy Gerekli',
          color: 'bg-red-500',
          link: '#'
      }]);
  }

  // Fiyata göre sırala
  return NextResponse.json(results.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)));
}