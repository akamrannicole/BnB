"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, type Timestamp } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, Send, CheckCircle, XCircle } from "lucide-react"
import { sendBookingEmail } from "@/app/actions/email-actions"

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
  nights: number
  totalPrice: number
  pricePerNight: number
}

interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  createdAt: Timestamp
  status: "unread" | "read"
}

interface Notification {
  id: string
  type: "success" | "error"
  message: string
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [emailSending, setEmailSending] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
  } | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user)
      if (user) {
        fetchBookings()
        fetchMessages()
      }
    })

    return () => unsubscribe()
  }, [])

  // Add a notification that will auto-remove after 5 seconds
  const addNotification = (type: "success" | "error", message: string) => {
    const id = Date.now().toString()
    setNotifications((prev) => [...prev, { id, type, message }])

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    }, 5000)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await signInWithEmailAndPassword(auth, email, password)
      setIsLoggedIn(true)
      fetchBookings()
      fetchMessages()
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

  const fetchMessages = async () => {
    try {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)

      const messagesData: ContactMessage[] = []
      querySnapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() } as ContactMessage)
      })

      setMessages(messagesData)
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const updateBookingStatus = async (id: string, status: "confirmed" | "cancelled") => {
    const booking = bookings.find((b) => b.id === id)
    if (!booking) return

    setEmailSending(id)

    try {
      // Update booking status in Firestore
      await updateDoc(doc(db, "bookings", id), { status })

      // Send email notification using server action
      const result = await sendBookingEmail(
        {
          ...booking,
          checkIn: booking.checkIn.toDate(),
          checkOut: booking.checkOut.toDate(),
        },
        status,
      )

      if (result.success) {
        addNotification("success", `Booking ${status === "confirmed" ? "confirmed" : "cancelled"} and email sent`)
      } else {
        addNotification("error", `Booking ${status} but failed to send email. Please contact the customer manually.`)
      }

      fetchBookings()
    } catch (error) {
      console.error("Error updating booking:", error)
      addNotification("error", "Failed to update booking status")
    } finally {
      setEmailSending(null)
    }
  }

  const deleteBooking = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Booking",
      message: "Are you sure you want to delete this booking? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, "bookings", id))
          fetchBookings()
          addNotification("success", "Booking deleted successfully")
        } catch (error) {
          console.error("Error deleting booking:", error)
          addNotification("error", "Failed to delete booking")
        }
      },
      onCancel: () => {},
    })
  }

  const deleteMessage = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Message",
      message: "Are you sure you want to delete this message? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, "messages", id))
          fetchMessages()
          addNotification("success", "Message deleted successfully")
        } catch (error) {
          console.error("Error deleting message:", error)
          addNotification("error", "Failed to delete message")
        }
      },
      onCancel: () => {},
    })
  }

  const markMessageAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "messages", id), { status: "read" })
      fetchMessages()
      addNotification("success", "Message marked as read")
    } catch (error) {
      console.error("Error updating message:", error)
      addNotification("error", "Failed to mark message as read")
    }
  }

  // Custom confirmation dialog component
  const ConfirmDialog = () => {
    if (!confirmDialog) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{confirmDialog.title}</h3>
          <p className="text-gray-600 mb-6">{confirmDialog.message}</p>
          <div className="flex justify-end space-x-3">
            <Button
              onClick={() => {
                confirmDialog.onCancel()
                setConfirmDialog(null)
              }}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                confirmDialog.onConfirm()
                setConfirmDialog(null)
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="pt-24 pb-16">
        <div className="container px-6 max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center">Admin Login</h1>

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
                  className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  className="w-full px-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const unreadMessages = messages.filter((msg) => msg.status === "unread").length

  return (
    <div className="pt-24 pb-16 relative">
      {/* Notifications */}
      <div className="fixed top-24 right-4 z-50 space-y-2 w-80">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-center p-4 rounded-lg shadow-lg border transition-all duration-300 animate-in slide-in-from-right ${
              notification.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            )}
            <p className="text-sm">{notification.message}</p>
          </div>
        ))}
      </div>

      {/* Custom Confirmation Dialog */}
      <ConfirmDialog />

      <div className="container px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Contact Messages Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-slate-800">Contact Messages</h2>
              {unreadMessages > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadMessages} new</span>
              )}
            </div>
            <Button onClick={fetchMessages} variant="outline" size="sm">
              Refresh
            </Button>
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p>No messages found</p>
              <p className="text-sm mt-1">Contact messages will appear here</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.slice(0, 5).map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg border ${
                    message.status === "unread" ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="font-medium text-gray-900">{message.name}</span>
                      {message.status === "unread" && (
                        <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">New</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(message.createdAt.toDate(), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Email:</span> {message.email}
                    {message.phone && (
                      <>
                        {" • "}
                        <span className="font-medium">Phone:</span> {message.phone}
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-800 mb-3">{message.message}</p>
                  <div className="flex gap-2">
                    {message.status === "unread" && (
                      <Button
                        onClick={() => markMessageAsRead(message.id)}
                        size="sm"
                        className="text-xs bg-blue-600 hover:bg-blue-700"
                      >
                        Mark as Read
                      </Button>
                    )}
                    <Button onClick={() => deleteMessage(message.id)} size="sm" variant="outline" className="text-xs">
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
              {messages.length > 5 && (
                <div className="text-center py-2">
                  <p className="text-sm text-gray-500">Showing latest 5 messages</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bookings Section */}
        <div className="bg-white rounded-lg shadow-md p-6 border mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-800">Booking Requests</h2>
            <Button onClick={fetchBookings} variant="outline" size="sm">
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No bookings found</p>
              <p className="text-sm mt-2">Bookings will appear here when customers submit requests</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Guest</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Dates</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Guests</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
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
                        <div className="text-xs text-gray-500">{booking.nights} nights</div>
                      </td>
                      <td className="px-4 py-4 text-sm">{booking.guests}</td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium">KSH {booking.totalPrice.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">KSH {booking.pricePerNight.toLocaleString()}/night</div>
                      </td>
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
                                disabled={emailSending === booking.id}
                                className="text-xs bg-green-600 hover:bg-green-700"
                                size="sm"
                              >
                                {emailSending === booking.id ? (
                                  <span className="flex items-center">
                                    <Send className="h-3 w-3 mr-1 animate-pulse" />
                                    Confirming...
                                  </span>
                                ) : (
                                  "Confirm & Email"
                                )}
                              </Button>
                              <Button
                                onClick={() => updateBookingStatus(booking.id, "cancelled")}
                                disabled={emailSending === booking.id}
                                className="text-xs bg-red-600 hover:bg-red-700"
                                size="sm"
                              >
                                {emailSending === booking.id ? (
                                  <span className="flex items-center">
                                    <Send className="h-3 w-3 mr-1 animate-pulse" />
                                    Cancelling...
                                  </span>
                                ) : (
                                  "Cancel & Email"
                                )}
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
