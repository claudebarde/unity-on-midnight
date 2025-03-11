"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Footer from "@/components/footer"
import OrangeButton from "@/components/orange-button"
import Link from "next/link"

export default function BorrowerDashboard() {
  const [activeTab, setActiveTab] = useState("amm")
  const [hasActiveLoan, setHasActiveLoan] = useState(false)

  const handleBorrow = () => {
    setHasActiveLoan(true)
  }

  const handleRepay = () => {
    setHasActiveLoan(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] font-sans">
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-[800px] mx-auto">
            <h1 className="text-xl font-bold text-[#26A69A] text-center mb-6">Borrower Dashboard</h1>

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
                    <Card className="p-4 shadow-md">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="amount">Amount</Label>
                          <Input id="amount" type="number" defaultValue="100" className="border-[#26A69A]" />
                        </div>
                        <div>
                          <Label htmlFor="duration">Duration (days)</Label>
                          <Input id="duration" type="number" defaultValue="30" className="border-[#26A69A]" />
                        </div>
                        <div>
                          <Label>Interest Rate</Label>
                          <p className="text-[#26A69A]">10% APR</p>
                        </div>
                        {!hasActiveLoan ? (
                          <OrangeButton onClick={handleBorrow} width="w-full">
                            Borrow from Pool
                          </OrangeButton>
                        ) : (
                          <OrangeButton onClick={handleRepay} width="w-full">
                            Repay Loan
                          </OrangeButton>
                        )}
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="p2p" className="mt-4 space-y-4">
                    <Card className="p-4 shadow-md">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="p2p-amount">Amount</Label>
                          <Input id="p2p-amount" type="number" defaultValue="100" className="border-[#26A69A]" />
                        </div>
                        <div>
                          <Label htmlFor="p2p-duration">Duration (days)</Label>
                          <Input id="p2p-duration" type="number" defaultValue="30" className="border-[#26A69A]" />
                        </div>
                        <div>
                          <Label>Proposed Interest Rate</Label>
                          <Input type="number" defaultValue="8" className="border-[#26A69A]" />
                          <p className="text-sm text-[#757575] mt-1">Suggested: 8-12% APR</p>
                        </div>
                        <OrangeButton width="w-full">Request P2P Loan</OrangeButton>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column */}
              <div>
                <Card className="p-4 shadow-md">
                  <h3 className="font-medium text-[#757575] mb-2">Your Trust Score</h3>
                  <div className="space-y-2">
                    <div className="bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-2 bg-[#26A69A]" 
                        style={{ width: '75%' }}
                      />
                    </div>
                    <p className="text-[#26A69A]">Score: 750</p>
                    <p className="text-[#757575]">Excellent borrowing power!</p>
                  </div>
                </Card>

                <Card className="mt-4 p-4 shadow-md">
                  <h3 className="font-medium text-[#757575] mb-2">Active Loans</h3>
                  {hasActiveLoan ? (
                    <div className="space-y-2">
                      <p className="text-[#757575]">Loan Amount: 100 tDust</p>
                      <p className="text-[#757575]">Interest Rate: 10% APR</p>
                      <p className="text-[#757575]">Duration: 30 days</p>
                      <p className="text-[#757575]">Remaining: 25 days</p>
                    </div>
                  ) : (
                    <p className="text-[#757575]">No active loans</p>
                  )}
                </Card>

                <Card className="mt-4 p-4 shadow-md">
                  <h3 className="font-medium text-[#757575] mb-2">Loan History</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[#757575]">Previous Loan #1</p>
                      <p className="text-[#757575]">Amount: 50 tDust</p>
                      <p className="text-[#757575] text-sm">Repaid on time</p>
                    </div>
                    <div>
                      <p className="text-[#757575]">Previous Loan #2</p>
                      <p className="text-[#757575]">Amount: 75 tDust</p>
                      <p className="text-[#757575] text-sm">Repaid early</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
