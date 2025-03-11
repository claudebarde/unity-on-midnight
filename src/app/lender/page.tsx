"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Footer from "@/components/footer"
import OrangeButton from "@/components/orange-button"
import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function LenderDashboard() {
  const [activeTab, setActiveTab] = useState("amm")
  const [isOpen, setIsOpen] = useState(false)
  const [depositAmount, setDepositAmount] = useState("100")

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] font-sans">
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-[800px] mx-auto">
            <h1 className="text-xl font-bold text-[#26A69A] text-center mb-6">Lender Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div>
                <Tabs defaultValue="amm" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="w-full bg-[#26A69A] text-white">
                    <TabsTrigger value="amm" className="w-1/2 data-[state=active]:bg-[#26A69A]/80">
                      AMM
                    </TabsTrigger>
                    <TabsTrigger value="p2p" className="w-1/2 data-[state=active]:bg-[#26A69A]/80">
                      P2P
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="amm" className="mt-4 space-y-4">
                    <div className="flex flex-col items-center space-y-4">
                      <Input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="border-[#26A69A] w-[150px]"
                        placeholder="Deposit Amount"
                      />

                      <OrangeButton width="w-full sm:w-[250px]">Deposit to Pool</OrangeButton>

                      <div className="text-center mt-4">
                        <p className="text-[#26A69A] text-base">Pool: 1000 tDust</p>
                        <p className="text-[#26A69A] text-base">Your Profit: 50 tDust</p>
                      </div>

                      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full border rounded-md p-2 mt-2">
                        <CollapsibleTrigger className="flex items-center justify-between w-full text-[#757575]">
                          <span>How to Fund</span>
                          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="text-[#757575] text-xs mt-2">
                          <ol className="list-decimal pl-5 space-y-1">
                            <li>Deposit tDust.</li>
                            <li>Earn interest.</li>
                            <li>Monitor here.</li>
                          </ol>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </TabsContent>

                  <TabsContent value="p2p" className="mt-4 space-y-4">
                    <Card className="p-4 shadow-md">
                      <h3 className="font-medium text-[#757575] mb-2">P2P Loan Request</h3>
                      <p className="text-[#757575] mb-4">100 tDust</p>
                      <div className="flex space-x-2">
                        <OrangeButton className="w-[100px]" showLogo={false}>
                          Fund
                        </OrangeButton>
                        <button className="h-12 w-[100px] border border-gray-300 rounded-lg text-[#757575]">
                          Skip
                        </button>
                      </div>
                    </Card>

                    <Card className="p-4 shadow-md">
                      <h3 className="font-medium text-[#757575] mb-2">P2P Loan Request</h3>
                      <p className="text-[#757575] mb-4">50 tDust</p>
                      <div className="flex space-x-2">
                        <OrangeButton className="w-[100px]" showLogo={false}>
                          Fund
                        </OrangeButton>
                        <button className="h-12 w-[100px] border border-gray-300 rounded-lg text-[#757575]">
                          Skip
                        </button>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column */}
              <div>
                <h3 className="font-medium text-[#757575] mb-4">Active Investments</h3>

                <Card className="p-4 shadow-md mb-4">
                  <p className="text-[#757575]">AMM: 200 tDust Deposited</p>
                  <p className="text-[#757575]">Profit: 10 tDust</p>
                </Card>

                <Card className="p-4 shadow-md mb-6">
                  <p className="text-[#757575]">P2P: 100 tDust Funded</p>
                  <p className="text-[#757575]">Borrower: mid1q8z3...7xkj</p>
                </Card>

                <div className="flex justify-center mt-8">
                  <Link href="/history">
                    <OrangeButton>View History</OrangeButton>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
