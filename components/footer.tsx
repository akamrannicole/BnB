import Link from "next/link"
import { Mail, MapPin, Phone, Facebook, Instagram, Twitter } from 'lucide-react'
import { Button } from "@/components/ui/button"

const Footer = () => {
  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Kilimani<span className="text-coral">Haven</span>
            </h2>
            <p className="text-gray-300">
              Experience the comfort and luxury of our beautiful Airbnb located in the heart of Kilimani, Nairobi. Your
              perfect home away from home.
            </p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="hover:text-coral transition">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com" className="hover:text-coral transition">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com" className="hover:text-coral transition">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-coral transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-coral transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-300 hover:text-coral transition">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/amenities" className="text-gray-300 hover:text-coral transition">
                  Amenities
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-coral transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Contact Us</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-coral" />
                <span className="text-gray-300">Golden Mango Heights, Kilimani, Nairobi, Kenya</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 mt-0.5 text-coral" />
                <span className="text-gray-300">+254 713 908 113</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 mt-0.5 text-coral" />
                <span className="text-gray-300">kilimani.haven@gmail.com</span>
              </li>
            </ul>
             <Link href="/booking" className="block">
              <Button className="w-half bg-[#F26D50] hover:bg-[#F26D50]/90 text-white">Book Now</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} KilimaniHaven. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-sm text-gray-400">
            <Link href="/privacy-policy" className="hover:text-coral transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-coral transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer