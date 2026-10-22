import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/components/Hoc/Provider";
import Footer from "./footer/footer";
import { cn } from "@/lib/utils";
import ResponsiveNav from "@/components/Navbar/ResponsiveNav";
import { Background } from "@/components/background";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Devonance",
  description: "Simple file transfer",
};

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en" suppressHydrationWarning
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}>
      <body >
        <Provider>
          <Background />
          <div className="min-h-full flex flex-col">
            <ResponsiveNav />
            <main className="flex flex-1 items-center justify-center p-4">
              {children}
            </main>
            <Footer />
          </div>
        </Provider>
      </body>
    </html>
  );
}
