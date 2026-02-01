# Email Troubleshooting Guide

## Why aren't emails reaching Gmail?

### 1. **EmailJS Not Configured**
- **Symptom**: Console shows "EmailJS not configured" warnings
- **Solution**: Update `.env.local` with real EmailJS credentials (not placeholder values)

### 2. **Emails Going to Spam/Junk Folder**
- **Symptom**: Emails sent successfully but not in inbox
- **Solution**:
  - Check Gmail's Spam/Junk folder
  - Add EmailJS sender to your contacts
  - Mark emails as "Not Spam" if found

### 3. **EmailJS Service Issues**
- **Symptom**: Console shows EmailJS errors
- **Solution**:
  - Verify Service ID, Template ID, and Public Key are correct
  - Check EmailJS dashboard for service status
  - Ensure email service (Gmail/Outlook) is properly connected

### 4. **Gmail Security Blocks**
- **Symptom**: Emails blocked by Gmail security
- **Solution**:
  - Use a different email service in EmailJS (Outlook, Yahoo, etc.)
  - Enable "Less secure app access" in Gmail (not recommended)
  - Use EmailJS's built-in email service

### 5. **Template Configuration**
- **Symptom**: Emails sent but content is wrong/missing
- **Solution**:
  - Verify template variables match exactly: `{{guest_name}}`, `{{booking_id}}`, etc.
  - Check HTML template syntax in EmailJS dashboard

## Testing Email Setup

1. Go to Admin Panel → System tab
2. Enter your email address in the test field
3. Click "Send Test Email"
4. Check console for detailed error messages
5. Check inbox and spam folder

## Common EmailJS Errors

- **"Invalid service ID"**: Check VITE_EMAILJS_SERVICE_ID in .env.local
- **"Invalid template ID"**: Check VITE_EMAILJS_TEMPLATE_ID in .env.local
- **"Invalid user ID"**: Check VITE_EMAILJS_PUBLIC_KEY in .env.local
- **"Daily limit exceeded"**: EmailJS free plan limit reached (200 emails/day)

## Alternative Solutions

If EmailJS doesn't work for your needs, consider:
- **SendGrid**: Professional email service
- **Mailgun**: Transactional email service
- **AWS SES**: Amazon's email service
- **Backend API**: Create your own email endpoint

## Quick Test Commands

You can also test EmailJS directly in browser console:

```javascript
import emailjs from '@emailjs/browser';

emailjs.send(
  'your_service_id',
  'your_template_id',
  { to_email: 'test@example.com', subject: 'Test', message: 'Hello World' },
  'your_public_key'
).then(result => console.log('Success:', result))
 .catch(error => console.error('Error:', error));
```</content>
<parameter name="filePath">c:\Users\nitis\Downloads\hotel-himalayan-crown\EMAIL_TROUBLESHOOTING.md