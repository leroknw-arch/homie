import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "HOMIE",
  description: "Marketing Execution Platform for modern Heads of Marketing."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
