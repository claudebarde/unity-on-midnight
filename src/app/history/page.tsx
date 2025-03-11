import { Card } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function TransactionHistory() {
  // Sample transaction data
  const transactions = [
    {
      id: 1,
      type: "AMM Loan",
      amount: "100 tDust",
      action: "Borrowed",
      date: "03/01/2025",
    },
    {
      id: 2,
      type: "P2P Payment",
      amount: "50 tDust",
      action: "Sent to mid1q8z3...7xkj",
      date: "03/05/2025",
    },
    {
      id: 3,
      type: "Repayment",
      amount: "10 tDust",
      action: "to Pool",
      date: "03/10/2025",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] font-sans">
      <Header isWalletConnected={true} />

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-[600px] mx-auto">
            <h1 className="text-xl font-bold text-[#26A69A] text-center mb-6">Transaction History</h1>

            <div className="space-y-4">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="p-4 shadow-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-[#757575]">
                        {transaction.type}: {transaction.amount} {transaction.action}
                      </h3>
                      <p className="text-sm text-[#757575]">{transaction.date}</p>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-[#26A69A]" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

