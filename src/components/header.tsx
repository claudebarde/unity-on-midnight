"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { WalletButton } from "./wallet/WalletButton"
import { useWallet } from "@/providers/WalletProvider"

export default function Header() {
  const pathname = usePathname()
  const { connected } = useWallet()

  return (
    <header className="sticky top-0 z-50 w-full bg-[#26A69A] text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center">
        {/* Logo - Left */}
        <div className="flex-none">
          <Link href="/" className="text-xl font-bold">
            Unity App
          </Link>
        </div>

        {/* Navigation - Center */}
        <nav className="flex-1 flex justify-center space-x-8">
          <Link
            href="/borrower"
            className={`${!connected ? "pointer-events-none opacity-50" : ""} text-white text-base hover:text-white/80 transition-colors`}
          >
            Borrow
          </Link>
          <Link
            href="/lender"
            className={`${!connected ? "pointer-events-none opacity-50" : ""} text-white text-base hover:text-white/80 transition-colors`}
          >
            Lend
          </Link>
          <Link
            href="/profile"
            className={`${!connected ? "pointer-events-none opacity-50" : ""} text-white text-base hover:text-white/80 transition-colors`}
          >
            Profile
          </Link>
        </nav>

        {/* Wallet Button - Right */}
        <div className="flex-none">
          <WalletButton />
        </div>
      </div>
    </header>
  )
}
