// app/layout.tsx
import "./styles/globals.css";

export const metadata = {
  title: "iPad POS",
  description: "Simple POS for iPad",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
