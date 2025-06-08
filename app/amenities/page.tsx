import type React from "react"
import {
  Wifi,
  Tv,
  Coffee,
  Utensils,
  Bath,
  BedDouble,
  Fan,
  Wind,
  Car,
  Lock,
  Shirt,
  AmbulanceIcon as FirstAid,
} from "lucide-react"

export default function AmenitiesPage() {
  return (
    <div className="pt-24 pb-16">
      
      <section className="py-12 md:py-20 bg-[#0E2838] text-white">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold">Amenities</h1>
            <p className="text-lg md:text-xl opacity-90">Everything you need for a comfortable stay</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-dark">Your Comfort is Our Priority</h2>
              <p className="text-gray-600 text-lg">
                We've equipped our Airbnb with all the amenities needed for a comfortable and convenient stay. From
                high-speed WiFi to premium bedding, we've thought of everything to make you feel at home.
              </p>
              <p className="text-gray-600 text-lg">
                If there's anything specific you need during your stay, don't hesitate to let us know, and we'll do our
                best to accommodate your request.
              </p>
            </div>
            <div>
              <img
                src="/images/WhatsApp Image 2025-05-02 at 21.05.55_93e141e2.jpg"
                alt="Comfortable living space"
                className="rounded-lg shadow-lg object-cover w-full h-[400px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container px-6">
          <h2 className="text-3xl font-bold text-primary-dark mb-12 text-center">What We Offer</h2>

          <div className="space-y-16">
  
            <AmenityCategory
              title="Essentials"
              items={[
                { icon: <Wifi />, name: "High-speed WiFi" },
                { icon: <Tv />, name: "Smart TV with Netflix" },
                { icon: <Lock />, name: "24/7 security" },
                { icon: <FirstAid />, name: "First aid kit" },
              ]}
            />

            {/* Kitchen & Dining */}
            <AmenityCategory
              title="Kitchen & Dining"
              items={[
                { icon: <Coffee />, name: "Coffee maker" },
                { icon: <Utensils />, name: "Fully equipped kitchen" },
                { icon: <Utensils />, name: "Dining area" },
                { icon: <Utensils />, name: "Cooking essentials" },
              ]}
            />

            {/* Bedroom & Bathroom */}
            <AmenityCategory
              title="Bedroom & Bathroom"
              items={[
                { icon: <BedDouble />, name: "Queen-sized bed" },
                { icon: <Bath />, name: "Hot water shower" },
                { icon: <Shirt />, name: "Iron & ironing board" },
                { icon: <Bath />, name: "Towels & toiletries" },
              ]}
            />

            {/* Comfort & Convenience */}
            <AmenityCategory
              title="Comfort & Convenience"
              items={[
                { icon: <Wind />, name: "Air conditioning" },
                { icon: <Fan />, name: "Ceiling fans" },
                { icon: <Car />, name: "Free parking on premises" },
                { icon: <Lock />, name: "Self check-in" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 md:py-24">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-primary-dark mb-8 text-center">Additional Services</h2>

            <div className="bg-white rounded-lg border shadow-sm p-8">
              <div className="space-y-6">
                <AdditionalService
                  title="Airport Transfer"
                  description="We can arrange airport pickup and drop-off for an additional fee."
                  price="$25 each way"
                />
                <AdditionalService
                  title="Cleaning Service"
                  description="Additional cleaning during your stay available upon request."
                  price="$15 per cleaning"
                />
                <AdditionalService
                  title="Grocery Delivery"
                  description="We can stock the kitchen before your arrival."
                  price="Cost of groceries + $10 service fee"
                />
                <AdditionalService
                  title="Tour Guide"
                  description="Local guides available for city tours and excursions."
                  price="Varies based on destination"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* House Rules Banner */}
      <section className="py-12 bg-primary-dark/10">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-primary-dark mb-4">House Rules</h2>
            <p className="text-gray-600 mb-6">
              We want all our guests to have a comfortable stay. Please respect these few simple rules.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-white px-4 py-2 rounded-full border">Check-in: 3:00 PM - 8:00 PM</div>
              <div className="bg-white px-4 py-2 rounded-full border">Check-out: 11:00 AM</div>
              <div className="bg-white px-4 py-2 rounded-full border">No smoking</div>
              <div className="bg-white px-4 py-2 rounded-full border">No parties</div>
              <div className="bg-white px-4 py-2 rounded-full border">No pets</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

const AmenityCategory = ({
  title,
  items,
}: {
  title: string
  items: { icon: React.ReactNode; name: string }[]
}) => {
  return (
    <div>
      <h3 className="text-2xl font-semibold text-primary-dark mb-6 border-b pb-2">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm border">
            <div className="p-3 rounded-full bg-secondary-coral/10 text-secondary-coral mb-4">{item.icon}</div>
            <span className="text-gray-800">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const AdditionalService = ({
  title,
  description,
  price,
}: {
  title: string
  description: string
  price: string
}) => {
  return (
    <div className="flex items-start justify-between border-b pb-6 last:border-0 last:pb-0">
      <div>
        <h4 className="font-semibold text-lg text-primary-dark">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="bg-secondary-coral/10 text-secondary-coral px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap">
        {price}
      </div>
    </div>
  )
}
