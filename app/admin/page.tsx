"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, type Timestamp } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"

interface Booking {
  id: string
  name: string
  email: string
  phone: string
  checkIn: Timestamp
  checkOut: Timestamp
  guests: string
  specialRequests?: string
  status: "pending" | "confirmed" | "cancelled"
  createdAt: Timestamp
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user)
      if (user) {
        fetchBookings()
      }
    })

    return () => unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await signInWithEmailAndPassword(auth, email, password)
      setIsLoggedIn(true)
      fetchBookings()
    } catch (error) {
      setError("Invalid email or password")
      console.error("Login error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setIsLoggedIn(false)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)

      const bookingsData: Booking[] = []
      querySnapshot.forEach((doc) => {
        bookingsData.push({ id: doc.id, ...doc.data() } as Booking)
      })

      setBookings(bookingsData)
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (id: string, status: "confirmed" | "cancelled") => {
    try {
      await updateDoc(doc(db, "bookings", id), { status })
      fetchBookings()
    } catch (error) {
      console.error("Error updating booking:", error)
    }
  }

  const deleteBooking = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteDoc(doc(db, "bookings", id))
        fetchBookings()
      } catch (error) {
        console.error("Error deleting booking:", error)
      }
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="pt-24 pb-16">
        <div className="container px-6 max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-primary-dark mb-8 text-center">Admin Login</h1>

          <div className="bg-white rounded-lg shadow-md p-8 border">
            {error && <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6">{error}</div>}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-secondary-coral"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-secondary-coral"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-dark hover:bg-primary-dark/90 text-white py-3"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-dark">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border mb-8">
          <h2 className="text-xl font-semibold text-primary-dark mb-4">Booking Requests</h2>

          {loading ? (
            <div className="text-center py-8">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No bookings found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Guest</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Dates</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Guests</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">{booking.name}</div>
                        <div className="text-sm text-gray-500">{booking.email}</div>
                        <div className="text-sm text-gray-500">{booking.phone}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <span className="font-medium">Check-in:</span>{" "}
                          {format(booking.checkIn.toDate(), "MMM d, yyyy")}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Check-out:</span>{" "}
                          {format(booking.checkOut.toDate(), "MMM d, yyyy")}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm">{booking.guests}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col space-y-2">
                          {booking.status === "pending" && (
                            <>
                              <Button
                                onClick={() => updateBookingStatus(booking.id, "confirmed")}
                                className="text-xs bg-green-600 hover:bg-green-700"
                                size="sm"
                              >
                                Confirm
                              </Button>
                              <Button
                                onClick={() => updateBookingStatus(booking.id, "cancelled")}
                                className="text-xs bg-red-600 hover:bg-red-700"
                                size="sm"
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          <Button
                            onClick={() => deleteBooking(booking.id)}
                            variant="outline"
                            className="text-xs"
                            size="sm"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
