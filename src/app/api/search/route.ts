import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// Tip Tanımları
interface ProductData {
  id: string;
  title: string;
  price: number;
  image: string;
  url: string;
  source: string;
  seller?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Ürün ismi giriniz.' }, { status: 400 });
  }

  console.log(`🚀 Alternatif Kaynaklar Taranıyor: ${query}`);
  const products: ProductData[] = [];

  // Rastgele Tarayıcı Kimlikleri (User-Agent Rotation)
  // Bu, tek bir bot gibi görünmemizi engeller.
  const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
  ];

  const getRandomHeader = () => ({
    'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  });

  // --- 1. HEDEF: PAZARAMA (İş Bankası Güvencesi - Daha Az Bloklar) ---
  try {
    const pazaramaUrl = `https://www.pazarama.com/arama?q=${encodeURIComponent(query)}`;
    const res = await fetch(pazaramaUrl, { headers: getRandomHeader() });
    
    if (res.ok) {
        const html = await res.text();
        const $ = cheerio.load(html);

        $('[data-testid="product-card"]').each((i, el) => {
            if (i > 2) return; // İlk 3 sonuç
            const title = $(el).find('[data-testid="product-card-name"]').text().trim();
            const priceText = $(el).find('[data-testid="product-card-price"]').text().trim();
            const img = $(el).find('img').attr('src') || '';
            let link = $(el).find('a').attr('href');
            if (link && !link.startsWith('http')) link = `https://www.pazarama.com${link}`;

            if (title && priceText) {
                const cleanPrice = parseFloat(priceText.replace('TL', '').replace(/\./g, '').replace(',', '.').trim());
                products.push({
                    id: `pz-${i}`,
                    source: 'Pazarama',
                    title: title,
                    price: cleanPrice,
                    image: img,
                    url: link || pazaramaUrl
                });
            }
        });
        console.log("✅ Pazarama verisi alındı.");
    }
  } catch (e) { console.log("Pazarama atlandı."); }

  // --- 2. HEDEF: AMAZON TÜRKİYE (HTML Yapısı Kararlı) ---
  try {
    const amazonUrl = `https://www.amazon.com.tr/s?k=${encodeURIComponent(query)}`;
    const res = await fetch(amazonUrl, { headers: getRandomHeader() });
    
    if (res.ok) {
        const html = await res.text();
        const $ = cheerio.load(html);

        $('[data-component-type="s-search-result"]').each((i, el) => {
            if (i > 2) return;
            const title = $(el).find('h2 a span').text().trim();
            // Amazon fiyatı parça parça verir: "1.250" ve "00"
            const priceWhole = $(el).find('.a-price-whole').text().trim();
            const priceFraction = $(el).find('.a-price-fraction').text().trim();
            const img = $(el).find('.s-image').attr('src') || '';
            let link = $(el).find('h2 a').attr('href');
            if (link && !link.startsWith('http')) link = `https://www.amazon.com.tr${link}`;

            if (title && priceWhole) {
                // "1.250" -> 1250, "00" -> .00
                const cleanPrice = parseFloat(`${priceWhole.replace(/\./g, '')}.${priceFraction || '00'}`);
                
                products.push({
                    id: `amz-${i}`,
                    source: 'Amazon',
                    title: title,
                    price: cleanPrice,
                    image: img,
                    url: link || amazonUrl
                });
            }
        });
        console.log("✅ Amazon verisi alındı.");
    }
  } catch (e) { console.log("Amazon atlandı."); }

  // --- 3. HEDEF: n11 (Alternatif) ---
  try {
      const n11Url = `https://www.n11.com/arama?q=${encodeURIComponent(query)}`;
      const res = await fetch(n11Url, { headers: getRandomHeader() });

      if (res.ok) {
          const html = await res.text();
          const $ = cheerio.load(html);

          $('li.column').each((i, el) => {
              if (i > 2) return;
              const title = $(el).find('.productName').text().trim();
              const priceText = $(el).find('.newPrice ins').text().trim().split(' ')[0]; // "1.250,00 TL" -> "1.250,00"
              const img = $(el).find('.cardImage').attr('data-src') || $(el).find('.cardImage').attr('src') || '';
              const link = $(el).find('a').attr('href');

              if (title && priceText) {
                   const cleanPrice = parseFloat(priceText.replace(/\./g, '').replace(',', '.'));
                   products.push({
                      id: `n11-${i}`,
                      source: 'n11',
                      title: title,
                      price: cleanPrice,
                      image: img,
                      url: link || n11Url
                   });
              }
          });
          console.log("✅ n11 verisi alındı.");
      }
  } catch (e) { console.log("n11 atlandı."); }

  // --- SONUÇ KONTROLÜ ---
  if (products.length === 0) {
      // Hiçbir yerden veri gelmezse boş liste dönmeyelim, hata mesajı verelim
      return NextResponse.json([{
          id: 'error',
          title: 'Bağlantı Sorunu (IP Engellendi)',
          price: 0,
          image: 'https://placehold.co/600x400?text=Bloklandi',
          url: '#',
          source: 'Sistem'
      }]);
  }

  // Fiyata göre sırala (En ucuz en üstte)
  return NextResponse.json(products.sort((a, b) => a.price - b.price));
}