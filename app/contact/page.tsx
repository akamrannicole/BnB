"use client"

import type React from "react"
import { useState } from "react"
import { addDoc, collection, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Save message to Firestore
      await addDoc(collection(db, "messages"), {
        ...formData,
        createdAt: Timestamp.now(),
        status: "unread", // Admin can mark as read
      })

      console.log("Message saved:", formData)
      setFormSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      })
    } catch (error) {
      console.error("Error saving message:", error)
      setError("Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 pb-16">
      <section className="py-12 md:py-20 bg-[#0E2838] text-white">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold">Contact Us</h1>
            <p className="text-lg md:text-xl opacity-90">Have questions or want to make a booking? Reach out to us!</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-primary-dark mb-6">Get in Touch</h2>
                <p className="text-gray-600 text-lg">
                  Whether you have questions about availability, amenities, or need any assistance with your booking,
                  we're here to help!
                </p>
              </div>

              <div className="space-y-6">
                <ContactInfoItem icon={<Phone className="h-6 w-6" />} label="Phone" value="+254 713908113" />
                <ContactInfoItem icon={<Mail className="h-6 w-6" />} label="Email" value="kilimani.haven@gmail.com" />
                <ContactInfoItem
                  icon={<MapPin className="h-6 w-6" />}
                  label="Address"
                  value="Golden Mango Heights, Kilimani, Nairobi, Kenya"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-primary-dark mb-4">Response Time</h3>
                <p className="text-gray-600">
                  We typically respond to inquiries within 1-2 hours during business hours (8AM - 8PM EAT).
                </p>
                <p className="text-gray-600 mt-2">For urgent matters, please contact us directly by phone.</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 border">
              <h2 className="text-2xl font-bold text-primary-dark mb-6">Send Us a Message</h2>
              {formSubmitted ? (
                <div className="bg-green-50 text-green-800 rounded-lg p-6 text-center">
                  <svg
                    className="w-16 h-16 text-green-500 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                  <p className="mb-4">Your message has been sent successfully. We'll get back to you soon!</p>
                  <Button onClick={() => setFormSubmitted(false)} className="bg-green-600 hover:bg-green-700">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && <div className="bg-red-50 text-red-800 p-4 rounded-lg text-sm">{error}</div>}

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-secondary-coral"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-secondary-coral"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number (optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-secondary-coral"
                      placeholder="+254 123 456 789"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-secondary-coral"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#F26D50] hover:bg-[#f26d50cc] text-white py-3"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container px-6">
          <h2 className="text-2xl font-bold text-primary-dark mb-8 text-center">Our Location</h2>
          <div className="rounded-lg overflow-hidden shadow-md h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3988.8013043739074!2d36.78355027496571!3d-1.2937017986940063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMcKwMTcnMzcuMyJTIDM2wrA0NycxMC4xIkU!5e0!3m2!1sen!2ske!4v1749157700743!5m2!1sen!2ske"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-primary-dark mb-8 text-center">Frequently Asked Questions</h2>

            <div className="space-y-6">
              <FaqItem
                question="What is the check-in and check-out time?"
                answer="Check-in is from 3:00 PM to 8:00 PM, and check-out is by 11:00 AM. If you need early check-in or late check-out, please contact us in advance, and we'll do our best to accommodate your request."
              />
              <FaqItem
                question="Is there parking available?"
                answer="Yes, we provide free parking on the premises for our guests. The parking area is secure and monitored by CCTV cameras."
              />
              <FaqItem
                question="How far is the Airbnb from major attractions?"
                answer="Our Airbnb is centrally located in Kilimani. It's about 15 minutes to the CBD, 20 minutes to Westlands, and 30 minutes to the airport, depending on traffic."
              />
              <FaqItem
                question="Do you offer airport transfers?"
                answer="Yes, we can arrange airport pickup and drop-off for an additional fee. Please let us know your flight details in advance so we can make the necessary arrangements."
              />
              <FaqItem
                question="Is the neighborhood safe?"
                answer="Kilimani is one of the safest neighborhoods in Nairobi. It's an upscale residential area with good security. The building also has 24/7 security personnel."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

const ContactInfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) => {
  return (
    <div className="flex items-start">
      <div className="p-3 rounded-full bg-secondary-coral/10 text-secondary-coral mr-4">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-primary-dark">{label}</h3>
        <p className="text-gray-600">{value}</p>
      </div>
    </div>
  )
}

const FaqItem = ({
  question,
  answer,
}: {
  question: string
  answer: string
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold text-primary-dark mb-3">{question}</h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  )
}
