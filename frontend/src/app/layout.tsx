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
  title: "Shifa Salsabiila",
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
          <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {children}
          </main>
          <footer className="border-t border-gray-200 dark:border-gray-800 mt-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
              <span className="font-pixel text-[9px] text-gray-400 dark:text-gray-600">shifa salsabiila</span>
              <span className="font-mono text-xs text-gray-400 dark:text-gray-600">© {new Date().getFullYear()}</span>
            </div>
          </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
