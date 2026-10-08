import emailjs from '@emailjs/browser'

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''

/**
 * Checks if EmailJS credentials are configured in .env
 */
export const isEmailConfigured = () => {
  return (
    typeof serviceId === 'string' &&
    serviceId.trim().length > 0 &&
    typeof templateId === 'string' &&
    templateId.trim().length > 0 &&
    typeof publicKey === 'string' &&
    publicKey.trim().length > 0
  )
}

/**
 * Sends contact form submissions directly to your Gmail inbox.
 * Securely uses EmailJS with Google OAuth (no Gmail passwords ever stored in frontend).
 */
export async function sendEmailToGmail({ name, contactInfo, message }) {
  if (!isEmailConfigured()) {
    return {
      success: true,
      fallback: true,
      message: 'EmailJS not yet configured. Form will save to Supabase.',
    }
  }

  try {
    const templateParams = {
      from_name: name.trim(),
      from_contact: contactInfo.trim(),
      message: message.trim(),
      site_name: 'Mana Sathuluru',
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    }

    const response = await emailjs.send(serviceId, templateId, templateParams, publicKey)
    return { success: true, status: response.status, text: response.text }
  } catch (error) {
    console.error('EmailJS error delivering to Gmail:', error)
    return { success: false, error: error?.text || error?.message || 'Failed to dispatch email' }
  }
}
