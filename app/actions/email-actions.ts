"use server"

import { Resend } from "resend"
import { format } from "date-fns"

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY)

interface BookingData {
  id: string
  name: string
  email: string
  phone: string
  checkIn: string | Date
  checkOut: string | Date
  guests: string
  specialRequests?: string
  nights: number
  totalPrice: number
  pricePerNight: number
}

export async function sendBookingEmail(booking: BookingData, status: "confirmed" | "cancelled") {
  try {
    // Format dates for email
    const checkInDate = format(
      typeof booking.checkIn === "string" ? new Date(booking.checkIn) : booking.checkIn,
      "EEEE, MMMM d, yyyy",
    )

    const checkOutDate = format(
      typeof booking.checkOut === "string" ? new Date(booking.checkOut) : booking.checkOut,
      "EEEE, MMMM d, yyyy",
    )

    const isConfirmed = status === "confirmed"
    const emailSubject = isConfirmed
      ? "✅ Your Booking is Confirmed - Kilimani Haven"
      : "❌ Booking Update - Kilimani Haven"

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${emailSubject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${isConfirmed ? "#10B981" : "#EF4444"}; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #666; }
            .total-amount { background: #f0f9ff; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .contact-info { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .button { display: inline-block; background: #F26D50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${isConfirmed ? "🎉 Booking Confirmed!" : "📋 Booking Update"}</h1>
              <p>Dear ${booking.name}</p>
            </div>
            
            <div class="content">
              ${
                isConfirmed
                  ? `
                <p>Great news! Your booking request has been confirmed. We're excited to host you at Kilimani Haven!</p>
                <p><strong>Your reservation is now secured for the dates below.</strong></p>
              `
                  : `
                <p>Thank you for your interest in Kilimani Haven. Unfortunately, we're unable to accommodate your booking request for the selected dates.</p>
                <p>This could be due to existing reservations or maintenance schedules. We apologize for any inconvenience.</p>
              `
              }
              
              <div class="booking-details">
                <h3>Booking Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Booking ID:</span>
                  <span>#${booking.id.slice(-8).toUpperCase()}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Guest Name:</span>
                  <span>${booking.name}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Check-in:</span>
                  <span>${checkInDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Check-out:</span>
                  <span>${checkOutDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Number of Guests:</span>
                  <span>${booking.guests}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Number of Nights:</span>
                  <span>${booking.nights}</span>
                </div>
                ${
                  booking.specialRequests
                    ? `
                <div class="detail-row">
                  <span class="detail-label">Special Requests:</span>
                  <span>${booking.specialRequests}</span>
                </div>
                `
                    : ""
                }
                
                <div class="total-amount">
                  <div class="detail-row" style="border: none; font-size: 18px;">
                    <span class="detail-label">Total Amount:</span>
                    <span><strong>KSH ${booking.totalPrice.toLocaleString()}</strong></span>
                  </div>
                  <small style="color: #666;">Rate: KSH ${booking.pricePerNight.toLocaleString()} per night</small>
                </div>
              </div>

              ${
                isConfirmed
                  ? `
                <div class="contact-info">
                  <h3>Important Information</h3>
                  <p><strong>Check-in Time:</strong> 3:00 PM - 8:00 PM</p>
                  <p><strong>Check-out Time:</strong> 11:00 AM</p>
                  <p><strong>Payment:</strong> We'll contact you within 24 hours to arrange payment and provide detailed check-in instructions.</p>
                  <p><strong>Location:</strong> Golden Mango Heights, Kilimani, Nairobi</p>
                </div>

                <div style="text-align: center;">
                  <a href="tel:+254713908113" class="button">Call Us: +254 713 908 113</a>
                </div>

                <p><strong>What's Next?</strong></p>
                <ul>
                  <li>We'll send you payment instructions within 24 hours</li>
                  <li>You'll receive detailed check-in instructions 48 hours before arrival</li>
                  <li>Feel free to contact us if you have any questions</li>
                </ul>
              `
                  : `
                <div class="contact-info">
                  <h3>Alternative Options</h3>
                  <p>We'd love to help you find alternative dates that work for both of us. Please feel free to:</p>
                  <ul>
                    <li>Contact us to discuss alternative dates</li>
                    <li>Submit a new booking request for different dates</li>
                    <li>Join our waitlist in case of cancellations</li>
                  </ul>
                </div>

                <div style="text-align: center;">
                  <a href="tel:+254713908113" class="button">Call Us: +254 713 908 113</a>
                </div>
              `
              }

              <div class="contact-info">
                <h3>Contact Information</h3>
                <p><strong>Phone:</strong> +254 713 908 113</p>
                <p><strong>Email:</strong> kilimani.haven@gmail.com</p>
                <p><strong>Address:</strong> Golden Mango Heights, Kilimani, Nairobi, Kenya</p>
              </div>
            </div>

            <div class="footer">
              <p>Thank you for choosing Kilimani Haven!</p>
              <p>This is an automated email. Please do not reply directly to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const emailText = `
      ${isConfirmed ? "Booking Confirmed" : "Booking Update"} - Kilimani Haven
      
      Dear ${booking.name},
      
      ${
        isConfirmed
          ? "Great news! Your booking request has been confirmed."
          : "Thank you for your interest. Unfortunately, we cannot accommodate your booking for the selected dates."
      }
      
      Booking Details:
      - Booking ID: #${booking.id.slice(-8).toUpperCase()}
      - Check-in: ${checkInDate}
      - Check-out: ${checkOutDate}
      - Guests: ${booking.guests}
      - Nights: ${booking.nights}
      - Total Amount: KSH ${booking.totalPrice.toLocaleString()}
      
      Contact us: +254 713 908 113 | kilimani.haven@gmail.com
      
      Thank you for choosing Kilimani Haven!
    `

    // For testing without Resend API key, uncomment this
    // console.log("Would send email to:", booking.email);
    // console.log("Email subject:", emailSubject);
    // console.log("Email content:", emailText);
    // return { success: true };

    // Send the email using Resend
    const data = await resend.emails.send({
      from: "Kilimani Haven <bookings@kilimani-haven.com>",
      to: [booking.email],
      subject: emailSubject,
      html: emailHtml,
      text: emailText,
    })

    return { success: true, data }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error: String(error) }
  }
}
