export const metadata = {
  title: "Stacklytic | Cloud Cost Intelligence",
  description: "2025'in en gelişmiş bulut maliyet hesaplayıcısı.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}