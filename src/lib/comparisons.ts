export interface ComparisonData {
  slug: string;
  title: string;
  desc: string;
  p1: { name: string; price: number };
  p2: { name: string; price: number };
  content: string;
}

export const comparisons: ComparisonData[] = [
  {
    slug: "aws-vs-google-cloud",
    title: "AWS vs Google Cloud: 2025 Bulut Maliyet Analizi",
    desc: "Amazon ve Google arasındaki fiyat savaşında hangi taraf daha karlı?",
    p1: { name: "AWS", price: 0.075 },
    p2: { name: "Google Cloud", price: 0.082 },
    content: "Kurumsal projelerde AWS'in geniş ekosistemi avantaj sağlarken, Google Cloud'un veri analitiği ve yapay zeka servisleri maliyet etkinliği sunabilir..."
  },
  {
    slug: "azure-vs-digitalocean",
    title: "Microsoft Azure vs DigitalOcean: Hangi Bulut Daha Ucuz?",
    desc: "Büyük ölçekli kurumsal yapılar mı, yoksa geliştirici dostu basitlik mi?",
    p1: { name: "Azure", price: 0.078 },
    p2: { name: "DigitalOcean", price: 0.055 },
    content: "Startup'lar için DigitalOcean'ın sabit fiyatlı modelleri bütçe yönetimi açısından hayati önem taşırken, Azure hibrit bulut çözümleriyle..."
  },
  {
    slug: "vultr-vs-linode",
    title: "Vultr vs Linode: 2025 VPS Fiyat Karşılaştırması",
    desc: "Yüksek performanslı bulut sunucularında en iyi fiyat-performans oranı hangisinde?",
    p1: { name: "Vultr", price: 0.045 },
    p2: { name: "Linode", price: 0.050 },
    content: "Saf performans odaklı projelerde Vultr'un NVMe diskli sunucuları fark yaratırken, Linode topluluk desteği ve dökümantasyonuyla..."
  }
];