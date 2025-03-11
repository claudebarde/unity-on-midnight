'use client';

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Coins, Handshake, Send } from "lucide-react"
import { WalletStatus } from "@/components/wallet/WalletStatus";
import { useWallet } from "@/providers/WalletProvider";
import { WalletButton } from "@/components/wallet/WalletButton";

export default function LandingPage() {
  const { isConnected } = useWallet();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] font-sans">
      <main className="flex-grow flex min-h-screen flex-col items-center p-8 gap-8">
        {/* Hero Section */}
        <section className="w-full max-w-5xl text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to Unity App
          </h1>
          <p className="text-xl text-muted-foreground">
            Your gateway to private DeFi on Midnight
          </p>
        </section>

        {/* Wallet Status Section */}
        {isConnected && (
          <section className="w-full max-w-5xl">
            <WalletStatus />
          </section>
        )}

        {/* Features Grid */}
        <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="Private AMM"
            description="Trade tokens with zero-knowledge privacy"
          />
          <FeatureCard
            title="P2P Lending"
            description="Borrow and lend directly with other users"
          />
          <FeatureCard
            title="Trust Points"
            description="Build your credit score on-chain"
          />
        </section>

        {/* Setup Instructions Section */}
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4 max-w-[600px]">
            <h2 className="text-xl font-bold text-[#26A69A] text-center mb-6">Get Started with Midnight Lace</h2>
            <Card className="p-6 shadow-md">
              <ol className="list-decimal pl-5 space-y-4 text-[#757575]">
                <li>
                  <p>
                    <strong>Install Midnight Lace:</strong> Search 'Midnight Lace' in the Chrome Web Store and click
                    'Add to Chrome'.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Create Your Wallet:</strong> Open the extension, click 'New Wallet', and set a password.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Backup Safely:</strong> Write down your recovery words and store them securely.
                  </p>
                </li>
              </ol>
              <p className="text-center text-[#757575] mt-6 mb-4">
                Once installed, click 'Connect Midnight Lace' below.
              </p>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* AMM Pool */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-[#26A69A]/10 flex items-center justify-center">
                    <Coins className="w-10 h-10 text-[#26A69A]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#26A69A] mb-2">AMM Pool Lending</h3>
                <p className="text-[#757575]">
                  Lenders deposit tDust, borrowers draw loans, interest auto-distributes.
                </p>
              </div>

              {/* P2P Lending */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-[#26A69A]/10 flex items-center justify-center">
                    <Handshake className="w-10 h-10 text-[#26A69A]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#26A69A] mb-2">P2P Loans</h3>
                <p className="text-[#757575]">Borrow directly from lenders, repay with privacy.</p>
              </div>

              {/* P2P Payments */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-[#26A69A]/10 flex items-center justify-center">
                    <Send className="w-10 h-10 text-[#26A69A]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#26A69A] mb-2">P2P Payments</h3>
                <p className="text-[#757575]">Pay securely for services, up to 100 tDust.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4 max-w-[600px]">
            <h2 className="text-xl font-bold text-[#26A69A] text-center mb-6">How to Use the AMM Pool</h2>
            <Card className="p-6 shadow-md">
              <ol className="list-decimal pl-5 space-y-3 text-[#757575] mb-6">
                <li>
                  <p>
                    <strong>Lenders:</strong> Deposit tDust to fund loans.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Borrowers:</strong> Draw 100 tDust, repay 110 tDust.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Interest auto-balances</strong> via AMM algorithm.
                  </p>
                </li>
              </ol>
              <div className="text-center p-3 bg-[#26A69A]/10 rounded-md">
                <h4 className="text-base font-bold text-[#26A69A] mb-1">Privacy Guaranteed</h4>
                <p className="text-sm text-[#757575]">ZKPs hide all transaction details.</p>
              </div>
            </Card>
          </div>
        </section>
      </main>

      {/* Sticky Footer */}
      <footer className="sticky bottom-0 w-full bg-[#F5F5F5] border-t border-gray-200 p-3 shadow-md">
        <div className="container mx-auto flex justify-end items-center">
          <span className="text-xs text-[#757575] mr-2">Powered by</span>
          <Image
            src="/images/midnight-logo.png"
            alt="Midnight Logo"
            width={100}
            height={30}
            style={{ width: 'auto', height: '30px' }}
          />
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2">{description}</p>
    </div>
  );
}
