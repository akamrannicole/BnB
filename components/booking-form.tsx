"use client"

import type React from "react"
import { useState } from "react"
import { addDoc, collection, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Calendar, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format, differenceInDays } from "date-fns"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

export default function BookingForm() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    checkIn: undefined as Date | undefined,
    checkOut: undefined as Date | undefined,
    guests: "",
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
  })

  // Pricing constants
  const PRICE_PER_NIGHT = 6000 // KSH per night

  // Calculate number of nights and total price
  const calculatePricing = () => {
    if (!formData.checkIn || !formData.checkOut) {
      return { nights: 0, totalPrice: 0 }
    }

    const nights = differenceInDays(formData.checkOut, formData.checkIn)
    const totalPrice = nights * PRICE_PER_NIGHT

    return { nights: Math.max(0, nights), totalPrice }
  }

  const { nights, totalPrice } = calculatePricing()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (field: "checkIn" | "checkOut", date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: date }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Submit booking request to Firebase for admin review
      await addDoc(collection(db, "bookings"), {
        ...formData,
        checkIn: formData.checkIn ? Timestamp.fromDate(formData.checkIn) : null,
        checkOut: formData.checkOut ? Timestamp.fromDate(formData.checkOut) : null,
        nights,
        totalPrice,
        pricePerNight: PRICE_PER_NIGHT,
        createdAt: Timestamp.now(),
        status: "pending", // Admin will review and approve/decline
      })

      setSuccess(true)
      // Scroll to top to ensure success message is visible
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      console.error("Error adding booking: ", error)
      setError("Failed to submit booking. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  if (success) {
    return (
      <div className="text-center py-6 bg-green-50 border border-green-100 rounded-lg shadow-sm">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Booking Request Sent!</h3>
        <p className="text-gray-600 mb-2 text-sm">
          Thank you for your booking request. We'll review your dates and get back to you shortly.
        </p>
        <div className="bg-blue-50 p-3 rounded-lg mb-4">
          <p className="text-sm text-blue-800">
            <strong>Total Amount:</strong> KSH {totalPrice.toLocaleString()} for {nights}{" "}
            {nights === 1 ? "night" : "nights"}
          </p>
          <p className="text-xs text-blue-600 mt-1">Payment will be arranged after your booking is confirmed</p>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          A confirmation email has been sent to <span className="font-medium">{formData.email}</span>
        </p>
        <div className="flex justify-center">
          <Button
            onClick={() => {
              setSuccess(false)
              setStep(1)
              setFormData({
                checkIn: undefined,
                checkOut: undefined,
                guests: "",
                name: "",
                email: "",
                phone: "",
                specialRequests: "",
              })
            }}
            className="bg-[#F26D50] hover:bg-[#F26D50]/90 text-white text-sm px-4 py-2"
          >
            Make Another Booking
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Book Your Stay</h2>

      <div className="mb-4">
        <div className="flex items-center mb-3">
          <div
            className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${step >= 1 ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"} mr-2`}
          >
            1
          </div>
          <div className={`h-0.5 flex-1 ${step >= 2 ? "bg-orange-500" : "bg-gray-200"}`}></div>
          <div
            className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${step >= 2 ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"} mx-2`}
          >
            2
          </div>
          <div className={`h-0.5 flex-1 ${step >= 3 ? "bg-orange-500" : "bg-gray-200"}`}></div>
          <div
            className={`flex items-center justify-center w-6 h-6 rounded-full text-xs ${step >= 3 ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"} ml-2`}
          >
            3
          </div>
        </div>
        <p className="text-center text-xs text-gray-500">
          {step === 1 ? "Select Dates" : step === 2 ? "Guest Information" : "Confirm Booking"}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Check-in Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal h-9 text-sm",
                      !formData.checkIn && "text-muted-foreground",
                    )}
                  >
                    <Calendar className="mr-2 h-3 w-3" />
                    {formData.checkIn ? format(formData.checkIn, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.checkIn}
                    onSelect={(date) => handleDateChange("checkIn", date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Check-out Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal h-9 text-sm",
                      !formData.checkOut && "text-muted-foreground",
                    )}
                  >
                    <Calendar className="mr-2 h-3 w-3" />
                    {formData.checkOut ? format(formData.checkOut, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.checkOut}
                    onSelect={(date) => handleDateChange("checkOut", date)}
                    disabled={(date) => date <= (formData.checkIn || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label htmlFor="guests" className="block text-xs font-medium text-gray-700 mb-1">
                Number of Guests
              </label>
              <select
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select number of guests</option>
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
              </select>
            </div>

            {/* Price Preview */}
            {formData.checkIn && formData.checkOut && nights > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 text-sm mb-2">Price Estimate</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Rate per night:</span>
                    <span className="font-medium">KSH {PRICE_PER_NIGHT.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Number of nights:</span>
                    <span className="font-medium">{nights}</span>
                  </div>
                  <div className="border-t border-blue-200 pt-1 mt-2">
                    <div className="flex justify-between">
                      <span className="text-blue-900 font-medium">Total Amount:</span>
                      <span className="font-bold text-blue-900">KSH {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="button"
              onClick={nextStep}
              disabled={!formData.checkIn || !formData.checkOut || !formData.guests || nights <= 0}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 text-sm"
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="+254 123 456 789"
              />
            </div>

            <div>
              <label htmlFor="specialRequests" className="block text-xs font-medium text-gray-700 mb-1">
                Special Requests (optional)
              </label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Any special requests or requirements?"
              ></textarea>
            </div>

            <div className="flex gap-3">
              <Button type="button" onClick={prevStep} variant="outline" className="w-1/2 text-sm py-2">
                Back
              </Button>
              <Button
                type="button"
                onClick={nextStep}
                disabled={!formData.name || !formData.email || !formData.phone}
                className="w-1/2 bg-orange-500 hover:bg-orange-600 text-white text-sm py-2"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-base text-slate-800 mb-3">Booking Summary</h3>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-medium">
                    {formData.checkIn ? format(formData.checkIn, "PPP") : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-medium">
                    {formData.checkOut ? format(formData.checkOut, "PPP") : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Guests:</span>
                  <span className="font-medium">
                    {formData.guests} {Number.parseInt(formData.guests) === 1 ? "Guest" : "Guests"}
                  </span>
                </div>

                {/* Pricing Breakdown */}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Number of nights:</span>
                    <span className="font-medium">{nights}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rate per night:</span>
                    <span className="font-medium">KSH {PRICE_PER_NIGHT.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-800 bg-blue-50 px-2 py-1 rounded mt-1">
                    <span>Total Amount:</span>
                    <span>KSH {totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{formData.phone}</span>
                  </div>
                </div>
                {formData.specialRequests && (
                  <div className="border-t pt-2 mt-2">
                    <span className="text-gray-600 block mb-1 text-xs">Special Requests:</span>
                    <p className="text-xs">{formData.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg text-xs text-yellow-800">
              <p>
                <strong>Note:</strong> This is a booking request. We'll check availability and contact you to confirm
                your reservation. Payment will be arranged after confirmation.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mt-3 text-xs">
                <p>{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button type="button" onClick={prevStep} variant="outline" className="w-1/2 text-sm py-2">
                Back
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-1/2 bg-[#F26D50] hover:bg-[#F26D50]/90 text-white text-sm py-2"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-3 w-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Booking Request"
                )}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
