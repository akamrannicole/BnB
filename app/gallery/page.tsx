"use client"

import { useState } from "react"
import { X } from "lucide-react"

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const galleryImages = [
    {
      id: 1,
      url: "/images/WhatsApp Image 2025-05-02 at 21.05.55_93e141e2.jpg",
      alt: "Living Room",
      category: "Interior",
    },
    {
      id: 2,
      url: "/images/WhatsApp Image 2025-05-02 at 21.05.52_2f3fc363.jpg",
      alt: "Bedroom",
      category: "Interior",
    },
    {
      id: 3,
      url: "/images/WhatsApp Image 2025-05-02 at 21.05.52_6c1503ff.jpg",
      alt: "Kitchen",
      category: "Interior",
    },
    {
      id: 4,
      url: "/images/WhatsApp Image 2025-05-02 at 21.05.39_e1f22892.jpg",
      alt: "Bathroom",
      category: "Interior",
    },
    {
      id: 5,
      url: "/placeholder.svg?height=600&width=800",
      alt: "Balcony View",
      category: "Views",
    },
    {
      id: 6,
      url: "/placeholder.svg?height=600&width=800",
      alt: "Building Exterior",
      category: "Exterior",
    },
    {
      id: 7,
      url: "/images/WhatsApp Image 2025-05-02 at 21.05.54_2e90daa7.jpg",
      alt: "Dining Area",
      category: "Interior",
    },
    {
      id: 9,
      url: "/placeholder.svg?height=600&width=800",
      alt: "Neighborhood",
      category: "Neighborhood",
    },
  ]

  const categories = ["All", "Interior", "Exterior", "Views", "Neighborhood"]
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredImages =
    activeCategory === "All" ? galleryImages : galleryImages.filter((img) => img.category === activeCategory)

  return (
    <div className="pt-24 pb-16">
      <section className="py-12 md:py-20 bg-[#0E2838] text-white">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold">Gallery</h1>
            <p className="text-lg md:text-xl opacity-90">Take a visual tour of our Airbnb</p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50">
        <div className="container px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full transition ${
                  activeCategory === category
                    ? "bg-secondary-coral text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
                onClick={() => setSelectedImage(image.url)}
              >
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-64 object-cover transition transform hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white hover:text-secondary-coral"
            aria-label="Close modal"
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={selectedImage || "/placeholder.svg"}
            alt="Gallery view"
            className="max-w-full max-h-[85vh] object-contain"
          />
        </div>
      )}
    </div>
  )
}
