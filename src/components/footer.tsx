import Image from "next/image"

export default function Footer() {
  return (
    <footer className="sticky bottom-0 w-full bg-[#F5F5F5] border-t border-gray-200 p-3 shadow-md">
      <div className="container mx-auto flex justify-end items-center">
        <span className="text-xs text-[#757575] mr-2">Powered by</span>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Midnight%20Logo-oroaKV5NPQoYTt1L2JM27gAgHSEwyg.png"
          alt="Midnight Logo"
          width={100}
          height={30}
          style={{ width: 'auto', height: '30px' }}
        />
      </div>
    </footer>
  )
}
