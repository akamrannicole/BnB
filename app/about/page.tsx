import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="pt-24">
      {/* About Hero */}
      <section className="py-12 md:py-20 bg-primary-dark text-white">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold">About Kilimani Haven</h1>
            <p className="text-lg md:text-xl opacity-90">Your home away from home in the heart of Nairobi</p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <img
                src="/placeholder.svg?height=600&width=800"
                alt="Interior of Kilimani Haven"
                className="rounded-lg shadow-lg object-cover w-full h-[500px]"
              />
            </div>
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-dark">Our Story</h2>
              <p className="text-gray-600 text-lg">
                Kilimani Haven was born from a passion for hospitality and a desire to provide visitors to Nairobi with
                a truly unique and comfortable place to stay.
              </p>
              <p className="text-gray-600 text-lg">
                When my aunt first acquired this property in 2018, she envisioned creating more than just a place to
                sleep — she wanted to create an experience that captures the essence of Nairobi's vibrant culture while
                providing all the comforts of home.
              </p>
              <p className="text-gray-600 text-lg">
                Every detail of our Airbnb has been carefully considered, from the locally-sourced décor to the modern
                amenities that make your stay convenient and enjoyable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Host Profile */}
      <section className="py-16 bg-gray-50">
        <div className="container px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 order-2 lg:order-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-dark">Meet Your Host</h2>
              <p className="text-gray-600 text-lg">
                Hello, I'm [Your Aunt's Name], a proud Nairobi local with over 5 years of experience in hospitality. I'm
                passionate about making sure my guests have an exceptional stay and leave with wonderful memories of
                Kenya.
              </p>
              <p className="text-gray-600 text-lg">
                I personally ensure that Kilimani Haven is always immaculate, comfortable, and ready to welcome guests.
                I'm always available to provide recommendations on local restaurants, attractions, and hidden gems that
                only locals know about.
              </p>
              <div className="pt-4">
                <Link href="/contact">
                  <Button className="bg-secondary-coral hover:bg-secondary-coral/90">Get in Touch</Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 order-1 lg:order-2 flex justify-center">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="Your Host"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24">
        <div className="container px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">Why Choose Kilimani Haven</h2>
            <p className="text-gray-600 text-lg">We strive to make your stay exceptional in every way</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Prime Location"
              description="Located in the upscale Kilimani neighborhood with easy access to shopping, dining, and attractions"
            />
            <FeatureCard
              title="Beautiful Design"
              description="Thoughtfully designed space that combines comfort with elegant African-inspired decor"
            />
            <FeatureCard
              title="Personalized Service"
              description="We provide personalized recommendations and assistance throughout your stay"
            />
            <FeatureCard
              title="Fully Equipped"
              description="Everything you need for a comfortable stay, from high-speed WiFi to kitchen essentials"
            />
            <FeatureCard
              title="Clean & Safe"
              description="We maintain rigorous cleaning standards and prioritize your security and privacy"
            />
            <FeatureCard
              title="Local Experience"
              description="Experience Nairobi like a local with our insider tips and recommendations"
            />
          </div>
        </div>
      </section>

      {/* Local Attractions */}
      <section className="py-16 bg-gray-50">
        <div className="container px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-12 text-center">Nearby Attractions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AttractionCard
              title="Nairobi National Park"
              distance="15 km"
              description="Experience wildlife in their natural habitat just minutes from the city center"
              imageUrl="/placeholder.svg?height=300&width=500"
            />
            <AttractionCard
              title="Giraffe Centre"
              distance="10 km"
              description="Get up close with the endangered Rothschild's giraffe at this conservation center"
              imageUrl="/placeholder.svg?height=300&width=500"
            />
            <AttractionCard
              title="Karen Blixen Museum"
              distance="12 km"
              description="Visit the former home of the famous Danish author of 'Out of Africa'"
              imageUrl="/placeholder.svg?height=300&width=500"
            />
            <AttractionCard
              title="Maasai Market"
              distance="3 km"
              description="Shop for traditional crafts, jewelry, and souvenirs at this colorful market"
              imageUrl="/placeholder.svg?height=300&width=500"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-secondary-coral text-white">
        <div className="container px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Experience Kilimani Haven For Yourself</h2>
            <p className="text-lg md:text-xl">Book your stay today and discover why our guests keep coming back</p>
            <div className="pt-4">
              <Button className="bg-white text-secondary-coral hover:bg-gray-100 text-lg py-6 px-8">
                Book Your Stay
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border">
    <div className="flex items-center mb-4">
      <div className="p-2 rounded-full bg-secondary-coral/10">
        <Check className="h-5 w-5 text-secondary-coral" />
      </div>
      <h3 className="text-xl font-semibold text-primary-dark ml-3">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
)

const AttractionCard = ({
  title,
  distance,
  description,
  imageUrl,
}: {
  title: string
  distance: string
  description: string
  imageUrl: string
}) => (
  <div className="flex flex-col md:flex-row bg-white rounded-lg overflow-hidden shadow-sm">
    <div className="md:w-1/3">
      <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-48 md:h-full object-cover" />
    </div>
    <div className="md:w-2/3 p-6">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold text-primary-dark">{title}</h3>
        <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600">{distance}</span>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
)
