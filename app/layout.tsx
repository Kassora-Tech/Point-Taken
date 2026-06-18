import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Point-Taken Group — Your Partner in Excellence and Innovation",
  description:
    "Point-Taken Group delivers top-tier supply, delivery, and service solutions across South Africa. LOGIS & SAHPRA certified. Est. 2021.",
  openGraph: {
    title: "Point-Taken Group (Pty) Ltd.",
    description:
      "Your Partner in Excellence and Innovation — supply, delivery, and service solutions across South Africa.",
    siteName: "Point-Taken Group",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-[#F5F5F5]">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1A1A1A",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#F5F5F5",
            },
          }}
        />
      </body>
    </html>
  );
}
