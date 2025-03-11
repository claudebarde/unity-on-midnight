"use client"

import { Card } from "@/components/ui/card"
import Footer from "@/components/footer"
import OrangeButton from "@/components/orange-button"
import { Copy } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const did = "mid1q8z3...7xkj"

  const copyDID = () => {
    navigator.clipboard.writeText(did)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const disconnectWallet = () => {
    // Logic to disconnect wallet
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] font-sans">
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-[600px] mx-auto">
            <Card className="p-6 shadow-lg">
              <h1 className="text-xl font-bold text-[#26A69A] text-center mb-6">Profile</h1>

              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-2">
                  <p className="text-base text-[#757575]">DID: {did}</p>
                  <button onClick={copyDID} className="text-[#26A69A] hover:text-[#26A69A]/80">
                    {copied ? <span className="text-xs">Copied!</span> : <Copy size={16} />}
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-xl text-[#26A69A] font-medium">TrustPoints: 45</p>
                  <p className="text-xs text-[#757575] mt-1">Breakdown: 10 payments, 1 loan</p>
                </div>

                <div className="text-center">
                  <p className="text-base text-[#757575]">Investments: 200 tDust Deposited, 10 tDust Profit</p>
                </div>

                <div className="flex justify-center pt-4">
                  <OrangeButton onClick={disconnectWallet}>Disconnect Wallet</OrangeButton>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
