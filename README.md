<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. **Configure EmailJS** (for booking emails):
   - Sign up at [EmailJS](https://www.emailjs.com/)
   - Create an email service (Gmail, Outlook, etc.)
   - Create an email template using the HTML from `EMAIL_TEMPLATES.md`
   - Copy the Service ID, Template ID, and Public Key to your `.env.local` file:
     ```
     VITE_EMAILJS_SERVICE_ID=your_actual_service_id
     VITE_EMAILJS_TEMPLATE_ID=your_actual_template_id
     VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
     ```
   - Test the setup in the admin panel under "System" tab
4. Run the app:
   `npm run dev`
   hello my name is nikhil

