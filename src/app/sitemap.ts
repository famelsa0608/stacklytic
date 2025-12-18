import { comparisons } from '@/lib/comparisons';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Burayı kendi vercel linkinle veya domaininle güncelle
  const baseUrl = "https://stacklytic.vercel.app"; 

  const comparisonUrls = comparisons.map((comp) => ({
    url: `${baseUrl}/compare/${comp.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...comparisonUrls,
  ];
}