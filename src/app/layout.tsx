import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gateway Holidays - Explore the World with Wonders",
  description:
    "Your gateway to unforgettable adventures and magical destinations. Expert travel planning, 24/7 support, and best price guarantee.",
  icons: {
    icon: "/logo.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
