import BookingForm from "@/components/booking-form"

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-30 pb-6">
      <div className="container mx-auto px-30">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Reserve Your Perfect Stay</h1>
          </div>

          <BookingForm />
        </div>
      </div>
    </div>
  )
}
