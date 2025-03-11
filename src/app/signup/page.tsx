"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Header from "@/components/header"
import Footer from "@/components/footer"
import OrangeButton from "@/components/orange-button"

export default function SignupPage() {
  const [userType, setUserType] = useState("borrower")
  const [depositSent, setDepositSent] = useState(false)

  const handleSendDeposit = () => {
    // Simulate sending deposit
    setDepositSent(true)
  }

  const handleJoin = () => {
    // Redirect to appropriate dashboard based on user type
    if (userType === "borrower") {
      window.location.href = "/borrower"
    } else {
      window.location.href = "/lender"
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] font-sans">
      <Header isWalletConnected={true} />

      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-[600px] p-6 shadow-lg">
          <h1 className="text-xl font-bold text-[#26A69A] text-center mb-6">Sign Up</h1>

          <div className="space-y-6">
            <div className="text-center">
              <p className="text-base text-[#757575]">Midnight Lace: mid1q8z3...7xkj</p>
            </div>

            <div className="text-center space-y-2">
              <p className="text-base text-[#757575]">Deposit 1 tDust</p>
              <div className="flex justify-center">
                <Input className="w-[150px] border-[#26A69A]" value="1" disabled />
              </div>
            </div>

            <div className="flex justify-center">
              <OrangeButton onClick={handleSendDeposit} disabled={depositSent}>
                Send Deposit
              </OrangeButton>
            </div>

            <p className="text-xs text-[#757575] italic text-center">Refunded after first loan</p>

            <div className="space-y-2">
              <RadioGroup
                defaultValue="borrower"
                value={userType}
                onValueChange={setUserType}
                className="flex justify-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="borrower" id="borrower" />
                  <Label htmlFor="borrower" className="text-[#26A69A]">
                    I'm a Borrower
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="lender" id="lender" />
                  <Label htmlFor="lender" className="text-[#26A69A]">
                    I'm a Lender
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-center pt-4">
              <OrangeButton onClick={handleJoin} disabled={!depositSent}>
                Join
              </OrangeButton>
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}

