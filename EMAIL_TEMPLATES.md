# EmailJS Templates for Hotel Himalayan Crown

## Table Booking Email Template

**Subject:** Table Reservation {{status}} - {{booking_id}}

**HTML Body:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Table Reservation {{status}}</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">🏔️ Hotel Himalayan Crown</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Your table reservation has been {{status}}</p>
    </div>

    <div style="background: white; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; padding: 30px;">
        <h2 style="color: #1f2937; margin-top: 0;">Dear {{guest_name}},</h2>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e3a8a; margin-top: 0;">Reservation Details</h3>
            <p><strong>Booking ID:</strong> {{booking_id}}</p>
            <p><strong>Date:</strong> {{booking_date}}</p>
            <p><strong>Time:</strong> {{booking_time}}</p>
            <p><strong>Number of Guests:</strong> {{guests}}</p>
            <p><strong>Table Number:</strong> {{table_number}}</p>
            <p><strong>Status:</strong> <span style="color: {{status}} === 'Confirmed' ? '#10b981' : '#f59e0b'; font-weight: bold;">{{status}}</span></p>
        </div>

        <p style="color: #6b7280; line-height: 1.6;">
            Thank you for choosing Hotel Himalayan Crown. We look forward to serving you an exceptional dining experience in the heart of the Himalayas.
        </p>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <h4 style="color: #1f2937; margin-bottom: 10px;">Contact Information</h4>
            <p style="margin: 5px 0;"><strong>Email:</strong> {{contact_email}}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> {{contact_phone}}</p>
            <p style="margin: 5px 0;"><strong>Hotel:</strong> {{hotel_name}}</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
                For any questions or changes to your reservation, please contact us directly.
            </p>
        </div>
    </div>
</body>
</html>
```

## Room Booking Email Template

**Subject:** Room Reservation {{status}} - {{booking_id}}

**HTML Body:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Room Reservation {{status}}</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">🏔️ Hotel Himalayan Crown</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Your room reservation has been {{status}}</p>
    </div>

    <div style="background: white; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; padding: 30px;">
        <h2 style="color: #1f2937; margin-top: 0;">Dear {{guest_name}},</h2>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e3a8a; margin-top: 0;">Reservation Details</h3>
            <p><strong>Booking ID:</strong> {{booking_id}}</p>
            <p><strong>Room Type:</strong> {{room_type}}</p>
            <p><strong>Check-in:</strong> {{check_in}}</p>
            <p><strong>Check-out:</strong> {{check_out}}</p>
            <p><strong>Nights:</strong> {{nights}}</p>
            <p><strong>Number of Rooms:</strong> {{rooms_count}}</p>
            <p><strong>Total Amount:</strong> {{total_price}}</p>
            <p><strong>Status:</strong> <span style="color: {{status}} === 'Confirmed' ? '#10b981' : '#f59e0b'; font-weight: bold;">{{status}}</span></p>
        </div>

        <p style="color: #6b7280; line-height: 1.6;">
            Thank you for choosing Hotel Himalayan Crown. We are delighted to welcome you to our luxury Himalayan retreat. Your reservation includes complimentary breakfast and access to all hotel amenities.
        </p>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <h4 style="color: #1f2937; margin-bottom: 10px;">Contact Information</h4>
            <p style="margin: 5px 0;"><strong>Email:</strong> {{contact_email}}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> {{contact_phone}}</p>
            <p style="margin: 5px 0;"><strong>Hotel:</strong> {{hotel_name}}</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
                For any questions or changes to your reservation, please contact us directly.
            </p>
        </div>
    </div>
</body>
</html>
```

## Setup Instructions

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Create a new email service (connect your Gmail/Outlook/etc.)
3. Create a new email template using the HTML above
4. Copy the Service ID, Template ID, and Public Key to your `.env.local` file
5. Test the email functionality by making a booking in your app

## Template Variables

### Table Booking Variables:
- `{{guest_name}}` - Guest's full name
- `{{booking_id}}` - Unique booking ID (e.g., HTC-A1B2C3)
- `{{booking_date}}` - Reservation date
- `{{booking_time}}` - Reservation time
- `{{guests}}` - Number of guests
- `{{table_number}}` - Assigned table number
- `{{status}}` - Booking status (Pending/Confirmed/Cancelled)
- `{{contact_email}}` - Hotel contact email
- `{{contact_phone}}` - Hotel contact phone
- `{{hotel_name}}` - Hotel name

### Room Booking Variables:
- `{{guest_name}}` - Guest's full name
- `{{booking_id}}` - Unique booking ID (e.g., HRC-R1S2T3)
- `{{room_type}}` - Room type name
- `{{check_in}}` - Check-in date
- `{{check_out}}` - Check-out date
- `{{nights}}` - Number of nights
- `{{rooms_count}}` - Number of rooms booked
- `{{total_price}}` - Total booking price
- `{{status}}` - Booking status (Pending/Confirmed/Cancelled)
- `{{contact_email}}` - Hotel contact email
- `{{contact_phone}}` - Hotel contact phone
- `{{hotel_name}}` - Hotel name</content>
<parameter name="filePath">c:\Users\nitis\Downloads\hotel-himalayan-crown\EMAIL_TEMPLATES.md