import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "ntrz",
  description: "Aqbobek Lyceum portal frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
