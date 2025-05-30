import type React from "react"
import { Bed, Wifi, Coffee, Utensils, Star, Calendar, ArrowRight, MapPin } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <>

      <section
        className="h-screen flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(14, 40, 56, 0.7), rgba(14, 40, 56, 0.4)), url('/placeholder.svg?height=1200&width=2000')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="container px-6 text-center text-white">
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">Your Perfect Stay in Kilimani</h1>
            <p className="text-xl md:text-2xl opacity-90">Experience comfort and luxury in the heart of Nairobi</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button className="bg-coral hover:bg-coral/90 text-white text-lg py-6 px-8">
                Book Your Stay
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10 text-lg py-6 px-8"
              >
                Take a Tour
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <img
                src="/placeholder.svg?height=600&width=800"
                alt="Kilimani Haven Exterior"
                className="rounded-lg shadow-lg object-cover w-full h-[500px]"
              />
            </div>
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-navy">
                Welcome to <span className="text-coral">Kilimani Haven</span>
              </h2>
              <p className="text-gray-600 text-lg">
                Nestled in the upscale neighborhood of Kilimani, our Airbnb offers a perfect blend of comfort, style,
                and convenience for your Nairobi stay. Whether you're visiting for business or pleasure, our
                thoughtfully designed space provides all the amenities you need to feel at home.
              </p>
              <p className="text-gray-600 text-lg">
                With easy access to shopping centers, restaurants, and major attractions, you'll experience the best of
                Nairobi while enjoying our peaceful retreat.
              </p>
              <div className="pt-4">
                <Button className="bg-navy hover:bg-navy/90">Learn More About Us</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Apartment Features</h2>
            <p className="text-gray-600 text-lg">
              Our Airbnb comes with everything you need for a comfortable and memorable stay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Bed className="h-8 w-8 text-coral" />}
              title="Comfortable Bedroom"
              description="Queen-sized bed with premium linens and plush pillows for a restful sleep"
            />
            <FeatureCard
              icon={<Wifi className="h-8 w-8 text-coral" />}
              title="High-Speed WiFi"
              description="Stay connected with our reliable high-speed internet access"
            />
            <FeatureCard
              icon={<Coffee className="h-8 w-8 text-coral" />}
              title="Fully Equipped Kitchen"
              description="Modern appliances and all essentials for preparing your favorite meals"
            />
            <FeatureCard
              icon={<Utensils className="h-8 w-8 text-coral" />}
              title="Dining Area"
              description="Elegant dining space for enjoying meals and socializing"
            />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Photo Gallery</h2>
              <p className="text-gray-600 text-lg max-w-2xl">
                Take a visual tour of our beautifully designed Airbnb space
              </p>
            </div>
            <Link
              href="/gallery"
              className="mt-4 md:mt-0 flex items-center text-coral font-medium hover:underline"
            >
              View All Photos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="overflow-hidden rounded-lg shadow-md">
              <img
                src="public/images/WhatsApp Image 2025-05-02 at 21.05.55_93e141e2.jpg"
                alt="Living Room"
                className="gallery-image w-full h-64 object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-lg shadow-md">
              <img
                src="public/images/WhatsApp Image 2025-05-02 at 21.05.52_2f3fc363.jpg"
                alt="Bedroom"
                className="gallery-image w-full h-64 object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-lg shadow-md">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Kitchen"
                className="gallery-image w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">What Our Guests Say</h2>
            <p className="text-gray-600 text-lg">Don't take our word for it - hear from our satisfied guests</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              text="The apartment was immaculate and exactly as pictured. Great location and the host was very responsive. Would definitely stay again!"
              author="Sarah M."
              location="United States"
            />
            <TestimonialCard
              text="Perfect location in Kilimani! The apartment had everything we needed and was so comfortable. The host gave us great restaurant recommendations too."
              author="David K."
              location="United Kingdom"
            />
            <TestimonialCard
              text="One of the best Airbnbs I've stayed in. Clean, stylish, and the host went above and beyond to make our stay special."
              author="Amina J."
              location="Kenya"
            />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-navy text-white">
        <div className="container px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Book Your Stay?</h2>
            <p className="text-lg md:text-xl opacity-90">Check availability and reserve your dates now</p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-coral hover:bg-coral/90 text-white text-lg py-6 px-8">
                <Calendar className="mr-2 h-5 w-5" />
                Check Availability
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10 text-lg py-6 px-8"
              >
                Contact Host
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 md:py-24">
        <div className="container px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-navy">Prime Location</h2>
              <p className="text-gray-600 text-lg">
                Located in the upscale Kilimani neighborhood, our Airbnb offers easy access to:
              </p>
              <ul className="space-y-3 text-gray-600">
                <LocationFeature text="Shopping centers (Yaya Centre, Junction Mall)" />
                <LocationFeature text="Restaurants and cafés within walking distance" />
                <LocationFeature text="15 minutes to Nairobi CBD" />
                <LocationFeature text="Close to diplomatic missions and international organizations" />
                <LocationFeature text="30 minutes from Jomo Kenyatta International Airport" />
              </ul>
              <div className="pt-4">
                <Button className="bg-coral hover:bg-coral/90">Get Directions</Button>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-lg h-[400px]">
                {/* This would be replaced with an actual map, for now using placeholder */}
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-500 text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-lg">Interactive Map</p>
                    <p className="text-sm">Kilimani, Nairobi, Kenya</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) => (
  <div className="feature-card bg-white rounded-lg p-6 shadow-sm border text-center">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-navy mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
)

const TestimonialCard = ({
  text,
  author,
  location,
}: {
  text: string
  author: string
  location: string
}) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border">
    <div className="flex mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
      ))}
    </div>
    <p className="text-gray-600 mb-6 italic">"{text}"</p>
    <div className="flex items-center">
      <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
      <div>
        <p className="font-semibold text-navy">{author}</p>
        <p className="text-sm text-gray-500">{location}</p>
      </div>
    </div>
  </div>
)

const LocationFeature = ({ text }: { text: string }) => (
  <li className="flex items-center">
    <div className="h-2 w-2 rounded-full bg-coral mr-3"></div>
    <span>{text}</span>
  </li>
)