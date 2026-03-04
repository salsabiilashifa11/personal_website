import type { Metadata } from "next";
import { Inter, Press_Start_2P, Space_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeProvider from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Shifa",
  description: "Personal website — about me, writings, and reading list",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${pressStart2P.variable} ${spaceMono.variable} font-sans antialiased min-h-screen bg-[#F8F9FA] dark:bg-[#0D0D0D] text-gray-900 dark:text-gray-100`}
      >
        <ThemeProvider>
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
