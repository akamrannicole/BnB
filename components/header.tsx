"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Mail, MapPin, Phone, Facebook, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HomeIcon } from "@heroicons/react/24/solid"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header className="fixed w-full z-50">
      <div className="bg-primary-dark text-white py-2 px-4 hidden md:block">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              <span>kilimani.haven@gmail.com</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Golden Mango Heights, Kilimani, Nairobi, Kenya</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="https://facebook.com" className="hover:text-secondary-coral transition">
              <Facebook className="h-4 w-4" />
            </Link>
            <Link href="https://instagram.com" className="hover:text-secondary-coral transition">
              <Instagram className="h-4 w-4" />
            </Link>
            <Link href="tel:+254712345678" className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              <span>+254 713 908 113</span>
            </Link>
          </div>
        </div>
      </div>

      <div className={cn("bg-white py-4 px-6 transition-all duration-300 shadow-sm", isScrolled && "shadow-md")}>
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <HomeIcon className="w-6 h-6 text-black" />
            <span className="font-bold text-xl md:text-2xl text-primary-dark">
              Kilimani<span className="text-secondary-coral">Haven</span>
            </span>
  
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <NavItem href="/" label="Home" />
            <NavItem href="/about" label="About" />
            <NavItem href="/gallery" label="Gallery" />
            <NavItem href="/amenities" label="Amenities" />
            <NavItem href="/contact" label="Contact" />
              <Link href="/booking" className="block">
              <Button className="w-full bg-[#F26D50] hover:bg-[#F26D50]/90 text-white">Book Now</Button>
            </Link>
          </nav>
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6 text-primary-dark" /> : <Menu className="h-6 w-6 text-primary-dark" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 py-4 px-6 z-50 border-t">
          <nav className="flex flex-col space-y-4">
            <MobileNavItem href="/" label="Home" onClick={() => setIsOpen(false)} />
            <MobileNavItem href="/about" label="About" onClick={() => setIsOpen(false)} />
            <MobileNavItem href="/gallery" label="Gallery" onClick={() => setIsOpen(false)} />
            <MobileNavItem href="/amenities" label="Amenities" onClick={() => setIsOpen(false)} />
            <MobileNavItem href="/contact" label="Contact" onClick={() => setIsOpen(false)} />
             <Link href="/booking" className="block">
              <Button className="w-full bg-[#F26D50] hover:bg-[#F26D50]/90 text-white">Book Now</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

const NavItem = ({ href, label }: { href: string; label: string }) => (
  <Link href={href} className="text-primary-dark hover:text-secondary-coral transition font-medium">
    {label}
  </Link>
)

const MobileNavItem = ({
  href,
  label,
  onClick,
}: {
  href: string
  label: string
  onClick: () => void
}) => (
  <Link
    href={href}
    className="text-primary-dark hover:text-secondary-coral transition py-2 font-medium"
    onClick={onClick}
  >
    {label}
  </Link>
)

export default Header
