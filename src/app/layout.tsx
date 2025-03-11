import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { WalletProvider } from "@/providers/WalletProvider"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Unity App",
  description: "A DeFi lending platform built on Midnight",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WalletProvider>
            <Header />
            {children}
            <Toaster richColors />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}