"use client"

import type React from "react"

import { useState } from "react"
import { addDoc, collection, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Calendar, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

export default function BookingForm() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    checkIn: undefined as Date | undefined,
    checkOut: undefined as Date | undefined,
    guests: "",
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
  })

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
      // Here we would submit the booking to Firebase
      await addDoc(collection(db, "bookings"), {
        ...formData,
        checkIn: formData.checkIn ? Timestamp.fromDate(formData.checkIn) : null,
        checkOut: formData.checkOut ? Timestamp.fromDate(formData.checkOut) : null,
        createdAt: Timestamp.now(),
        status: "pending",
      })

      setSuccess(true)
    } catch (error) {
      console.error("Error adding booking: ", error)
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-primary-dark mb-2">Booking Request Sent!</h3>
        <p className="text-gray-600 mb-6">
          Thank you for your booking request. We'll review your dates and get back to you shortly.
        </p>
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
          className="bg-secondary-coral hover:bg-secondary-coral/90"
        >
          Make Another Booking
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border">
      <h2 className="text-2xl font-bold text-primary-dark mb-6">Book Your Stay</h2>

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? "bg-secondary-coral text-white" : "bg-gray-200 text-gray-500"} mr-2`}
          >
            1
          </div>
          <div className={`h-1 flex-1 ${step >= 2 ? "bg-secondary-coral" : "bg-gray-200"}`}></div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? "bg-secondary-coral text-white" : "bg-gray-200 text-gray-500"} mx-2`}
          >
            2
          </div>
          <div className={`h-1 flex-1 ${step >= 3 ? "bg-secondary-coral" : "bg-gray-200"}`}></div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? "bg-secondary-coral text-white" : "bg-gray-200 text-gray-500"} ml-2`}
          >
            3
          </div>
        </div>
        <p className="text-center text-sm text-gray-500">
          {step === 1 ? "Select Dates" : step === 2 ? "Guest Information" : "Confirm Booking"}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.checkIn && "text-muted-foreground",
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {formData.checkIn ? format(formData.checkIn, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.checkIn}
                    onSelect={(date) => handleDateChange("checkIn", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.checkOut && "text-muted-foreground",
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {formData.checkOut ? format(formData.checkOut, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.checkOut}
                    onSelect={(date) => handleDateChange("checkOut", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Guests
              </label>
              <select
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-secondary-coral"
              >
                <option value="">Select number of guests</option>
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
              </select>
            </div>

            <Button
              type="button"
              onClick={nextStep}
              disabled={!formData.checkIn || !formData.checkOut || !formData.guests}
              className="w-full bg-secondary-coral hover:bg-secondary-coral/90 text-white py-3"
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-secondary-coral"
                placeholder="Your full name"
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
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-secondary-coral"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-secondary-coral"
                placeholder="+254 123 456 789"
              />
            </div>

            <div>
              <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                Special Requests (optional)
              </label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-secondary-coral"
                placeholder="Any special requests or requirements?"
              ></textarea>
            </div>

            <div className="flex gap-4">
              <Button type="button" onClick={prevStep} variant="outline" className="w-1/2">
                Back
              </Button>
              <Button
                type="button"
                onClick={nextStep}
                disabled={!formData.name || !formData.email || !formData.phone}
                className="w-1/2 bg-secondary-coral hover:bg-secondary-coral/90 text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-primary-dark mb-4">Booking Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-medium">
                    {formData.checkIn ? format(formData.checkIn, "PPP") : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-medium">
                    {formData.checkOut ? format(formData.checkOut, "PPP") : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests:</span>
                  <span className="font-medium">
                    {formData.guests} {Number.parseInt(formData.guests) === 1 ? "Guest" : "Guests"}
                  </span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{formData.phone}</span>
                  </div>
                </div>
                {formData.specialRequests && (
                  <div className="border-t pt-3 mt-3">
                    <span className="text-gray-600 block mb-1">Special Requests:</span>
                    <p className="text-sm">{formData.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg text-sm text-yellow-800">
              <p>
                <strong>Note:</strong> This is a booking request. We'll check availability and contact you to confirm
                your reservation. No payment is required at this stage.
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="button" onClick={prevStep} variant="outline" className="w-1/2">
                Back
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-1/2 bg-secondary-coral hover:bg-secondary-coral/90 text-white"
              >
                {loading ? "Submitting..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
