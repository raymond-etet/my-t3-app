import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { AuthProvider } from "~/app/providers";

export const metadata: Metadata = {
  title: "T3 应用",
  description: "使用 T3 技术栈构建的应用",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh" className={`${GeistSans.variable}`} data-theme="light">
      <body className="min-h-screen bg-base-100 font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
