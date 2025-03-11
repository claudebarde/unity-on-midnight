import type React from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { ButtonHTMLAttributes } from "react"

interface OrangeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  showLogo?: boolean
  width?: string
}

export default function OrangeButton({
  children,
  className = "",
  showLogo = true,
  width = "w-full sm:w-[200px]",
  ...props
}: OrangeButtonProps) {
  return (
    <Button
      className={`h-12 ${width} bg-[#FF9800] hover:bg-[#FF9800]/90 text-white border-2 border-white relative ${className}`}
      {...props}
    >
      {showLogo && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lace%20Sm-avbn2m62AJYHrhdgK5y2jVIpmlgRrL.png"
            alt="Lace Logo"
            width={20}
            height={20}
          />
        </div>
      )}
      <span className={showLogo ? "ml-2" : ""}>{children}</span>
    </Button>
  )
}

