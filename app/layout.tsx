import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/hooks/useTheme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cognitica AI Chat Assistant",
  description:
    "A modern, responsive AI chatbot. Chat with your AI assistant for instant answers, creative writing, and more.",
  keywords: [
    "AI chatbot",
    "Cognitica AI",
    "chat assistant",
    "AI",
    "machine learning",
    "conversational AI",
  ],
  authors: [{ name: "Joshua Manuputty" }],
  creator: "Joshua Manuputty",
  publisher: "Joshua Manuputty",
  formatDetection: {
    email: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://chat-bot-hazel-tau.vercel.app"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Cognitica AI Chat Assistant",
    description: "A modern, responsive AI",
    siteName: "Cognitica AI Chat",
    images: [
      {
        url: "/vercel.svg",
        width: 1200,
        height: 630,
        alt: "Cognitica AI Chat Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cognitica AI Chat Assistant",
    description: "A modern, responsive AI chatbot powered by Cognitica AI",
    images: ["/vercel.svg"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
